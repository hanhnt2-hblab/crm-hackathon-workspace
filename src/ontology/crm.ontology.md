# Ontology — CRM Why Now

> **Tệp này nằm trong `src/`, không nằm trong `docs/`, vì nó là tài sản lúc chạy.**
> Tầng AI đọc nó để biết được phép nói gì; tầng nghiệp vụ đọc nó để biết luật nào cưỡng chế.
> Người đọc nó để hiểu domain. Ba bên đọc **cùng một tệp** — đó là điểm.

Nguồn của tệp này, khai một lần: `docs/Đề bài/2. Thiết kế phần mềm thế hệ AI Native -
phương pháp luận.md`. Ánh xạ mục: Phần 2 → §2, §3 · Phần 3 → §10 · Phần 4 → §4 · Phần 5 → §6 ·
Phần 6 → §13 · Phần 7 → §14. "Checklist" dưới đây luôn là **Phần 8 của tệp trên** (gợi ý cho
developer), **không** phải `3. Checklist chấm điểm AI-Hackathon.md` (barem).

---

## 1. Hai tầng, và ranh giới giữa chúng

Vùng chạy ngầm cho ra *"claim/proposal, **chưa chạm vào dữ
liệu chính thức**"*. Câu đó chia ontology này làm hai tầng, và mọi thứ còn lại là hệ quả:

| Tầng | Gồm | Ai được ghi |
|---|---|---|
| **Hồ sơ chính thức** | Công ty · Người liên hệ · Cơ hội · Hoạt động · Việc tiếp theo · Dòng thời gian | Người. Máy chỉ chạm ở **ba điểm** liệt kê ở §6 |
| **Tầng AI-native** | Bản chụp · Bản lưu · Phát hiện · Gợi ý | Máy tự do, vì không có gì ở đây là dữ liệu chính thức |

Sinh ra một Phát hiện **không đổi bất cứ thứ gì** trong Hồ sơ chính thức. Đây là ranh giới
`§4/nhóm 2` của đề bài, phát biểu bằng ngôn ngữ ontology: *"Cho phát hiện chạy thẳng lên dòng
thời gian là làm nhóm 2 thành nhóm 5."*

---

## 2. Đối tượng — định nghĩa

> Mục này định nghĩa **nghĩa** của từng khái niệm, cố ý độc lập với mọi thiết kế dữ liệu.
> Thuộc tính ở §2b, lược đồ vật lý ở `AD-CR-11` tầng ⑤ — ba thứ khác nhau, ba chủ khác nhau.

### Hồ sơ chính thức

| Đối tượng | Tên trong mã | Định nghĩa |
|---|---|---|
| **Công ty** | `Account` | Một tổ chức mà đội có thể bán cho. Tồn tại độc lập với việc có đang bán hay không |
| **Người liên hệ** | `Contact` | Một cá nhân **thuộc đúng một Công ty** mà đội có thể nói chuyện được |
| **Cơ hội** | `Opportunity` | Một lần bán đang theo đuổi ở một Công ty, đi qua bảy giai đoạn. Một Công ty có nhiều Cơ hội, kể cả cùng lúc |
| **Việc tiếp theo** | `NextAction` | Việc kế tiếp cần làm để Cơ hội tiến lên. **Tối đa một** trên mỗi Cơ hội — có hai là chưa ai quyết |
| **Hoạt động** | `Activity` | Ghi chép một việc **đã xảy ra** với người thật: gặp, gọi, gửi thư |
| **Dòng thời gian** | `Timeline` | Chuỗi mọi thứ đáng biết về một Công ty, xếp theo thời gian. Vật chứa, không mang nghĩa riêng |
| **Mục dòng thời gian** | `TimelineEntry` | Một mẩu trên Dòng thời gian, **do người hoặc máy thêm** — và ai thêm quyết định ai được sửa |

### Tầng AI-native

