# License bên thứ ba

> ⚠ **Ngoài MIT còn có điều khoản trademark.** `BMad™`, `BMad Method™`, `BMad Core™` là nhãn
> hiệu của BMad Code, LLC — **mọi cách viết hoa và biến thể** (BMAD, bmad, BMadMethod,
> BMAD-METHOD…). MIT cho phép dùng, sửa và phát hành lại **mã**, nhưng **không** cấp quyền
> dùng tên thương hiệu cho mục đích khác.
>
> Thực tế với repo này: giữ nguyên tên BMad khi **nhắc tới sản phẩm của họ** là đúng và cần
> thiết (ghi nguồn). Nhưng **đừng đặt tên sản phẩm, dịch vụ hay bài dự thi của mình** theo
> kiểu chứa "BMad" — ví dụ "BMad CRM" hay "CRM by BMad Method". Với hackathon có chấm giải,
> đây là ràng buộc cần biết trước.

## BMad Method — `.claude/skills/bmad-*/` và `_bmad/`

Nguồn: https://github.com/bmad-code-org/BMAD-METHOD — phiên bản **6.11.0**
Cài bằng `npx bmad-method install`, ngày 2026-08-07; nâng lên 6.11.0 ngày 2026-08-13
bằng `npx bmad-method install --action update`.

## Thay đổi so với bản phát hành gốc

**Không sửa file nào của BMad.**

Trước ngày 2026-08-13 repo có chèn 12 dòng vào `methods.csv` của
`bmad-advanced-elicitation` và giữ bản gốc ở `methods.csv.orig` để hoàn nguyên. Cách
làm đó đã bỏ. Phần method BABOK giờ nạp qua `additional_methods` trong file override,
tức BMad tự gộp lúc resolve — file gốc giữ nguyên 71 method, không byte nào bị đụng.

**Chỉ thêm file mới vào thư mục override mà BMad thiết kế sẵn:**

- `_bmad/custom/bmad-prd.toml`
- `_bmad/custom/bmad-product-brief.toml`
- `_bmad/custom/bmad-architecture.toml`
- `_bmad/custom/bmad-advanced-elicitation.toml`
- `_bmad/custom/bmad-review.toml`
- `_bmad/custom/bmad-project-context.toml`
- `_bmad/custom/bmad-deep-recon.toml`

Bảy file này dùng đúng cơ chế `_bmad/custom/<skill>.toml` mà BMad thiết kế cho việc
tuỳ biến, không ghi đè file nào của BMad.

---

## babok-bmad-skill — `_bmad/custom/*.toml`

Nguồn: https://github.com/hanhnt2-hblab/babok-bmad-skill

Bảy file override liệt kê ở trên **sinh ra từ repo đó**, không phải do repo này viết.
Chúng thuộc MIT của repo nguồn, bản quyền tác giả repo nguồn — không thuộc bản quyền
HBLAB nêu trong LICENSE.

Skill tương ứng (`babok-business-analysis`) **không nằm trong repo này**. Nó cài riêng
vào thư mục skill của agent:

```
git clone git@github.com:hanhnt2-hblab/babok-bmad-skill ~/.claude/skills/babok-business-analysis
```

Repo nguồn không chứa nội dung BABOK® Guide. Phần chi tiết từng kỹ thuật sinh tại chỗ
từ bản sách của chính người dùng, và nằm trong thư mục đã gitignore.

---

```
MIT License

Copyright (c) 2025 BMad Code, LLC

This project incorporates contributions from the open source community.
See CONTRIBUTORS.md for contributor attribution.  <!-- file thuộc repo BMad -->

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

TRADEMARK NOTICE:
BMad™, BMad Method™, and BMad Core™ are trademarks of BMad Code, LLC, covering all
casings and variations (including BMAD, bmad, BMadMethod, BMAD-METHOD, etc.). The use of
these trademarks in this software does not grant any rights to use the trademarks
for any other purpose. See TRADEMARK.md for detailed guidelines.  <!-- file thuộc repo BMad -->
```
