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

Nguồn: https://github.com/bmad-code-org/BMAD-METHOD — phiên bản **6.10.0**
Cài bằng `npx bmad-method install`, ngày 2026-08-07.

## Thay đổi so với bản phát hành gốc

**Sửa nội dung file của BMad — đúng một file:**

- `.claude/skills/bmad-advanced-elicitation/methods.csv` — chèn thêm 12 dòng category `babok`
  (num 72–83). Bản gốc 71 dòng giữ nguyên ở `methods.csv.orig`, được version-control để đối
  chiếu. Hoàn nguyên bằng `scripts/apply-methods.py --restore`.

**Thêm file mới vào cây thư mục của BMad — không sửa file có sẵn:**

- `_bmad/custom/bmad-product-brief.toml`
- `_bmad/custom/bmad-prd.toml`
- `_bmad/custom/bmad-architecture.toml`
- `_bmad/custom/bmad-spec.toml`

Bốn file này dùng đúng cơ chế override mà BMad thiết kế sẵn (`_bmad/custom/<skill>.toml`),
không ghi đè file nào của BMad.

**Không có thay đổi nào khác.**

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
