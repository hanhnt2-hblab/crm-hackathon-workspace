#!/usr/bin/env python
"""Chèn các method BABOK vào catalog elicitation của BMad đã cài.

VÌ SAO CẦN SCRIPT NÀY
    Source trên GitHub của bmad-advanced-elicitation có `customize.toml` và
    `scripts/pick_methods.py`, hỗ trợ `additional_methods` qua file override. Nhưng
    **bản cài bằng `npx bmad-method install` v6.10.0 không có hai thứ đó** — nó chỉ có
    `SKILL.md` và `methods.csv`, và SKILL.md đọc thẳng `./methods.csv`.

    Nên override qua `_bmad/custom/bmad-advanced-elicitation.toml` là VÔ TÁC DỤNG với bản
    cài hiện tại. Phải chèn thẳng vào CSV.

KHI NÀO CHẠY
    - Lần đầu sau khi cài BMad
    - **Mỗi lần cập nhật BMad** — update ghi đè methods.csv và xoá mất các method BABOK

CÁCH CHẠY (từ gốc project)
    python .claude/skills/babok-guide/scripts/apply-methods.py
    python .claude/skills/babok-guide/scripts/apply-methods.py --restore   # hoàn nguyên
    python .claude/skills/babok-guide/scripts/apply-methods.py --dry-run   # xem trước

Script idempotent: chạy nhiều lần không nhân bản, và tự cập nhật mô tả nếu file nguồn đổi.
Lần đầu tự sao lưu `methods.csv.orig` — đó cũng là bản gốc dùng cho `--restore`.
"""

import argparse
import csv
import os
import shutil
import sys
import tomllib

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL_ROOT = os.path.dirname(HERE)
SRC = os.path.join(SKILL_ROOT, "references", "bmad-custom", "bmad-advanced-elicitation.toml")
FIELDS = ["num", "category", "method_name", "description", "output_pattern"]


def find_catalog(project_root):
    p = os.path.join(project_root, ".claude", "skills",
                     "bmad-advanced-elicitation", "methods.csv")
    return p if os.path.exists(p) else None


def restore(dst):
    orig = dst + ".orig"
    if not os.path.exists(orig):
        sys.exit(f"Không có bản sao lưu {os.path.basename(orig)} — không hoàn nguyên được.")
    shutil.copy(orig, dst)
    with open(dst, encoding="utf-8") as f:
        n = len(list(csv.DictReader(f)))
    print(f"Đã hoàn nguyên {os.path.basename(dst)} về bản gốc BMad ({n} method).")
    print("Chạy lại script không có --restore để chèn lại method BABOK.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project-root", default=os.getcwd())
    ap.add_argument("--restore", action="store_true",
                    help="hoàn nguyên methods.csv về bản gốc BMad từ file .orig")
    ap.add_argument("--dry-run", action="store_true", help="chỉ báo sẽ đổi gì, không ghi")
    a = ap.parse_args()

    dst = find_catalog(os.path.abspath(a.project_root))
    if not dst:
        sys.exit("Không tìm thấy .claude/skills/bmad-advanced-elicitation/methods.csv — "
                 "đã chạy `npx bmad-method install` chưa?")

    if a.restore:
        return restore(dst)

    if not os.path.exists(dst + ".orig"):
        if not a.dry_run:
            shutil.copy(dst, dst + ".orig")
        print(f"sao lưu: {os.path.basename(dst)}.orig")

    with open(dst, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    by_name = {r["method_name"]: r for r in rows}
    nums = [int(r["num"]) for r in rows if r["num"].isdigit()]
    nxt = max(nums) + 1 if nums else 1

    with open(SRC, "rb") as f:
        extras = tomllib.load(f)["workflow"]["additional_methods"]

    added, updated = [], []
    for e in extras:
        if e["method_name"] in by_name:
            r = by_name[e["method_name"]]
            for fld in ("category", "description", "output_pattern"):
                if r[fld] != e[fld]:
                    r[fld] = e[fld]
                    if e["method_name"] not in updated:
                        updated.append(e["method_name"])
            continue
        rows.append({"num": str(nxt), "category": e["category"],
                     "method_name": e["method_name"], "description": e["description"],
                     "output_pattern": e["output_pattern"]})
        added.append(f'{nxt} {e["method_name"]}')
        nxt += 1

    if not added and not updated:
        print(f"Đã có đủ {len(extras)} method BABOK — không thay đổi gì.")
        return

    if a.dry_run:
        print(f"[dry-run] sẽ thêm {len(added)}, cập nhật {len(updated)}")
    else:
        with open(dst, "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=FIELDS)
            w.writeheader()
            w.writerows(rows)

    if updated:
        print(f"Đã cập nhật mô tả {len(updated)} method: {', '.join(updated)}")
    if added:
        print(f"Đã thêm {len(added)} method vào catalog ({len(rows)} tổng):")
        for x in added:
            print("  ", x)


if __name__ == "__main__":
    main()
