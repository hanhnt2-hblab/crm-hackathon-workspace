"use client";

// `S3` — ba biểu mẫu của hồ sơ Công ty: Người liên hệ, Cơ hội, Hoạt động.
//
// Gom ba lá vào MỘT tệp vì cả ba cùng một hình dạng (`useActionState` +
// `SubmitButton` + `ActionMessage`) và cùng một vòng đời: chúng luôn xuất hiện
// cùng nhau trên `S3`. Tách ba tệp ở đây chỉ thêm ba lần đọc mà không tách
// được thứ gì có thể đổi độc lập.
//
// `AD-UI-5` — lá `'use client'`: nhận `accountId` đã tuần tự hoá, ghi qua
// server action, **không** gọi `loadCapability`.

import { useActionState } from "react";
import { Checkbox, Field, Input, Select } from "@fluentui/react-components";
import { IDLE } from "../../_contract";
import { ActionMessage, SubmitButton } from "../../_action-state";
import { ACTIVITY_TYPE_LABEL } from "../../_vocab";
import {
  createContactAction,
  createOpportunityAction,
  logActivityAction,
} from "./actions";

export function ContactForm({ accountId }: { accountId: string }) {
  const [state, formAction] = useActionState(createContactAction, IDLE);
  return (
    <form action={formAction} className="form">
      <input type="hidden" name="accountId" value={accountId} />
      <div className="form-grid">
        <Field label="Họ tên" required>
          <Input name="name" required placeholder="Nguyễn Thị Linh" />
        </Field>
        <Field label="Chức danh">
          <Input name="title" placeholder="Trưởng phòng mua" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" placeholder="linh@sakura.co.jp" />
        </Field>
        <Field label="Đầu mối chính">
          {/* `BR-D4` — tối đa MỘT trên mỗi Công ty. Tick khi đã có người khác
              làm Đầu mối chính sẽ bị cơ sở dữ liệu bác, và câu bác đó đi ngược
              lên qua `ActionState`. */}
          <Checkbox name="isPrimary" label="Là đầu mối chính của công ty này" />
        </Field>
      </div>
      <div className="form-actions">
        <SubmitButton>Thêm người liên hệ</SubmitButton>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

export function OpportunityForm({ accountId }: { accountId: string }) {
  const [state, formAction] = useActionState(createOpportunityAction, IDLE);
  return (
    <form action={formAction} className="form">
      <input type="hidden" name="accountId" value={accountId} />
      <div className="form-grid">
        <Field label="Tên cơ hội" required>
          <Input name="name" required placeholder="Dedicated team 8 người" />
        </Field>
        <Field label="Giá trị" hint="Để trống được">
          {/* `inputMode="decimal"` chứ không `type="number"`: ô số của trình
              duyệt tự làm tròn và tự bỏ số 0 cuối, đúng hai thứ không được xảy
              ra với tiền. Giá trị đi xuống dưới dạng CHUỖI. */}
          <Input name="amount" inputMode="decimal" placeholder="120000000" />
        </Field>
        <Field label="Đơn vị tiền" hint="Mặc định JPY khi có giá trị">
          <Select name="currency" defaultValue="JPY">
            <option value="JPY">JPY</option>
            <option value="USD">USD</option>
            <option value="VND">VND</option>
          </Select>
        </Field>
        <Field label="Tháng dự kiến chốt" hint="Dạng 2026-09">
          <Input name="expectedCloseMonth" placeholder="2026-09" />
        </Field>
      </div>
      <div className="form-actions">
        <SubmitButton>Tạo cơ hội</SubmitButton>
        <span className="field-note">
          Cơ hội mới luôn bắt đầu ở giai đoạn <strong>Tiếp cận</strong>.
        </span>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

export function ActivityForm({ accountId }: { accountId: string }) {
  const [state, formAction] = useActionState(logActivityAction, IDLE);
  return (
    <form action={formAction} className="form">
      <input type="hidden" name="accountId" value={accountId} />
      <div className="form-grid">
        <Field label="Loại hoạt động" required>
          <Select name="type" defaultValue="goi">
            {Object.entries(ACTIVITY_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Thời điểm" hint="Để trống thì lấy lúc này">
          {/* Ngày SỰ KIỆN, có thể lùi so với ngày ghi — Sales ghi lại cuộc gọi
              hôm qua là chuyện thường (`C5-6`). */}
          <Input name="occurredAt" type="datetime-local" />
        </Field>
      </div>
      <Field label="Nội dung" required>
        <Input name="description" required placeholder="Gọi cho chị Linh, chốt lịch demo" />
      </Field>
      <div className="form-actions">
        <SubmitButton>Ghi hoạt động</SubmitButton>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}