| Đối tượng | Tên trong mã | Định nghĩa |
|---|---|---|
| **Bản chụp** | `Snapshot` | Ảnh của một trang web tại một thời điểm. Trong kỳ thi đây là **nguồn web duy nhất** |
| **Bản lưu** | `Article` | Một bài viết đã đọc được từ một Bản chụp, giữ lại nguyên trạng **để neo câu trích** |
| **Phát hiện** | `Signal` | Một nhận định về một Công ty, **rút từ đúng một Bản lưu** và neo bằng một câu trích. Không có câu trích thì Phát hiện không tồn tại |
| **Gợi ý** | `Suggestion` | Một đề nghị sửa **đúng một ô** hồ sơ Công ty, sinh từ đúng một Phát hiện, **chờ người quyết** |

### 2b. Thuộc tính — tham chiếu, không phải nguồn sự thật

> **Lược đồ vật lý do `AD-CR-11` tầng ⑤ sở hữu.** Bảng này để đọc hiểu;
> khi nó và `prisma/schema.prisma` nói khác nhau thì **lược đồ thắng về hình dạng lưu trữ**
> (`AD-13`). Đặt ở đây chứ không ở §2 để **khi** nó trôi thì cũng không kéo theo từ vựng.

| Đối tượng | Thuộc tính | Ghi chú ngữ nghĩa |
|---|---|---|
| Công ty | tên · ngành · loại công ty · **thị trường** · **quốc gia** · địa chỉ trang web · mảng chuyên biệt · khoảng doanh thu · bậc giá trị thương vụ · năm thành lập · nhãn Đang theo dõi · vì sao theo dõi · người sở hữu | *Người sở hữu* dùng để **định tuyến việc**, không phải phân quyền — ai cũng thấy mọi Công ty. **`thị trường` ≠ `quốc gia`**, xem §15. Tám ô đích của cột **`target_field`** liệt ở `AD-CR-11` (spine tầng ⑤) — **`thị trường` không nằm trong đó** |
| Người liên hệ | tên · chức danh · email | |
| Cơ hội | tên · giá trị dự kiến · tháng dự kiến chốt · giai đoạn · giai đoạn mở gần nhất · lý do thua · dấu hiệu nhu cầu · dấu hiệu ngân sách | *Giai đoạn mở gần nhất* chỉ có nghĩa khi giai đoạn là `tam_dung` hoặc đã đóng |
| Việc tiếp theo | nội dung · ngày hạn · **ai đặt** · hạn hoàn tác | *Ai đặt* là thuộc tính **nguồn gốc**, không phải siêu dữ liệu — nó quyết định máy có được ghi đè không |
| Hoạt động | ngày · loại · mô tả | |
| Mục dòng thời gian | nội dung · thời điểm · **ai thêm** | |
| Bản chụp | định danh · phiên bản trước/sau | |
| Bản lưu | bản thô · bản chuẩn hoá · URL công bố · định danh bản chụp · thời điểm đọc · **readable** | Lưu **hai dạng**: thô để đối chiếu, chuẩn hoá để neo câu trích. `readable = false` là trạng thái **hợp lệ** — hệ thống **không đoán** |
| Phát hiện | câu nhận định · loại tin · phân loại phụ · **câu trích** · **vị trí trong bản lưu** · mức chắc chắn · mức liên quan | Câu trích giữ **nguyên ngôn ngữ gốc**; câu nhận định tiếng Việt |
| Gợi ý | giá trị hiện tại · giá trị đề nghị · dòng hệ quả · lý do bỏ · thời gian quyết | *Giá trị hiện tại* đọc **sống lúc mở**, không phải ảnh chụp lúc sinh |

---

## 3. Quan hệ có tên

> *"Đặt tên quan hệ, không chỉ tạo khóa ngoại. Nếu không gọi tên được quan hệ, bạn chưa hiểu
> domain."* — Checklist mục 2

Mỗi dòng đọc được thành một câu tiếng Việt hoàn chỉnh.

