- source_spec: none
  summary: Cục 0 nửa hạ tầng — `C0-7` năm lệnh một-bước và toàn bộ phụ thuộc, `C0-8` khung bộ kiểm thử (`tests/setup.ts`, `global-setup.ts`, factory; `TEST_DATABASE_URL` phải trỏ cổng 5443), `C0-9` chữ ký lời gọi mười `T` với thân `it.todo`.
  evidence: Tách khỏi Cục 0 ở bước 4 của bmad-build vì trượt chuẩn đơn-mục-tiêu — nhóm này nghiệm thu bằng `npm test` chạy tới nơi, còn nhóm giữ lại nghiệm thu bằng `tsc --noEmit` sạch; hai cổng khác nhau, review và merge riêng được. `C0-9` đi theo nhóm này chứ không đứng riêng: viết `tests/T*.test.ts` khi chưa có `tests/setup.ts` làm `npm test` đỏ vì cấu hình chứ không vì mã. Chín việc gộp một spec cũng vượt xa trần 1600 token của chuẩn phạm vi (ước ~4000).

- source_spec: `_bmad-output/implementation-artifacts/spec-c0-frozen-contracts.md`
  summary: Mười bốn khoảng trống hình dạng kiểu mà bước 4 tìm ra, không sửa được bằng một dòng — mỗi cái cần một quyết định thiết kế.
  evidence: |
    Đã tự kiểm, đều thật, xếp `defer` vì sửa đúng cách là đổi hình dạng kiểu chứ không phải sửa chữ:
    · `ActionState` không có nhánh *chưa chạy*; `IDLE = {ok:true}` trùng hệt *vừa lưu xong*.
    · `GateDecision.boundary` khai `?:` trong khi `reason:"boundary"` bắt buộc phải kèm mã — nên
      `{allowed:false, reason:"boundary"}` trơ là trạng thái khai được; và `ActionState.code` không
      mang `BoundaryCode` nên `AD-UI-7` không dựng nổi chữ hiển thị.
    · `NFR-14`…`NFR-19` nằm trong CẢ `BusinessRuleCode` lẫn `BOUNDARY_CODES`; `ActionState.code` hợp
      nhất hai họ — đúng thứ đầu `errors.ts` cấm trộn.
    · `DecideInput` khai được ba trạng thái bất khả (`bo` không lý do; `duyet` có `dropReason`;
      `bo` kèm `editedValue`). Cần union phân biệt theo `outcome`.
    · `collectGateContext(actor, seedMode)` không có tay nắm tìm hàng `ScanLog` đang chạy, và với
      thao tác người bấm thì KHÔNG có lượt quét nào — vẫn phải trả bốn số. `budgetUsedRatio` nhận
      `NaN` khi ngân sách bằng 0, và `NaN >= stop` là `false`: phanh không bao giờ chạm.
    · `createRegistry` không nhận `entries` — không điểm nạp, nên `defineCap` không phải đường bắt
      buộc và một object literal đi vòng được. `CapName = string` chưa thu hẹp.
    · `RegistryEntry` không buộc `snapshot`/`writesTables`/`settingKeys` theo `kind`; tách
      `ReadEntry`/`WriteEntry` mới giữ được `AD-CP-9`/`AD-CP-10`.
    · `updateCompany` chỉ với tới 4/8 `TargetField` — duyệt Gợi ý cho `revenue_range` không có đường ghi.
    · `createSuggestion` không chứa được loại *thêm tin mới* (`targetField = null`, nội dung ở `timeline_text`).
    · `amount` không đi kèm `currency`; `BR-D9` đòi một đơn vị tiền và cột `currency` tồn tại.
    · `fillNextActionIfUnchanged` chỉ so `expectedContent`, không so `dueDate` — người sửa mỗi hạn vẫn bị đè.
    · `CHECK signal_subtype_only_other` không lên tới kiểu ở cả `agent/types.ts` lẫn `core/signal`.
    · Luật lint `AD-GT-4` là DANH SÁCH CHẶN sáu mẫu, đúng thứ chú thích ngay trên nó cấm — `node:fs`
      hay bất kỳ gói bare nào vẫn nhập giá trị vào `src/autonomy` không cảnh báo.
    · `lossReasons: readonly string[]` trong khi `D27` nói enum dạng mảng; CSDL là `TEXT[]`, nên
      khai union đóng ở lõi là lớp canh duy nhất có thể có.
