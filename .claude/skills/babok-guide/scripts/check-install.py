#!/usr/bin/env python
"""Kiem tra skill babok-guide con khop voi ban cai BMad hay khong.

VI SAO CAN
    Skill nay ban dau duoc dung dua tren SOURCE GitHub cua BMad, khong phai BAN CAI.
    Hai thu khac nhau dang ke, va da gay 4 loi that:
      1. bmad-advanced-elicitation ban cai KHONG co customize.toml -> override vo tac dung
      2. module-help.csv khac: bmad-build -> bmad-create-story + bmad-dev-story, them
         bmad-check-implementation-readiness, doi ten bmad-project-context -> GPC
      3. gap profile do tren src/ lech voi ban cai o 12/14 khai niem
      4. do gap profile bi nhiem boi chinh 12 method minh chen vao methods.csv

    Script nay bien ca lop loi do thanh MOT lenh.

CHAY (tu goc project), sau MOI lan update BMad:
    python .claude/skills/babok-guide/references/bmad-custom/check-install.py

CO CHE
    --update-baseline   ghi lai gap profile hien tai lam moc so sanh
    --update-csv        cap nhat cot bmad_gap trong assets/techniques.csv theo so do duoc

Exit code 0 = moi thu khop. 1 = co canh bao can xu ly.
"""

import argparse
import csv
import datetime
import difflib
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL_ROOT = os.path.dirname(HERE)
BASELINE = os.path.join(HERE, "gap-baseline.json")
CUSTOM_DIR = os.path.join(SKILL_ROOT, "references", "bmad-custom")

# Noi dung do CHINH SKILL NAY chen vao — phai loai khi do, neu khong se do chinh minh.
SELF_INJECTED = ["bmad-advanced-elicitation/methods.csv"]

# section -> regex tim trong ban cai.
#
# CHI dung cum tu DAC TRUNG. Tu tieng Anh thong thuong sinh duong tinh gia va lam hong ca
# so do — da mac 2 lan that:
#   - "permission" khop UI state `permission-denied` va ten method brainstorm `Permission Giving`
#   - "observation" khop "manual observation" (testing) va "this observation" (retro)
# Ky thuat khong do duoc bang tu khoa nam o UNMEASURABLE, giu bmad_gap rong = "chua do".
PATTERNS = {
    "10.1": r"acceptance criteria",
    "10.5": r"brainstorm",
    "10.9": r"business rule",
    "10.15": r"data model",
    "10.18": r"document analysis",
    "10.21": r"focus group",
    "10.23": r"glossary",
    "10.27": r"lessons learned|retrospective",
    "10.30": r"non-functional",
    "10.33": r"prioriti",
    "10.35": r"process model",
    "10.39": r"roles and permissions|permissions matrix",
    "10.42": r"sequence diagram",
    "10.43": r"(?<![a-z])personas?(?![a-z])",   # khong ranh gioi -> khop "personal" (140 lan)
    "10.44": r"state model|state machine|state transition",
    "10.48": r"user stor|epics and stories|story spec|story file|story context",
    "10.50": r"workshop",
    # Sac thai cua 10.15: BMad NOI nhieu ve data model (covered) nhung chi sinh mot ERD
    # TOI GIAN. spine-template ghi: "core-entity ERD (names + relationships only; an
    # attribute that's itself an invariant is an AD, not a diagram)". Loai thuoc tinh la
    # CO Y, khong phai thieu sot. Gia tri bu cua 10.15 = cardinality + thuoc tinh + ba
    # tang conceptual/logical/physical, tuc "khi can hon muc spine".
    #
    # Lookaround BAT BUOC: khong co ranh gioi tu, "erd" khop trong "verdict" -> 22 file thay vi 1.
    # Khoa co dau "-" khong phai section, khong ghi vao techniques.csv.
    "10.15-erd": r"entity relationship|(?<![a-z])erd(?![a-z])|er diagram",
}