| Chủ ngữ | Quan hệ | Tân ngữ | Số lượng | Luật đi kèm |
|---|---|---|---|---|
| Công ty | **có** | Người liên hệ | 1–n | |
| Người liên hệ | **là đầu mối chính của** | Công ty | 0–1 | Tối đa **một** trên mỗi Công ty (`BR-D4`) |
| Công ty | **có** | Cơ hội | 0–n | |
| Cơ hội | **đang ở** | Giai đoạn | đúng 1 | Chỉ 7 giá trị, thứ tự cố định, **không đổi tên được** (`BR-D11`) |
| Cơ hội | **từng mở ở** | Giai đoạn | 0–1 | Chỉ có nghĩa khi `tam_dung` hoặc đã đóng. Đường quay lại **chỉ một đích** |
| Cơ hội | **có** | Việc tiếp theo | 0–1 | Cơ hội đang mở mà thiếu thì mang **cờ**, vẫn lưu được (`BR-B1`) |
| Việc tiếp theo | **được đặt bởi** | Người \| Hệ thống | đúng 1 | Máy **không ghi đè** ô người đặt kể cả quá hạn, **trừ khi cờ ghi-đè-quá-hạn bật** (`D12`, mặc định tắt). Ô do **chính máy** đặt trước đó thì máy ghi đè được, nhưng **chỉ để rút ngắn hạn** (§9) |
| Hoạt động | **thuộc về** | Công ty | đúng 1 | |
| Hoạt động | **diễn ra với** | Người liên hệ | 0–1 | |
| Hoạt động | **liên quan tới** | Cơ hội | 0–1 | Tuỳ chọn — một cuộc gặp có thể không gắn Cơ hội nào |
| Công ty | **có** | Dòng thời gian | **đúng 1** | |
| Dòng thời gian | **gồm** | Mục dòng thời gian | 0–n | |
| Mục dòng thời gian | **được thêm bởi** | Người \| Hệ thống | đúng 1 | Máy chỉ **thêm**, không bao giờ **sửa** mục người tạo (`D46`) |
| Bản chụp | **là ảnh của** | Công ty | đúng 1 | Tại một thời điểm |
| Bản lưu | **được đọc từ** | Bản chụp | đúng 1 | Chỉ tạo mới khi **dấu vân nội dung khác** mọi bản trước (`FR-50`) |
| Bản lưu | **nói về** | Công ty | đúng 1 | |
| Phát hiện | **được rút từ** | Bản lưu | đúng 1 | |
| Phát hiện | **trích dẫn** | một đoạn trong Bản lưu | **đúng 1** | ⟵ **đây là provenance.** Không có nó thì Phát hiện **không tồn tại** (`BR-D1`) |
| Phát hiện | **nói về** | Công ty | đúng 1 | **Không** gắn thẳng vào Cơ hội, Người liên hệ, hay Hoạt động |
| Gợi ý | **được kích hoạt bởi** | Phát hiện | **đúng 1** | Khoá ngoại thật (`AD-22`). Một Phát hiện sinh được nhiều Gợi ý; một Gợi ý neo về **đúng một** Phát hiện |
| Gợi ý | **đề nghị sửa** | một ô hồ sơ Công ty | đúng 1 | Tối đa **một** gợi ý chờ trên mỗi ô |
| Người | **duyệt \| sửa-rồi-duyệt \| bỏ** | Gợi ý | | Ba lối ra khác nhau, đếm **tách bạch** (`T-5`) |

**Quan hệ không tồn tại — cố ý.** Phát hiện *không* "cập nhật" Công ty. Gợi ý *không* "áp
dụng" cho tới khi người bấm. Máy *không* "sở hữu" Cơ hội. Ba khoảng trống này là thiết kế,
không phải thiếu sót.

---

## 4. Phân loại bốn nguyên thủy

> *"Phân loại mọi dữ liệu AI tạo ra vào đúng đối tượng: đây là observation, claim, hay
> proposal?"* — Checklist mục 3

