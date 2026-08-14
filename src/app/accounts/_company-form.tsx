"use client";

// `S6` (*Rỗng: "Chưa có account nào" kèm nút tạo*) · `E1-S1` · `FR-1` — biểu
// mẫu tạo Công ty.
//
// `AD-UI-5` — lá `'use client'`: nhận props đã tuần tự hoá, **không** gọi
// `loadCapability`, ghi qua server action.
//
// ⚠ `market` bắt buộc, `industry`/`accountType` KHÔNG. Lõi khai hai ô sau là
// tuỳ chọn có chủ đích: cả hai nằm trong `TargetField`, tức Gợi ý sinh ra chính
// để **điền chúng khi trống**. Bắt buộc ở đây thì hai ô đích không bao giờ
// trống và một nhánh Gợi ý chết theo (chú thích ở `core/company/index.ts`).

import { useActionState } from "react";
import { Field, Input, Select } from "@fluentui/react-components";
import { IDLE } from "../_contract";
import { ActionMessage, SubmitButton } from "../_action-state";
import { ACCOUNT_TYPE_LABEL, MARKET_LABEL } from "../_vocab";
import { createCompanyAction } from "./actions";

export function CompanyForm() {
  // React 19: `useActionState` ở package `react`, trả tuple BA phần tử
  // (`AD-UI-6`). `useFormState` của React 18 đã đổi tên và deprecate.
  const [state, formAction] = useActionState(createCompanyAction, IDLE);

  return (
    <form action={formAction} className="form">
      <div className="form-grid">
        <Field label="Tên công ty" required>
          <Input name="name" required placeholder="Sakura Logistics" />
        </Field>
        <Field label="Thị trường" required>
          <Select name="market" defaultValue="JP">
            {Object.entries(MARKET_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Ngành" hint="Để trống được — gợi ý sinh ra để điền ô này">
          <Input name="industry" placeholder="Logistics" />
        </Field>
        <Field label="Loại tài khoản" hint="Để trống được">
          <Select name="accountType" defaultValue="">
            <option value="">— chưa xác định —</option>
            {Object.entries(ACCOUNT_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Quốc gia">
          <Input name="country" placeholder="Nhật Bản" />
        </Field>
        <Field label="Trang web">
          <Input name="website" placeholder="https://…" />
        </Field>
      </div>

      <div className="form-actions">
        <SubmitButton>Tạo công ty</SubmitButton>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}
