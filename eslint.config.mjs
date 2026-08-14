import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// `AD-1` · `AD-15` · `AD-GT-4` · `AD-AG-3` · `AD-CR-7`
//
// RANH GIỚI NHẬP, cài theo bảng danh-sách-cho-phép của `AD-1`:
//
//   | Nhập cái gì        | Được phép ở                                            |
//   |--------------------|--------------------------------------------------------|
//   | `@prisma/client`   | `src/core` · `prisma` · `tests` (chỉ đọc)              |
//   | `@/core/*`         | `src/capability` · `tests` (chỉ đọc)                   |
//   | `@/capability/*`   | `src/scan` · `src/app` · `src/agent` · `tests` ·       |
//   |                    | `prisma` · `instrumentation.ts`                        |
//   | `@/autonomy/*`     | `src/capability` · `tests`                             |
//
// ⚠ MỖI KHỐI DƯỚI ĐÂY ĐÃ ĐƯỢC ĐO BẰNG MỘT TỆP THĂM DÒ, không phải viết rồi tin.
// Trước khi có chúng, cả ba câu dưới qua sạch CẢ `tsc` LẪN `eslint`:
//   · `src/app`        nhập thẳng `db`, `tx` rồi ghi Postgres — bỏ qua cả bảy
//                      bước của `AD-4`, không một dòng ghi vết
//   · `src/agent`      nhập `@/core` và `@/capability` — phá `AD-AG-3`
//   · `src/capability` gọi `tx()` mở giao dịch — phá `AD-CR-7`, và
//                      `completeAuditRow` rơi ra ngoài giao dịch chính
//
// ⚠ VÌ SAO `allowTypeImports` KHÁC NHAU GIỮA CÁC KHỐI. Cạnh KIỂU vẫn là cạnh:
// nó kéo đồ thị kiểu của bên bị nhập vào bên nhập. Tầng ② và tầng ⑤ đặt `false`
// vì `AD-AG-3` và `AD-GT-12` nói rõ lý do — kéo Zod/Prisma vào là `npm test`
// trên clone sạch đỏ khi `prisma generate` chưa chạy. Các tầng còn lại đặt
// `true` vì chúng vốn đã ở phía có Prisma.
//
// Hai lỗ đã bịt ở khối cuối: `instrumentation.ts` (ngoài mọi thư mục `src/`, và
// `AD-1` gọi đúng nó là tệp nguy hiểm nhất vì nó khởi động vòng quét), và dạng
// nội dòng `import { type X }` — dạng này qua mặt `allowTypeImports` vì tuỳ chọn
// đó xét ở mức CẢ CÂU LỆNH, nên `no-import-type-side-effects` bắt buộc phải bật
// cùng lúc, không phải một thứ trang trí.

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

  // `AD-GT-4` — tầng ③ Cổng tự chủ không nhập GIÁ TRỊ nào ra ngoài chính nó.
  //
  // `allowTypeImports: true` cho `import type { X } from '…'` đi qua, và chặn
  // lời nhập giá trị. Cần eslint ≥ 9.37.0 cho tuỳ chọn này (bản cài: 9.39.5).
  //
  // ⚠ Luật này KHÔNG bịt được dạng nội dòng `import { type X } from '…'` —
  // `allowTypeImports` xét ở mức cả câu lệnh. Đó là lý do `gate.ts` và
  // `zones.ts` ghi rõ phải dùng dạng `import type { … }` tách rời. Bịt hẳn dạng
  // nội dòng cần `no-import-type-side-effects` của typescript-eslint, thuộc
  // phần cài nốt sáng 15/08.
  {
    files: ["src/autonomy/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/*", "../*", "@prisma/client", "zod", "next", "react"],
              allowTypeImports: true,
              message:
                "AD-GT-4: src/autonomy không nhập GIÁ TRỊ ra ngoài chính nó. " +
                "Chỉ `import type { X } from '…'` — và không dùng dạng nội dòng " +
                "`import { type X }`, nó qua mặt luật này.",
            },
          ],
        },
      ],
    },
  },

  // ⑤ Lõi domain — `src/core/**`
  // Được nhập `@prisma/client` (nó là tầng duy nhất được). Không được nhập
  // NGƯỢC LÊN bốn tầng trên. Ngoại lệ hẹp: `audit.ts` nhập KIỂU `GateDenyReason`
  // từ tầng ③ vì nó là bên tiêu thụ từ vựng đó (`AD-GT-12` giao quyền sở hữu
  // cho `gate.ts`) — nên `@/autonomy/*` để `allowTypeImports: true`, còn
  // `@/capability/*` để `false`: lõi không có lý do gì chạm tầng ④, kể cả kiểu.
  {
    files: ["src/core/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/capability/*", "@/app/*", "@/agent/*", "@/scan/*", "@/ingest/*"],
              allowTypeImports: false,
              message:
                "AD-1: src/core là tầng DƯỚI CÙNG — chiều phụ thuộc là ④ → ⑤, " +
                "không ngược lại. `Tx` có sẵn ở @/core/db; đừng lấy `PrismaTx` từ tầng ④.",
            },
            {
              group: ["@/autonomy/*"],
              allowTypeImports: true,
              message:
                "AD-1: src/core chỉ được nhập KIỂU từ tầng ③ (ví dụ `GateDenyReason` " +
                "cho dòng ghi vết). Nhập giá trị là đảo chiều phụ thuộc.",
            },
          ],
        },
      ],
    },
  },

  // ④ Capability — `src/capability/**`
  // Được nhập `@/core/*` và `@/autonomy/*`. KHÔNG được nhập `@prisma/client`
  // thẳng, và KHÔNG được cầm `db`/`tx`/`dbIncludingDeleted`: `AD-CR-7` đặt giao
  // dịch TRONG LÕI. Mở thêm một giao dịch ở đây là hai giao dịch trên hai kết
  // nối, và pha 2 của ghi vết rơi ra ngoài giao dịch chính — `AD-4` bất biến ②
  // vỡ IM LẶNG, không lỗi nào.
  {
    files: ["src/capability/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@prisma/client", "@prisma/adapter-pg", "@/app/*", "@/agent/*", "@/scan/*"],
              allowTypeImports: true,
              message:
                "AD-1: tầng ④ đi xuống qua @/core/*, không chạm Prisma thẳng và " +
                "không nhập ngược lên tầng ① hay ②.",
            },
          ],
          paths: [
            {
              name: "@/core/db",
              importNames: ["db", "dbIncludingDeleted", "tx"],
              allowTypeImports: true,
              message:
                "AD-CR-7: tầng ④ KHÔNG mở giao dịch và không cầm client. " +
                "`import type { Tx }` thì được; `db`/`tx` thì không.",
            },
          ],
        },
      ],
    },
  },

  // ② Agent Runtime — `src/agent/**`
  // `AD-AG-3`: bộ biến đổi THUẦN. Không gọi capability, không chạm lõi, không
  // chạm Prisma — và `allowTypeImports: false`, vì `AD-AG-3` cấm cả cạnh KIỂU.
  // Máy chủ MCP đi vào qua `AgentDeps.crmMcpServer` dưới dạng giá trị mờ, đúng
  // để lời nhập đó không tồn tại.
  {
    files: ["src/agent/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/core/*", "@/capability/*", "@/autonomy/*", "@/app/*", "@/scan/*",
                "@prisma/client", "@prisma/adapter-pg",
              ],
              allowTypeImports: false,
              message:
                "AD-AG-3: src/agent là bộ biến đổi thuần — nhận văn bản, trả dữ liệu " +
                "có cấu trúc. Phụ thuộc đi vào qua AgentDeps, kể cả kiểu.",
            },
          ],
        },
      ],
    },
  },

  // ① Tương tác — `src/app/**`, `src/scan/**`, `src/ingest/**`
  // Được nhập `@/capability/*` và CHỈ nó. Không `@prisma/client`, không `db`,
  // không `tx`. Đây là lỗ nặng nhất trong bốn tầng chưa canh, vì `src/app` là
  // nơi đông người sửa nhất và một câu `import { db }` ở đó là một đường ghi
  // Postgres bỏ qua cả bảy bước của `AD-4`.
  // `allowTypeImports: true` vì `_contract.ts` nhập kiểu `BusinessRuleCode`
  // (tầng ⑤) và `GateDenyReason` (tầng ③) để dựng union `ActionState`.
  {
    files: ["src/app/**/*.{ts,tsx}", "src/scan/**/*.ts", "src/ingest/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@prisma/client", "@prisma/adapter-pg"],
              allowTypeImports: true,
              message:
                "AD-1: chỉ src/core, prisma/ và tests/ được chạm Prisma. " +
                "Tầng ① đi xuống qua loadCapability().",
            },
          ],
          paths: [
            {
              name: "@/core/db",
              importNames: ["db", "dbIncludingDeleted", "tx"],
              allowTypeImports: true,
              message:
                "AD-1 · AD-4: một câu `import { db }` ở tầng ① là đường ghi Postgres " +
                "bỏ qua Cổng và bỏ qua ghi vết. Đi qua loadCapability().",
            },
          ],
        },
      ],
    },
  },

  // `instrumentation.ts` — GỐC dự án, ngoài mọi glob `src/**`.
  //
  // `AD-1` gọi đúng tệp này là chỗ nguy hiểm nhất, và lý do rất cụ thể: nó là
  // nơi khởi động vòng quét, nên nó chạy TRƯỚC mọi thứ và không bề mặt người
  // dùng nào đi qua nó. Một câu `import { db }` ở đây là một đường ghi Postgres
  // mà không ai nhìn thấy.
  //
  // `AD-1` cho nó nhập `src/capability/**` — đúng và chỉ thế.
  {
    files: ["instrumentation.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@prisma/client", "@prisma/adapter-pg",
                "@/core/*", "./src/core/*", "@/autonomy/*", "./src/autonomy/*",
                "@/agent/*", "./src/agent/*",
              ],
              allowTypeImports: true,
              message:
                "AD-1: instrumentation.ts chỉ được nhập src/capability/**. Nó chạy " +
                "trước mọi thứ và không bề mặt nào đi qua nó — một đường ghi ở đây " +
                "là đường không ai nhìn thấy.",
            },
          ],
        },
      ],
    },
  },

  // Bịt dạng nội dòng `import { type X } from '…'` trên TOÀN BỘ mã của đội.
  //
  // Không có luật này thì mọi `allowTypeImports` ở trên bị qua mặt: tuỳ chọn đó
  // xét ở mức CẢ CÂU LỆNH, nên `import { createRegistry, type X }` báo đỏ còn
  // `import { type X }` thì im lặng — tức đúng dạng một người muốn lách sẽ gõ.
  //
  // Luật này ép dạng tách rời `import type { X } from '…'`, và khi đó
  // `allowTypeImports` mới phân biệt được kiểu với giá trị.
  {
    files: ["src/**/*.{ts,tsx}", "instrumentation.ts", "prisma/**/*.ts"],
    rules: {
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },
]);

export default eslintConfig;