| Nguyên thủy | Trong domain này | Vì sao |
|---|---|---|
| **Observation** | Bản chụp, Bản lưu | Dữ liệu thô quan sát được, gắn thời điểm. Ghi chép 1–1, chưa biến đổi |
| **Claim** | Phát hiện | Mệnh đề **suy ra** từ observation, mang **mức chắc chắn** ba bậc |
| **Proposal** | Gợi ý, và **Việc tiếp theo do máy đặt** | Hành động máy đề nghị. Điểm chạm governance |
| **Provenance** | câu trích + vị trí trong Bản lưu; và dòng ghi vết | Sợi dây từ mỗi claim về đúng observation gốc |

**Một chỗ tinh tế đáng ghi.** Việc tiếp theo do máy đặt là **proposal đã được áp dụng
trước, hoàn tác sau** — khác Gợi ý là proposal **duyệt trước, áp dụng sau**. Đề bài cố ý
chọn hai chế độ khác nhau cho nhóm 3 và nhóm 4, đổi lại nhóm 4 phải có Hoàn tác một cú bấm
trong 7 ngày. Đây là biến thể của mô hình proposal, không phải vi phạm nó.

**Bản tóm tắt cũng là claim.** Nên câu nhận định của Phát hiện —
dù chỉ diễn đạt lại câu trích — vẫn là claim và vẫn phải neo nguồn.

---

## 5. Luật cứng: không có provenance thì không tồn tại

Phương pháp luận viết *"không có provenance thì không hiển thị"*. Dự án này **làm chặt hơn**:
không hiển thị là chưa đủ, vì thứ không hiển thị vẫn nằm trong cơ sở dữ liệu và vẫn có thể bị
đọc bởi đường khác.

- Phát hiện thiếu câu trích **không lưu được** — từ chối ở tầng nghiệp vụ, kể cả khi ghi thẳng
  không qua giao diện (`BR-D1`, `T-2`).
- Câu trích **không khớp nguyên văn** Bản lưu thì Phát hiện bị **loại bỏ** và ghi nhật ký
  (`BR-D2`).
- Vị trí câu trích tính trên **bản chuẩn hoá** và **lưu sẵn**, không tính lại lúc hiển thị.

---

## 6. Trần tự chủ, theo vùng

> Quyền gắn vào **loại đối tượng**, không vào một mức cấu hình. Không có núm vặn tự chủ.

| Vùng | Máy được làm gì | Đối tượng |
|---|---|---|
| **Tự do** | đọc nguồn, tạo Bản lưu, ghi Nhật ký vòng quét | Observation |
| **Chạy ngầm** | tạo Phát hiện, xếp Gợi ý vào hàng đợi | Claim, Proposal |
| **Ba chạm ghi được phép** | ① thêm Mục dòng thời gian (chỉ Công ty Đang theo dõi, gắn nhãn) ② điền Việc tiếp theo vào **ô đang trống**, hoặc **rút ngắn hạn** trên ô do chính máy đặt; ô người đặt chỉ chạm được khi cờ ghi-đè-quá-hạn bật ③ tự tắt AI khi chạm trần ngân sách | Hồ sơ chính thức — **hết**, không có chạm thứ tư |

### Năm ranh giới không bao giờ vượt

| # | Máy không bao giờ | Mã |
|---|---|---|
| 1 | đổi Giai đoạn của Cơ hội | `NFR-14` |
| 2 | đánh Thắng/Thua, hay sửa giá trị tiền | `NFR-15` |
| 3 | tự liên hệ khách hàng | `NFR-16` |
| 4 | xoá dữ liệu người tạo | `NFR-17` |
| 5 | sửa Mục dòng thời gian do người tạo | `NFR-19`, `D46` |

Chặn ở **tầng nghiệp vụ**, không phân biệt lối vào. *Một lời dặn dò suông với phần AI không
tính là đã chặn.*

