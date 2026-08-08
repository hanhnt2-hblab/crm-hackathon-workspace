# Git hooks

Bật một lần cho mỗi bản clone:

```bash
git config core.hooksPath .githooks
```

Không bật thì phải tự nhớ chạy hai script sau mỗi lần update BMad — xem `README.md` mục Bảo trì.

| Hook | Khi nào chạy | Làm gì |
|---|---|---|
| `post-merge` | sau `git pull` / `git merge` | Nếu `.claude/skills/bmad-*` đổi thì chạy `apply-methods.py` rồi `check-install.py` |

Hook cố ý **không** chặn (`exit 0` khi lỗi) — nó cảnh báo chứ không làm hỏng merge.
