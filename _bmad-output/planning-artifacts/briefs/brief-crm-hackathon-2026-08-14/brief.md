---
title: "Why Now — CRM AI-Native cho Sales HBLAB"
status: ready
created: 2026-08-14
updated: 2026-08-14
---

# Why Now — CRM AI-Native cho Sales HBLAB

> Tên lấy từ câu hỏi mà playbook gọi là đắt giá nhất trong sales: *"vì sao phải liên hệ công ty
> này tuần này chứ không phải quý sau"*. Tên nói giá trị, không nói cơ chế.
>
> Bảng số, ma trận phương án, hình thái bài toán và các ngưỡng có nguồn ở nơi khác nằm ở
> [`addendum.md`](addendum.md).

## Tóm tắt điều hành

Thông tin quyết định "why now" — công ty nào vừa gọi vốn, vừa đổi CTO, vừa mở rộng — đều là nguồn
công khai, miễn phí, ai cũng lấy được. Nhưng **đọc chúng là việc tăng tuyến tính theo số công ty,
còn quỹ giờ của người thì cố định.** Sales HBLAB đang quản lý ~1.200 công ty với 8–15 người, và
mất 1–2 giờ mỗi sáng rà tin bằng tay. Hệ quả là hồ sơ luôn cũ, và hồ sơ cũ nghĩa là mất *Right
Timing* — mà một tín hiệu tốt đến muộn thì bằng không.

**Why Now** là một CRM có AI nằm trong lõi luồng nghiệp vụ: nó đọc nguồn công khai thay người, và
— đây mới là phần khác biệt — **tự ghi những gì nó đủ chắc, chỉ đẩy lại cho người phần thật sự
cần phán đoán**. Đây là ranh giới phân biệt sản phẩm này với phần lớn công cụ "AI cho CRM", vốn
dừng ở chỗ sinh gợi ý rồi để người duyệt từng cái. Cách đó không xoá chi phí chú ý; nó chỉ đổi tên
công việc từ *đọc tin* sang *duyệt hàng đợi*.

Quyền tự ghi đó chỉ tồn tại được nếu đi kèm một ràng buộc cứng: mọi thứ máy ghi phải **truy được
về nguồn, đúng câu chữ**, phân biệt được fact với suy luận ngay bằng mắt, và hoàn tác được dễ hơn
cả lúc máy ghi. Người Sales mang hồ sơ đi họp và chịu trách nhiệm từng dòng trước khách — với họ,
*một dòng dữ liệu sai tệ hơn một dòng để trống*.

## Hiện trạng

Dựng bằng Document Analysis trên Business Playbook của BTC và bản đặc tả CRM thật của HBLAB —
**không phải suy đoán**. Chi tiết ở [`addendum.md`](addendum.md) mục 2.

Sales/BD mỗi sáng rà tin tức và LinkedIn của các công ty đang theo dõi bằng tay, mất **1–2 giờ**,
rồi gõ tay từng dòng vào hồ sơ. Hệ thống hiện chạy trên Airtable: ~1.200 công ty tăng ~50 mỗi
tháng, ~200 cơ hội đang mở, 8–15 người dùng đồng thời, 7 vai, và một cron quét tin **thứ Hai
06:00** chỉ chạm những công ty đang bật theo dõi.

Hai nỗi đau kinh điển: **hồ sơ luôn cũ** — thế giới đổi liên tục, hồ sơ chỉ đổi khi có người gõ;
và **nhập tay ăn hết thời gian** — phần lớn thứ phải gõ là thông tin máy đọc được từ nguồn công
khai.

Đi kèm là một nghịch lý phải nhớ khi thiết kế: chính vì CRM là nguồn dữ liệu chuẩn duy nhất mà
người Sales **cực kỳ khó tính với việc ai được ghi vào đó**.

### Cái giá của hiện trạng — có số, hỏi ngày 14/8

Ba con số dưới đây do **Sales Manager của đội** trả lời, không phải suy ra:

| Cái giá | Số | Đối chiếu |
|---|---|---|
| Giờ mỗi BD mất mỗi ngày cho rà tin và cập nhật hồ sơ | **1–2 giờ** | Khớp đúng playbook `§10` của BTC — nên con số này đứng trên nguồn của chính ban tổ chức |
| Cơ hội mất vì **biết tin muộn**, trên 10 cơ hội thua gần nhất | **3–4** | Sản phẩm nhắm đúng khoảng **một phần ba** lý do thua |
| Hồ sơ cũ tới mức không dùng được cho một cuộc gặp | **quá 1 tháng** | Khớp mốc *khách nguội > 30 ngày* của hệ thống thật |

Con số thứ hai là con số quan trọng nhất trong cả brief: nó biến *"mất Right Timing"* từ một mệnh
đề trong playbook thành **một phần ba số deal thua**. Nó cũng đủ nhỏ để trung thực — sản phẩm này
không chữa hai phần ba còn lại, và brief không giả vờ ngược lại.

