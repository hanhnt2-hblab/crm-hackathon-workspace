# Nguyên mẫu Why Now — đầu ra của Claude Design

Nhập về ngày **14/08/2026** từ dự án Claude Design
`b9043321-7d62-410d-a8c5-2031b9cebd53`. Bản đầu tiên lấy qua MCP `claude_design`; sau đó thay bằng
**bản tải trực tiếp** từ Claude Design để có đủ 26 tệp.

Mười hai tệp lấy qua hai đường **khớp nhau từng byte** — đã đối chiếu. Nên bản trong repo là bản
tải trực tiếp, và ta biết chắc đường MCP không làm sai lệch gì.

Đây là **đầu ra của bước design handoff** mô tả ở `../design-handoff.md`. Người sản xuất là Claude
Design, không phải đội. Hai sườn `DESIGN.md` và `EXPERIENCE.md` **thắng nguyên mẫu này khi có mâu
thuẫn** — nguyên mẫu minh hoạ, sườn là hợp đồng.

## Chạy nó thế nào

| Tệp | Chạy được không |
|---|---|
| `WhyNowPrototype.dc.html` | ❌ Mở bằng trình duyệt cho **màn hình trắng**. Nó dựa vào `window.React` và `window.ReactDOM` do host của Claude Design cấp; tệp không tự nạp hai thư viện đó |
| `TodayBoard.dc.html` | ❌ Cùng lý do — nó nạp `./ds-base.js` và `./support.js`, không nạp React |
| `WhyNowPrototype.local.html` | ✅ Mở bằng trình duyệt là chạy — **nhưng cần mạng** |
| Trên chính Claude Design | ✅ Cách xem đúng nhất, đủ mọi tương tác |

`WhyNowPrototype.local.html` là **bản dẫn xuất của đội**, khác bản gốc **đúng bảy dòng**: một khối
chú thích cộng hai thẻ `<script>` nạp React 18 và ReactDOM 18 từ unpkg. Bản gốc `.dc.html` giữ
nguyên xi từng byte để đối chiếu về sau.

> ⚠ **Hai thẻ script đó gọi mạng.** Ba hướng thị giác ở `../.working/` thì tự chứa và chạy offline;
> nguyên mẫu này **không**. Muốn nó chạy offline thì tải hai tệp UMD của React về cạnh nó rồi sửa
> `src` thành đường dẫn tương đối.

## Cây tệp

```
WhyNowPrototype.dc.html      đầu ra gốc, nguyên xi — nguyên mẫu bấm được năm bề mặt
WhyNowPrototype.local.html   bản dẫn xuất của đội, chạy được, cần mạng
TodayBoard.dc.html           template bàn làm việc buổi sáng, dùng lại được cho bề mặt mới
support.js                   dc-runtime của Claude Design (sinh tự động)
ds-base.js                   nạp design system vào template — một dòng để sửa khi đổi vị trí
wn-data.js                   bộ dữ liệu demo — 15 Account, 8 Opportunity đang mở, JPY
.thumbnail                   ảnh xem trước WebP 639×294, KHÔNG có đuôi tệp
screenshots/                 8 ảnh PNG dựng trong lúc thiết kế
_ds/why-now-design-system-…/
  readme.md                  tài liệu design system — đọc trước khi dựng
  _ds_bundle.js              25 component đã biên dịch
  _ds_manifest.json          namespace, component, card, template, token
  _adherence.oxlintrc.json   luật lint giữ mã bám design system
  styles.css                 điểm vào, chỉ chứa @import
  tokens/                    7 tệp token — nguồn của DESIGN.md
```

> ⚠ **`.thumbnail` là WebP không có đuôi tệp.** `.gitattributes` của repo có `* text=auto eol=lf`,
> nên nếu không khai tường minh thì git có thể chuẩn hoá đầu dòng và **làm hỏng ảnh**. Đã thêm luật
> `**/.thumbnail  binary` cùng `*.webp  binary`.

## Bộ dữ liệu bám đúng ca ngoại lệ

`wn-data.js` không phải dữ liệu đẹp. Nó cố tình mang theo những ca mà `EXPERIENCE.md` đòi:

| Ca | Ở đâu trong dữ liệu |
|---|---|
| Nguồn **không đọc được** | `a9` Aozora Tech — *"Trang nguồn chặn truy cập từ 12/08"* |
| Cờ cảnh báo **im lặng** cho `Tạm dừng` | `r8` / `o8` Phú Hòa — thiếu Next step nhưng cờ im, có chủ đích |
| Thiếu Next step, cờ **kêu** | `r7` / `o7` Trường An |
| Thua **chưa có lý do**, đứng ngoài bảng thống kê | `o15` Aozora |
| Cửa sổ Hoàn tác **sắp hết** | `r4` Minh Quang — còn 4 giờ 10 phút, cờ `undoSoon` |
| Máy **không ghi đè** ô người gõ | `r5` Midori — *"ghim một dòng đề xuất, không ghi đè ô bạn gõ"* |
| Suggestion mức **Đoán** tự nhận là nói quá | `s5` Tsubasa — *"con số 25 là suy ra từ cụm 若干名, không có trong nguồn"* |
| **Duyệt mù** | `ADMIN.blind` — ba dòng, kèm số giây từng lượt |
| Vòng quét **cắt do phanh** | `SCAN_LOG` mục cuối — *"9/15 Account đã quét trong vòng này"* |
| Gợi ý bị **thay bởi cái mới hơn** | `ADMIN.dismissReasons` — *"Có gợi ý mới hơn"* đếm 4 |

## Một chỗ cần người trong nghề chốt

`DISMISS_REASONS` có năm giá trị, nhưng **chỉ một** đến từ nguồn (*"Có gợi ý mới hơn"*, sinh từ
`FR-51`). Bốn giá trị còn lại — *Thông tin sai · Không liên quan tới account này · Đã biết rồi ·
Nguồn không tin được* — là Claude Design **suy ra**, và nó tự khai điều đó.

Đề bài `§4/nhóm 3` chốt cứng **năm** lý do bỏ, và `0.1.7` của Mục 0 liệt kê chúng:
`thong_tin_sai` · `khong_lien_quan` · `da_cu` · `hieu_sai_ngu_canh` · `khac`. **Hai danh sách không
khớp nhau.** Bản dựng thật phải theo `0.1.7`, không theo nguyên mẫu.