**Ranh giới thứ ba nói về chạm tới người thật, không phải cấm gọi mạng.** Danh sách cho phép
gọi ra ngoài **phải mở** cho lệnh gọi mô hình ngôn ngữ; chặn quá tay ở đây là tự làm hỏng
tầng Claim.

**Máy chỉ được tắt AI, không bao giờ tự bật.** Đây là chạm ghi duy nhất mà máy có với công
tắc, và nó một chiều.

---

## 7. Ra biên — máy được thấy gì

Hẹp hơn đề bài cho phép, do đội tự đặt. Gửi ra ngoài **đúng ba thứ**:

1. nội dung Bản lưu đã chuẩn hoá
2. Loại công ty
3. danh sách enum để chọn

**Không gửi:** dữ liệu Cơ hội · giá trị tiền · thông tin Người liên hệ.

Nghĩa là tầng Claim suy luận **chỉ trên observation**, không trên hồ sơ chính thức. Đó là lý
do ranh giới ở §1 giữ được: máy không thể rò rỉ thứ nó không nhìn thấy.

---

## 8. Enum — máy chọn trong danh sách, không nhập tự do

> `D22`. Đây là phần tầng AI đọc lúc chạy để dựng JSON Schema.

```yaml
stage:      [tiep_can, du_dieu_kien, soan_de_xuat, thuong_luong, thang, thua, tam_dung]
account_type:   [traditional, it_solution, it_product, tech_startup, ito]
signal_type:       [funding, leadership, expansion, hiring, new_business, other]
confidence:  [chac, co_the, doan]
relevance:  [high, medium, low]
drop_reason:       [thong_tin_sai, khong_lien_quan, da_cu, hieu_sai_ngu_canh, khac]
```

`subcategory` (13 giá trị) **chỉ áp dụng khi** `signal_type = other`.

Bảy giá trị Giai đoạn **không cấu hình được**, kể cả từ màn hình Quản trị — khác mọi tham số
khác. Một phép kiểm đối chiếu danh sách trên với enum trong `prisma/schema.prisma`; lệch là
đỏ.

---

## 9. Bất biến ngữ nghĩa

Những luật không đọc ra được từ lược đồ, và không đối tượng đơn lẻ nào giữ:

1. **Đáng chú ý** = `relevance = high` **và** `confidence ∈ {chac, co_the}`. Mức `doan`
   không bao giờ tự đặt Việc tiếp theo.
2. **Hạn máy đặt không bao giờ bị đẩy xa hơn.** Nhiều tin cùng lúc thì lấy hạn **ngắn nhất**.
3. **Ngày làm việc theo thị trường của Công ty khách**, không theo giờ máy chủ.
4. **`tam_dung` miễn trừ luật "Cơ hội mở phải có Việc tiếp theo"** — cờ im lặng, có chủ đích.
5. **Vòng quét không dừng chờ ai duyệt ở bất kỳ bước nào.**
6. **Mọi xoá là xoá mềm.** Phát hiện không xoá được, kể cả bởi người — nó là bằng chứng.

---

## 10. Hai chỉ số, đo hai bên

> Phần 3: *auto-accept rate* đo hệ thống khôn lên; *error-detection rate* đo **người** khôn
> lên. Chỗ ghi nhận phải có sẵn từ ngày đầu.

| Chỉ số | Tử số | Mẫu số |
|---|---|---|
| **auto-accept rate** | Gợi ý duyệt **không sửa** | Gợi ý đã quyết |
| **error-detection rate** | **Phát hiện** bị bác vì sai — qua nút *không hữu ích*, **hoặc** qua lý do `thong_tin_sai` khi bỏ một Gợi ý sinh từ Phát hiện đó | **Phát hiện có phản hồi** theo đúng hai đường đó (`D30`) |

Con số *sửa-rồi-duyệt* **không** cộng vào *duyệt* — hai lối ra khác nhau (`T-5`).

