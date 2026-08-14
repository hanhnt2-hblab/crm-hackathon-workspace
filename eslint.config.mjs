import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// `AD-1` · `AD-15`
//
// ⚠ CHƯA CÓ LUẬT RANH GIỚI NHẬP. Bảng danh-sách-cho-phép của `AD-1` phải được
// cài ở đây bằng `no-restricted-imports` (lõi ESLint, tuỳ chọn `allowTypeImports`
// — có từ 9.37.0) cộng `no-import-type-side-effects` của typescript-eslint.
// Sáng 15/08 cài vào, và nhớ: luật viết theo DANH SÁCH CHO PHÉP, không phải
// danh sách chặn — danh sách chặn bỏ sót đúng những tệp không ai nghĩ tới, mà
// tệp nguy hiểm nhất (`instrumentation.ts`) nằm ở gốc dự án.

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Mặc định của eslint-config-next
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Cây do công cụ sinh — tracked trong git nên `.gitignore` không giúp.
    // Không có mấy dòng này thì `npm run lint` đỏ vì `_ds_bundle.js` của
    // nguyên mẫu Claude Design, một tệp không ai trong đội sở hữu.
    "_bmad-output/**",
    "_bmad/**",
    "docs/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