# Khong do duoc bang tu khoa — tu qua thong thuong, moi pattern thu deu cho duong tinh gia.
# Danh gia cho nhung ky thuat nay phai lam THU CONG, va co mot bang chung manh hon:
# catalog elicitation cua BMad co 71 method, KHONG cai nao la ky thuat khai thac nguoi that.
UNMEASURABLE = {
    "10.25": "interview — khop 'user interviews' trong mo ta agent-pm, 'Future Self Interview'",
    "10.31": "observation — khop 'manual observation' (testing), 'this observation' (retro)",
    "10.37": "review — tu qua pho bien, xuat hien o gan nhu moi skill",
    "10.45": "survey — khop 'survey exports' trong market research",
}

# Nguong phan loai. `covered` = BMad manh, DUNG bu. `absent` = cho dang bu nhat.
#
# VI SAO 8 VA 3: chon tu phan bo thuc te tren 234 file cua ban cai. So lieu tach thanh hai
# cum ro rang, khong co gia tri nao roi vao khoang 8..10 hay 3..4:
#   0, 0, 0, 2, 2, 2, 2, 2   <- nhac thoang hoac khong co
#   5, 7                     <- co nhung mong
#   11, 11, 20, 23, 23, 23, 45  <- phu that
# Nguong dat vao giua hai khe trong do. Doi nguong se lam mot so ky thuat doi phan loai —
# vi du COVERED_MIN=12 se day `data model` (11) tu covered xuong thin va dao nguoc ket luan
# ve 10.15. Neu doi, phai chay lai --update-baseline va doc lai SKILL.md.
COVERED_MIN, THIN_MIN = 8, 3


def classify(n):
    return "covered" if n >= COVERED_MIN else ("thin" if n >= THIN_MIN else "absent")


def measure(project_root):
    """Dem so file trong .claude/skills/ nhac toi tung khai niem, loai noi dung tu chen."""
    skills_dir = os.path.join(project_root, ".claude", "skills")
    files = []
    for root, _dirs, names in os.walk(skills_dir):
        if "babok-guide" in root.replace("\\", "/").split("/"):
            continue
        for n in names:
            p = os.path.join(root, n)
            rel = os.path.relpath(p, skills_dir).replace("\\", "/")
            if any(rel.endswith(s) for s in SELF_INJECTED):
                continue
            files.append(p)

    texts = []
    for p in files:
        try:
            with open(p, encoding="utf-8", errors="ignore") as f:
                texts.append(f.read().lower())
        except OSError:
            pass

    out, broad = {}, []
    for sec, pat in PATTERNS.items():
        rx = re.compile(pat, re.I)
        out[sec] = sum(1 for t in texts if rx.search(t))
        # Heuristic ve sinh pattern: khop qua nhieu file thuong la duong tinh gia.
        # Da mac 3 lan: "permission" (UI state), "erd" (trong "verdict"), "persona" (trong
        # "personal"). Canh bao de nguoi doc kiem bang mat thay vi tin so.
        if len(files) and out[sec] / len(files) > 0.25:
            broad.append(f"{sec} khop {out[sec]}/{len(files)} file ({out[sec]*100//len(files)}%)")
    return out, len(files), broad