**Và một chỉ số ngược dấu với trực giác:** ngưỡng **duyệt mù** — quyết dưới 3 giây, hoặc trên
5 gợi ý một phút. Duyệt nhanh không phải thành tích; nó là dấu hiệu người đã ngừng kiểm chứng. Đây
chính là cái bẫy AI-centric mà Phần 3 mô tả, đo bằng số.

---

## 11. Chuỗi dẫn xuất tài liệu

> Checklist mục 1: *"chuỗi dẫn xuất giữa các tài liệu — và cách sinh tài liệu sau từ tài
> liệu trước"*

```
docs/Đề bài/                    nguồn yêu cầu gốc, không sửa
  └─ Mục 0, D1–D47              chốt mọi chi tiết đề bài để trống; thắng mọi tài liệu SAU nó, KHÔNG thắng đề bài §1–§7 — xem AD-13
       └─ brief.md              vì sao làm — vấn đề và trạng thái mong muốn
            └─ prd.md           làm gì — 51 FR, 19 NFR, 5 TR, 17 luật nghiệp vụ
                 ├─ DESIGN.md · EXPERIENCE.md      dùng thế nào — 12 bề mặt
                 └─ src/ontology/crm.ontology.md   ⟵ TỆP NÀY. nghĩa là gì
                      └─ ARCHITECTURE-SPINE.md     dựng thế nào — bất biến AD-1…AD-n
                           └─ src/                 mã
```

Ontology đứng **giữa PRD và kiến trúc**: PRD nói hệ thống phải làm gì, ontology nói các thứ đó
**là gì và liên hệ với nhau ra sao**, kiến trúc nói dựng chúng thế nào.

---

## 12. Tệp này được dùng lúc chạy như thế nào

| Ai đọc | Đọc phần nào | Để làm gì |
|---|---|---|
| `src/agent/schema.ts` | §8 enum | Dựng JSON Schema ép mô hình chọn trong danh sách |
| `src/agent/prompt.ts` | §2 đối tượng, §9 bất biến | Dựng lời nhắc rút Phát hiện |
| `src/autonomy/gate.ts` · `src/autonomy/zones.ts` | §6 ranh giới | Đối chiếu — danh sách cấm trong mã phải khớp bảng ở đây |
| `tests/` | §8, §6 | Phép kiểm đối chiếu; lệch là đỏ |
| Người | toàn bộ | Hiểu domain mà không phải đọc mã |

`src/agent/` và `src/core/` **cùng đọc tệp này và không đọc nhau** — đó là cách giữ được luật
"tầng AI không nhập gì từ lõi" mà vẫn dùng chung một bộ enum.

---

## 13. Playbook và quyền commit

> Phần 6: *"Đối xử với playbook như code: có version, có review, có quyền commit rõ ràng."*

**Playbook** — tri thức nghề sale — nằm ở `docs/Đề bài/1. Business Playbook`. Ontology này là
lớp ngữ nghĩa; playbook là lớp *nên làm gì*. Playbook chỉ cho máy biết **nên quan sát cái gì**
và **khi có đủ thông tin thì hành động gì**; ontology nói **những thứ đó là gì**.

| | Ontology (tệp này) | Playbook |
|---|---|---|
| Trả lời | *cái này là gì, liên hệ với cái kia ra sao* | *khi thấy X thì nên làm gì* |
| Đổi khi | domain đổi | học được điều mới về nghề |
| Quyền commit | cả đội, qua pull request | **chỉ Sales Manager** — người duy nhất trong đội có thẩm quyền nghề |

Vòng lặp học tập (Phần 6) — giả định → kiểm chứng → đúc rút → commit — **chưa chạy trong kỳ
thi**: nó cần nhiều tuần dữ liệu thật. Thứ kỳ thi dựng là **chỗ ghi nhận** cho nó:
accept/sửa/reject trên mỗi Gợi ý, kèm lý do. Không có chỗ ghi nhận thì vòng lặp không bao giờ
khởi động được.