## Vấn đề

Hai nỗi đau trên là **triệu chứng**. Nguyên nhân gốc nằm dưới chúng:

> Thông tin quyết định "why now" đều là nguồn công khai ai cũng lấy được. Nhưng đọc chúng là việc
> **tăng tuyến tính theo số công ty**, còn quỹ giờ của người thì **cố định**.

Chi phí không nằm ở chỗ *lấy được tin*. Nó nằm ở **chú ý của con người** — thứ khan hiếm duy nhất
trong bài toán này. Chuỗi hệ quả: không đủ giờ đọc → hồ sơ cũ → mất *Right Timing* → mất cơ hội.
Playbook nói thẳng mắt xích cuối: *"khi tin gọi vốn đã lên mặt báo thì ba đối thủ đã gửi email
trước rồi"*.

**Cái bẫy đi kèm, và là chỗ dễ hỏng nhất của cả sản phẩm:** một hệ thống đọc thay người rồi đẩy
toàn bộ kết quả vào hàng đợi chờ duyệt thì **không xoá chi phí chú ý, nó chỉ đổi tên công việc**.
Quỹ giờ không đổi.

Dấu vết của cái bẫy đã có trong chính bộ quyết định của đội: `D29` phải dựng cảnh báo *duyệt mù*,
còn `D40` bắt mọi đầu ra AI giữ lại phải có người đọc và nói được lý do trong một câu. Cả hai là
ràng buộc về **tải chú ý của con người**, không phải về chất lượng mô hình.

## Trạng thái mong muốn

Đại lượng phải giảm là **số quyết định mà người phải ra mỗi sáng** — không phải số thao tác gõ, và
không phải số phút rà tin.

Từ đó ra nguyên tắc sản phẩm, và nó nâng `D4` từ một ngưỡng chôn trong bảng lên thành điều khoản
bảo vệ được trước giám khảo:

> **Máy hấp thụ quyết định trong vùng nó đủ chắc, và chỉ đẩy lại cho người phần thật sự cần phán
> đoán.** Chuẩn bị sẵn rồi đẩy hết lại cho người là chưa giải quyết vấn đề.

Vùng "đủ chắc" đã được định nghĩa sẵn ở `D4`: `relevance` cao **và** mức chắc chắn thuộc {chắc, có
thể}. Phần còn lại mới vào hàng đợi.

Nguyên tắc này có **một ràng buộc không thương lượng** đi kèm, và ràng buộc đứng trước quyền tự
ghi chứ không phải ngược lại: mọi thứ máy tự ghi đều phải truy được về nguồn đúng câu chữ, phân
biệt fact với suy luận ngay bằng mắt, và hoàn tác được dễ hơn cả lúc máy ghi.

## Các phương án đã cân nhắc

Bốn phương án, gồm **không làm gì**. Ma trận đầy đủ ở [`addendum.md`](addendum.md) mục 3.

Ba phương án bị loại — giữ nguyên hiện trạng · chỉ tự động thu thập rồi gửi bản tin · máy chuẩn bị
sẵn rồi người duyệt tất cả — có **cùng một lỗi**: chúng *dời* chi phí chú ý thay vì *cắt* nó.
Phương án thứ ba nguy hiểm nhất, vì trên bản mô tả tính năng nó trông gần như không khác phương án
được chọn.

Phương án *không làm gì* được ghi lại không phải cho đủ thủ tục: nó là **mốc so duy nhất** để nói
sản phẩm đáng giá bao nhiêu, và nó là phương án duy nhất có chi phí tăng theo thời gian mà không
có trần.

## Phục vụ ai

**Chính — Sales/BD.** Người mỗi sáng phải trả lời "hôm nay tôi chạm ai, vì sao là hôm nay". Thành
công với họ là mở sản phẩm ra và thấy việc đã xếp sẵn, chứ không phải thấy thêm một hàng đợi phải
xử lý.

**Phụ — Quản trị.** Người trả lời câu khác hẳn: *máy đang đúng bao nhiêu phần, và có ai đang duyệt
mù không*. Đây là vai giữ phanh.

Hệ thống thật có 7 vai; bản này rút còn 2 — ràng buộc của cuộc thi, không phải kết luận nghiệp vụ.
Hệ quả cho bước Kiến trúc ở [`addendum.md`](addendum.md) mục 5.

## Giải pháp

Một CRM mà AI nằm **trong lõi luồng nghiệp vụ**, không phải một ô chat gắn bên cạnh. Ba việc, theo
đúng thứ tự:

1. **Đọc thay.** Vòng quét các công ty đang theo dõi, rút phát hiện từ nguồn công khai, mỗi phát
   hiện gắn câu trích nguyên văn, địa chỉ nguồn và mức chắc chắn nhìn thấy được.