def check_methods(project_root, problems):
    csv_p = os.path.join(project_root, ".claude", "skills",
                         "bmad-advanced-elicitation", "methods.csv")
    if not os.path.exists(csv_p):
        problems.append("methods.csv khong ton tai — BMad da cai chua?")
        return
    with open(csv_p, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    n = sum(1 for r in rows if r.get("category") == "babok")
    toml_p = os.path.join(CUSTOM_DIR, "bmad-advanced-elicitation.toml")
    import tomllib
    with open(toml_p, "rb") as f:
        want = len(tomllib.load(f)["workflow"]["additional_methods"])
    status = "OK" if n == want else "THIEU"
    print(f"  [{status}] catalog elicitation: {n}/{want} method BABOK ({len(rows)} tong)")
    if n != want:
        problems.append(f"catalog thieu {want - n} method — chay apply-methods.py")


def check_overrides(project_root, problems):
    resolver = os.path.join(project_root, "_bmad", "scripts", "resolve_customization.py")
    if not os.path.exists(resolver):
        problems.append("khong tim thay _bmad/scripts/resolve_customization.py")
        return
    custom_dir = os.path.join(project_root, "_bmad", "custom")
    mine = [f for f in os.listdir(custom_dir)
            if f.startswith("bmad-") and f.endswith(".toml")] if os.path.isdir(custom_dir) else []
    for f in sorted(mine):
        name = f[:-5]
        skill_dir = os.path.join(project_root, ".claude", "skills", name)
        has_customize = os.path.exists(os.path.join(skill_dir, "customize.toml"))
        if not has_customize:
            print(f"  [CANH BAO] {name}: skill KHONG co customize.toml -> override VO TAC DUNG")
            problems.append(f"{name}: override vo tac dung, can co che khac")
            continue
        try:
            r = subprocess.run(["uv", "run", resolver, "--skill", skill_dir, "--key", "workflow"],
                               capture_output=True, text=True, cwd=project_root, timeout=90)
            pf = json.loads(r.stdout)["workflow"].get("persistent_facts", [])
            n = sum(1 for x in pf if "babok" in str(x).lower() or "BABOK" in str(x))
            print(f"  [{'OK' if n else 'THIEU'}] {name}: {len(pf)} fact, {n} cua babok-guide")
            if not n:
                problems.append(f"{name}: override khong duoc nap")
        except Exception as e:
            problems.append(f"{name}: resolver loi — {e}")


def check_workflow_names(project_root, problems):
    wf = os.path.join(SKILL_ROOT, "references", "workflow.md")
    mh = os.path.join(project_root, "_bmad", "bmm", "module-help.csv")
    if not (os.path.exists(wf) and os.path.exists(mh)):
        problems.append("thieu workflow.md hoac module-help.csv")
        return
    with open(mh, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    codes = {r["menu-code"] for r in rows if r.get("menu-code")}
    txt = open(wf, encoding="utf-8").read()
    used = set(re.findall(r"`([A-Z]{2,4})`", txt)) & (codes | {"IR", "GPC", "QQ"})
    bad_codes = used - codes
    skills_dir = os.path.join(project_root, ".claude", "skills")
    named = {m for m in re.findall(r"`?(bmad-[a-z][a-z-]{3,})`?", txt)}
    bad_skills = {s for s in named if not os.path.isdir(os.path.join(skills_dir, s))
                  and s not in ("bmad-method", "bmad-custom")}
    ok = not bad_codes and not bad_skills
    print(f"  [{'OK' if ok else 'LECH'}] workflow.md: {len(used)} ma lenh, {len(named)} ten skill")
    if bad_codes:
        problems.append(f"workflow.md dung ma khong co: {sorted(bad_codes)}")
    if bad_skills:
        problems.append(f"workflow.md dung skill khong ton tai: {sorted(bad_skills)}")



def check_source_vs_installed(project_root, problems):
    """So tung cap file nguon <-> ban cai.

    VI SAO CAN: `check_overrides` chi DEM so fact. Neu ban cai la phien ban cu cua cung file
    nguon — cung so fact nhung noi dung khac — no van bao [OK]. Day la drift nguy hiem nhat:
    nguon dung, ban cai sai, khong co gi bao. Diff bat duoc ngay.
    """
    src_dir = CUSTOM_DIR
    dst_dir = os.path.join(project_root, "_bmad", "custom")
    if not os.path.isdir(dst_dir):
        problems.append("khong tim thay _bmad/custom/ — da chay `npx bmad-method install` chua?")
        return
    names = sorted(f for f in os.listdir(src_dir)
                   if f.startswith("bmad-") and f.endswith(".toml"))
    for n in names:
        src, dst = os.path.join(src_dir, n), os.path.join(dst_dir, n)
        if n == "bmad-advanced-elicitation.toml":
            continue  # khong cai qua _bmad/custom, xem check_methods
        if not os.path.exists(dst):
            print(f"  [THIEU]  {n}: co o nguon, CHUA cai vao _bmad/custom/")
            problems.append(f"{n}: chua copy vao _bmad/custom/ — chay lenh cai o README")
            continue
        a = open(src, encoding="utf-8").read()
        b = open(dst, encoding="utf-8").read()
        if a == b:
            print(f"  [OK]     {n}: khop nguon")
        else:
            d = list(difflib.unified_diff(a.splitlines(), b.splitlines(),
                                          "nguon", "ban cai", lineterm="", n=0))
            n_add = sum(1 for x in d if x.startswith("+") and not x.startswith("+++"))
            n_del = sum(1 for x in d if x.startswith("-") and not x.startswith("---"))
            print(f"  [LECH]   {n}: ban cai khac nguon (+{n_add}/-{n_del} dong)")
            for line in d[2:8]:
                print(f"           {line[:96]}")
            problems.append(f"{n}: ban cai LECH nguon — copy lai tu references/bmad-custom/")


def _build_babok_index(txt_path):
    """Dung tap section hop le tu van ban BABOK.

    BABOK viet cap 2-3 nguyen dang (`10.9`, `10.9.4` co tab theo sau) nhung cap 4 thi KHONG:
    no la `.1	Strengths` nam ngay duoi tieu de cap 3. Nen phai ghep cha + `.N`.
    """
    s = open(txt_path, encoding="utf-8", errors="ignore").read()
    valid = set()
    heads = []  # (vi tri, so hieu)
    for m in re.finditer(r"(?m)^(\d{1,2}\.\d{1,2}(?:\.\d{1,2})?)	", s):
        valid.add(m.group(1))
        heads.append((m.start(), m.group(1)))
        parts = m.group(1).split(".")
        if len(parts) == 3:
            valid.add(f"{parts[0]}.{parts[1]}")
    heads.sort()
    for i, (pos, sec) in enumerate(heads):
        if sec.count(".") != 2:
            continue
        end = heads[i + 1][0] if i + 1 < len(heads) else len(s)
        for sm in re.finditer(r"(?m)^\s*\.(\d{1,2})	", s[pos:end]):
            valid.add(f"{sec}.{sm.group(1)}")
    return valid


def check_citations(project_root, problems, txt_path=None):
    """Doi chieu moi so hieu section trong tai lieu skill vao van ban BABOK.

    GIOI HAN: chi bat duoc LECH CAP hoac SECTION KHONG TON TAI. KHONG bat duoc hai loai
    con lai vi chung can doc hieu:
      - sai ngu nghia: section co that nhung noi dung dan khong dung y muc do
      - gan nham nguon: trich nguyen van dung nhung gan cho section khac
    Hai loai do phai doi chieu bang mat, xem QUERY-TEMPLATE.md o kho ban ghi.
    """
    if not txt_path:
        for c in [os.path.join(project_root, "BABOK_Guide_v3_Member.txt"),
                  os.environ.get("BABOK_TXT", "")]:
            if c and os.path.exists(c):
                txt_path = c
                break
    if not txt_path or not os.path.exists(txt_path):
        print("  [BO QUA] khong tim thay BABOK_Guide_v3_Member.txt")
        print("           File co ban quyen nen KHONG nam trong repo. Ai co ban rieng thi chay:")
        print("           --babok-txt <duong-dan>  hoac dat bien moi truong BABOK_TXT")
        return

    valid = _build_babok_index(txt_path)
    print(f"  chi muc: {len(valid)} section hop le tu {os.path.basename(txt_path)}")

    files = []
    for root, _d, names in os.walk(SKILL_ROOT):
        for n in names:
            if n.endswith((".md", ".toml", ".csv")):
                files.append(os.path.join(root, n))

    bad, checked = [], 0
    for f in files:
        for i, line in enumerate(open(f, encoding="utf-8", errors="ignore"), 1):
            # bo dong noi ve phien ban BMad, khong phai trich dan BABOK
            if re.search(r"BMad|version|v6\.|phien ban", line, re.I):
                continue
            for m in re.finditer(r"(?<![\w.])(\d{1,2}\.\d{1,2}(?:\.\d{1,2}){0,2})(?![\w.])", line):
                sec = m.group(1)
                if not (1 <= int(sec.split(".")[0]) <= 11):
                    continue  # BABOK chi co chuong 1-11
                checked += 1
                if sec not in valid:
                    bad.append((os.path.relpath(f, SKILL_ROOT).replace("\\", "/"), i, sec))

    if not bad:
        print(f"  [OK] {checked} trich dan, tat ca ton tai trong van ban")
        return
    print(f"  [LECH] {len(bad)}/{checked} trich dan KHONG tim thay trong van ban:")
    seen = set()
    for f, i, sec in bad:
        if (f, sec) in seen:
            continue
        seen.add((f, sec))
        print(f"         {sec:12} {f}:{i}")
    problems.append(f"{len(seen)} trich dan section khong ton tai trong BABOK")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project-root", default=os.getcwd())
    ap.add_argument("--babok-txt", help="duong dan BABOK_Guide_v3_Member.txt de kiem trich dan")
    ap.add_argument("--update-baseline", action="store_true")
    ap.add_argument("--update-csv", action="store_true")
    a = ap.parse_args()
    root = os.path.abspath(a.project_root)
    problems = []

    print("== 1. Catalog elicitation ==")
    check_methods(root, problems)

    print("\n== 2. Override persistent_facts ==")
    check_overrides(root, problems)

    print("\n== 3. Nguon vs ban cai — diff tung cap file ==")
    check_source_vs_installed(root, problems)

    print("\n== 4. Ten skill / ma lenh trong workflow.md ==")
    check_workflow_names(root, problems)

    print("\n== 5. Trich dan section BABOK ==")
    check_citations(root, problems, a.babok_txt)

    print("\n== 6. Gap profile (do tren ban cai, loai noi dung tu chen) ==")
    prof, nfiles, broad = measure(root)
    print(f"  quet {nfiles} file trong .claude/skills/ (tru babok-guide va methods.csv)")
    for b in broad:
        print(f"  [KIEM TAY] {b} — pattern co the qua rong, kiem duong tinh gia")
    old = {}
    if os.path.exists(BASELINE):
        old = json.load(open(BASELINE, encoding="utf-8")).get("counts", {})
    drift = [(s, old[s], v) for s, v in sorted(prof.items(), key=lambda x: (float(x[0][3:].split("-")[0]), x[0]))
             if s in old and old[s] != v]
    erd = prof.get("10.15-erd")
    if erd is not None:
        print(f"  [SAC THAI] artifact ERD: {erd} file — `data model` la covered ({prof.get('10.15','?')} file)")
        print("             nhung BMad co y gioi han ERD o 'names + relationships only'.")
        print("             Bu cua 10.15 = cardinality + thuoc tinh + ba tang, khong phai bu khai niem.")
    if old and drift:
        for s, o, n in drift:
            print(f"  [LECH] {s}: {o} -> {n}  ({classify(o)} -> {classify(n)})")
        problems.append(f"{len(drift)} khai niem lech so voi baseline")
    elif old:
        print("  [OK] khong lech so voi baseline")
    else:
        print("  [INFO] chua co baseline — chay lai voi --update-baseline")

    if a.update_baseline:
        bmad_ver = "?"
        mf = os.path.join(root, "_bmad", "_config", "manifest.yaml")
        if os.path.exists(mf):
            m = re.search(r"version:\s*([\d.]+)", open(mf, encoding="utf-8").read())
            if m:
                bmad_ver = m.group(1)
        json.dump({"bmad_version": bmad_ver,
                   "measured_at": datetime.date.today().isoformat(),
                   "scanned_files": nfiles,
                   "excluded": SELF_INJECTED, "thresholds": {"covered": COVERED_MIN, "thin": THIN_MIN},
                   "counts": prof},
                  open(BASELINE, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
        print(f"  -> da ghi baseline: {os.path.basename(BASELINE)}")

    if a.update_csv:
        p = os.path.join(SKILL_ROOT, "assets", "techniques.csv")
        with open(p, encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
            fields = list(rows[0].keys())
        changed = []
        for r in rows:
            sec = r["section"]
            if sec in UNMEASURABLE and r["bmad_gap"] != "unmeasurable":
                changed.append(f"{sec} {r['name_en']}: {r['bmad_gap'] or '(trong)'} -> unmeasurable")
                r["bmad_gap"] = "unmeasurable"
            elif sec in prof and "-" not in sec:
                new = classify(prof[sec])
                if r["bmad_gap"] != new:
                    changed.append(f"{sec} {r['name_en']}: {r['bmad_gap'] or '(trong)'} -> {new}")
                    r["bmad_gap"] = new
        with open(p, "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=fields)
            w.writeheader(); w.writerows(rows)
        print(f"\n  -> techniques.csv: sua {len(changed)} dong")
        for c in changed:
            print("     ", c)

    print("\n" + "=" * 60)
    if problems:
        print(f"CAN XU LY ({len(problems)}):")
        for x in problems:
            print("  -", x)
        return 1
    print("Moi thu khop voi ban cai.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
