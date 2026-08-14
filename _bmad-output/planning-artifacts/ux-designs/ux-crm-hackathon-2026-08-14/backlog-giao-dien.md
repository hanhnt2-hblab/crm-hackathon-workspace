---
title: "Backlog giao diện — bảy màn hình cố ý để dạng biểu mẫu"
status: ready
created: 2026-08-14
updated: 2026-08-14
---

# Backlog giao diện

`F30` cảnh báo: *"Giao diện toàn biểu mẫu sẽ thua Excel ở vòng 3"*. Đội chọn dồn công vào **bốn
màn hình**, còn lại giữ dạng biểu mẫu.

**Đây là quyết định có ý thức, không phải bỏ quên.** Tệp này tồn tại để bảy màn hình dưới đây
không trôi mất — mỗi dòng ghi **cái giá** của việc để nó ở dạng biểu mẫu, và **dấu hiệu** cho biết
khi nào phải nâng cấp.

## Bảy màn hình

| # | Màn hình | Cái giá khi để dạng biểu mẫu | Dấu hiệu phải nâng cấp |
|---|---|---|---|
| `S4` | **Pipeline board** — kéo thả bảy Stage | Đây là màn hình Sales nhìn nhiều thứ hai sau Today. Bảng kéo thả xấu vẫn dùng được, nhưng nó là thứ giám khảo chụp màn hình | Giám khảo vòng 3 hỏi *"pipeline nhìn ở đâu"* trước khi hỏi bất cứ gì khác |
| `S5` | **Opportunity detail** | Hai ô dấu hiệu Đủ điều kiện và ô lý do thua nằm ở đây. Biểu mẫu dài làm người bỏ qua chúng, mà `BR-B2` và `BR-B3` vốn đã cho phép bỏ qua | Tỉ lệ Opportunity mang cờ cảnh báo không giảm sau khi dùng |
| `S6` | **Account list** — tìm và lọc | 15 Account thì bảng phẳng đủ dùng. Hệ thống thật có **1.200** | Vượt khoảng 100 Account, hoặc khi cần lọc nhiều chiều cùng lúc |
| `S7` | **Watching list** | Chỉ là Account list đã lọc. Cái giá thật là **không thấy vòng quét đang làm gì với từng Account** | Người dùng phải mở Scan log để biết một Account đã quét chưa |
| `S9` | **Scan log** | Nhật ký dạng bảng là đúng hình thái. Cái giá là dòng tổng hợp mỗi 10 vòng chìm giữa các dòng thường | Số vòng vượt vài trăm trong một buổi demo |
| `S10` | **Snapshot viewer** | Đoạn được đánh dấu phải nhìn ra ngay — `T-3` kiểm đúng điều này. Biểu mẫu ở đây là **rủi ro thật**, không phải chuyện thẩm mỹ | ⚠ Nếu người thử phải dò mắt tìm đoạn đánh dấu thì đây **không còn là backlog**, nó là lỗi |
| `S11` | **Login** | Không có cái giá nào. Hai tài khoản, một lần dùng | Không bao giờ |

## Đọc bảng này thế nào

**`S10` là dòng khác hẳn sáu dòng kia.** Sáu dòng đầu là *đẹp hơn thì tốt hơn*. `S10` gắn thẳng
với một điểm nghiệm thu: `T-3` đòi *"bấm vào một phát hiện thì mở đúng đoạn văn gốc trong bản lưu,
có đánh dấu vị trí"*. Đánh dấu mà không nhìn ra thì `T-3` đỏ, dù mã chạy đúng.

Nói cách khác: sáu màn có thể ở lại backlog qua ngày thi. `S10` thì không.

## Thứ tự nâng cấp nếu có thêm giờ

`S10` → `S4` → `S5` → `S6` → `S7` → `S9` → `S11`.

Lý do thứ tự: rủi ro nghiệm thu trước, rồi tần suất người dùng nhìn, rồi mọi thứ còn lại.
