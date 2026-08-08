# Artifact do BMad sinh ra

Thư mục này **được track**, vì brief, PRD, architecture và epic là sản phẩm chung của team,
không phải file tạm.

```
planning-artifacts/
├── briefs/brief-{project}-{date}/     brief.md · addendum.md · .memlog.md
├── prds/prd-{project}-{date}/         prd.md · addendum.md · .memlog.md
└── …
implementation-artifacts/              sprint status, story spec
```

`.memlog.md` là nhật ký quyết định của mỗi lần chạy — **đừng xoá**, nó là thứ cho phép resume
và audit. BMad ghi vào đó qua `_bmad/scripts/memlog.py`, không sửa tay.

Đường dẫn cấu hình ở `_bmad/bmm/config.yaml` (`planning_artifacts`, `implementation_artifacts`).