---

## 14. Thứ ontology này cố ý không mô tả

- **Hành động.** Buổi họp weekly, chiến dịch, quy trình duyệt — là hành động có mục đích, không
  phải đối tượng. Ontology mô tả đối tượng và quan hệ; hành động làm quan hệ **dày lên** mà
  không đổi bản chất đối tượng.
- **Tháp độ tin cậy nguồn tin** (Phần 7). Trong kỳ thi mọi observation đến từ **cùng một
  nguồn** — bản chụp của BTC — nên tháp suy biến thành một tầng. Sẽ có nghĩa khi có nguồn thật.
- **Giao diện.** Thuộc `EXPERIENCE.md`.
- **Lược đồ vật lý.** Thuộc `prisma/schema.prisma`. Khi hai bên nói khác nhau về **ngữ nghĩa**,
  tệp này thắng; về **hình dạng lưu trữ**, lược đồ thắng.

---

## 15. Glossary — ba lớp từ vựng

> Một khái niệm mang **ba tên** trong dự án này: tên đội nói với nhau, tên
> trong mã, và tên tài liệu nguồn dùng. Không bảng này thì người đọc `docs/CRM clone từ
> Airtable/` sẽ tưởng `deal` là một đối tượng khác `Cơ hội`, và đó đúng loại nhầm im lặng.

| Đội nói | Trong mã | Tài liệu nguồn gọi | Lưu ý |
|---|---|---|---|
| Công ty | `Account` | *account* (Tomahawk), *company* | |
| Cơ hội | `Opportunity` | **`deal`** (Tomahawk), *opportunity* | Cùng một thứ. Tomahawk có **5** giai đoạn, đề bài có **7** — không ánh xạ 1–1 (`BR-D11`) |
| Bản lưu | `Article` | — | **Không phải** "bài báo". Nó là bài viết **đã đọc được**, giữ nguyên trạng để neo câu trích |
| Phát hiện | `Signal` | *signal*, *insight* | Không phải "tín hiệu" theo nghĩa sự kiện — nó là một **nhận định có neo nguồn** |
| Gợi ý | `Suggestion` | *recommendation* | Chờ người quyết. Khác Việc tiếp theo do máy đặt: cái đó **áp trước, hoàn tác sau** (§4) |
| Việc tiếp theo | `NextAction` | *next step*, *task* | **Không phải** `Task` của Tomahawk — cái đó là danh sách việc, cái này tối đa một trên mỗi Cơ hội |
| Quản trị | `role = 'admin'` | *admin* (Mục 0, 7 vai) | Dự án này chỉ có **hai** vai: `sales` và `admin` |

### Hai cặp từ dễ gộp, và cái giá nếu gộp

| | Là gì | Gộp thì hỏng gì |
|---|---|---|
| **Thị trường** ≠ **Quốc gia** | *Thị trường* là nơi đội **bán tới** (JP, Global) và nó quyết **lịch ngày làm việc**; *Quốc gia* là nơi Công ty **đóng trụ sở**, chỉ để lọc và hiển thị | Một Gợi ý được duyệt đổi luôn lịch ngày làm việc, làm **mọi** hạn `BR-D7` tính lệch. **Không phép kiểm nào bắt được** — hỏng im lặng |
| **Bản thô** ≠ **nguyên văn** | *Bản thô* là danh từ chỉ dạng lưu chưa chuẩn hoá của Bản lưu; *nguyên văn* là trạng từ nghĩa **từng ký tự** | `BR-D2` so câu trích với **bản chuẩn hoá** (`AD-8`). Ai cài so với bản thô thì **mọi** Phát hiện rụng, triệu chứng giống hệt "mô hình bịa câu trích" |

### Từ cố ý không dùng

**Pipeline value** và **doanh thu** — `D34` cấm; tên đúng là *"tổng giá trị ước tính (chưa nhân
xác suất)"*. Dùng sai là khai một con số tài chính mà nó không phải.