2. **Quyết thay, trong vùng được phép.** Phát hiện đủ chắc thì ghi thẳng vào hồ sơ và đặt Việc
   tiếp theo. Phần còn lại vào hàng đợi chờ duyệt, **có thứ tự ưu tiên**, không phải một đống
   phẳng.
3. **Chứng minh và trả lại quyền.** Mọi thứ máy ghi đều mở ra được đúng đoạn nguồn, hoàn tác được
   trong cửa sổ định trước, và có một màn hình đo xem máy đang đúng bao nhiêu phần.

Việc thứ hai là phần khác biệt. Việc thứ ba là điều kiện để việc thứ hai được người dùng cho phép
tồn tại.

## Điều làm nó khác

**Không có hào công nghệ, và không nên bịa ra một cái.** Đọc nguồn công khai rồi rút thông tin là
thứ nhiều sản phẩm làm được.

Khác biệt nằm ở một lựa chọn thiết kế: **truy nguồn là ràng buộc cứng, không phải tính năng.** Câu
trích phải khớp nguyên văn một đoạn trong bản lưu; không khớp thì phát hiện đó **bị loại**, chứ
không được hiển thị kèm cảnh báo.

Điều đó đắt hơn vẻ ngoài của nó: nó khiến hệ thống **tự nguyện vứt bỏ một phần sản lượng của chính
mình**. Đó là cái giá để đúng với nguyên tắc *một dòng sai tệ hơn một dòng trống*.

## Tiêu chí thành công

**Chỉ tiêu chính — tải chú ý:**

| Chỉ tiêu | Ngưỡng |
|---|---|
| Tỉ lệ phát hiện được xử lý **không cần người quyết** | ≥ 40% *(tạm — chỉ chốt được sau khi thấy dữ liệu BTC phát)* |

Đây là dòng **mới**, và là dòng duy nhất đo đúng thứ mục *Vấn đề* nói tới.

**Chỉ tiêu chất lượng** — điều kiện để chỉ tiêu chính có nghĩa; không có nhóm này thì tự ghi nhiều
chỉ là liều hơn. Năm dòng, lấy nguyên từ `D29` và `D30`, chi tiết ở [`addendum.md`](addendum.md)
mục 4.

**Mốc so đã có** *(nhận 14/8)*: 1–2 giờ mỗi BD mỗi ngày, và 3–4 trên 10 cơ hội thua là vì biết tin
muộn. Bảng trên đo sản phẩm; hai con số này nói sản phẩm đáng giá bao nhiêu.

## Phạm vi

**Trong:** sáu nhóm tính năng của `§4` · hai vai Sales và Quản trị · sáu loại tín hiệu · bốn ranh
giới `§5` chặn ở tầng nghiệp vụ · lệnh nạp dữ liệu và bộ nghiệm thu `T-1`…`T-10`.

**Ngoài:** lớp mô tả ngữ nghĩa cho chính CRM (`F26`) · buying committee nhiều đầu mối (`F28`) ·
giao diện vượt khỏi dạng biểu mẫu (`F30`) · hoạt động có hướng và trọng số (`F31`) · năm vai còn
lại của hệ thống thật. Bốn mục đầu đã được bản phản biện đánh dấu *việc tuỳ chọn*; `F30` là rủi ro
đã biết cho vòng 3 và được chấp nhận có ý thức.

**Ràng buộc của cuộc thi, đặt ở đây vì chúng định hình phạm vi:** 4,5 tiếng ngày 15/8 · không
cloud, không staging, chạy local nhưng phải đủ như production · một tính năng BTC phát thêm **chưa
biết nội dung**, và `D41` đã giữ trống một nửa quỹ giờ cho nó.

## Tầm nhìn

Bản dự thi là lát cắt 12–15 công ty; hệ thống thật đã ở 1.200 công ty, 7 vai và 11 loại tín hiệu,
nên đường lớn dần đã có sẵn hình dạng.

Chỗ đi xa hơn nằm ở chỗ chính playbook thừa nhận mình chưa theo kịp: **sang thời AIX, tín hiệu cũ
có thể đã đảo nghĩa.** "Tuyển 12 engineer" từng nghĩa là sắp cần thuê ngoài; giờ cũng có thể nghĩa
là họ tự xây năng lực và sắp *giảm* thuê ngoài. Một hệ thống đọc tín hiệu mà không đọc lại được ý
nghĩa của chính tín hiệu thì sẽ **đúng dần thành sai**.

Vì vậy hướng phát triển không phải "đọc nhiều nguồn hơn", mà là giữ cho bảng ánh xạ *tín hiệu → ý
nghĩa* **sửa được bởi người làm nghiệp vụ, không phải bởi người sửa mã**. `D38` đã đặt viên gạch
đầu.
