#!/usr/bin/env python
"""Chèn các method BABOK vào catalog elicitation của BMad đã cài.

VÌ SAO CẦN SCRIPT NÀY
    Source trên GitHub của bmad-advanced-elicitation có `customize.toml` +
    `scripts/pick_methods.py`, hỗ trợ `additional_methods` qua file override.
    Nhưng **bản cài bằng `npx bmad-method install` v6.10.0 KHÔNG có hai thứ đó** —
    nó chỉ có `SKILL.md` + `methods.csv`, và SKILL.md đọc thẳng `./methods.csv`.

    Nên cơ chế override qua `_bmad/custom/bmad-advanced-elicitation.toml` là VÔ TÁC DỤNG
    với bản cài hiện tại. Phải chèn thẳng vào CSV.

KHI NÀO CHẠY
    - Lần đầu sau khi cài BMad
    - **Mỗi lần cập nhật BMad** — update sẽ ghi đè methods.csv và xoá mất các method BABOK

CÁCH CHẠY (từ gốc project)
    python .claude/skills/babok-guide/references/bmad-custom/apply-methods.py

Script idempotent: chạy nhiều lần không nhân bản. Tự backup methods.csv.orig lần đầu.
"""

import csv
import os
import shutil
import sys
import tomllib

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "bmad-advanced-elicitation.toml")
FIELDS = ["num", "category", "method_name", "description", "output_pattern"]


def find_catalog(project_root):
    p = os.path.join(project_root, ".claude", "skills", "bmad-advanced-elicitation", "methods.csv")
    return p if os.path.exists(p) else None


def main():
    project_root = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    dst = find_catalog(project_root)
    if not dst:
        sys.exit("Khong tim thay .claude/skills/bmad-advanced-elicitation/methods.csv — "
                 "da chay `npx bmad-method install` chua?")

    if not os.path.exists(dst + ".orig"):
        shutil.copy(dst, dst + ".orig")
        print(f"backup: {os.path.basename(dst)}.orig")

    with open(dst, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    existing = {r["method_name"] for r in rows}
    nums = [int(r["num"]) for r in rows if r["num"].isdigit()]
    nxt = max(nums) + 1 if nums else 1

    with open(SRC, "rb") as f:
        extras = tomllib.load(f)["workflow"]["additional_methods"]

    added, updated = [], []
    by_name = {r["method_name"]: r for r in rows}
    for e in extras:
        if e["method_name"] in existing:
            r = by_name[e["method_name"]]
            for f in ("category", "description", "output_pattern"):
                if r[f] != e[f]:
                    r[f] = e[f]
                    if e["method_name"] not in updated:
                        updated.append(e["method_name"])
            continue
        rows.append({
            "num": str(nxt),
            "category": e["category"],
            "method_name": e["method_name"],
            "description": e["description"],
            "output_pattern": e["output_pattern"],
        })
        added.append(f'{nxt} {e["method_name"]}')
        nxt += 1

    if not added and not updated:
        print(f"Da co day du {len(extras)} method BABOK — khong thay doi gi.")
        return
    if updated:
        print(f"Da cap nhat mo ta {len(updated)} method: {', '.join(updated)}")
    if not added:
        with open(dst, "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=FIELDS)
            w.writeheader(); w.writerows(rows)
        return

    with open(dst, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)

    print(f"Da them {len(added)} method vao catalog ({len(rows)} tong):")
    for a in added:
        print("  ", a)


if __name__ == "__main__":
    main()
