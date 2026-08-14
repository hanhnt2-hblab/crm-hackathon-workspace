// `AD-CP-6` — máy chủ MCP, phơi ĐÚNG NĂM mục hạng đọc-chung.
//
// Tệp này ở tầng ④ chứ không ở tầng ②, và đó là quyết định chịu lực: `AD-AG-3`
// chốt `src/agent` không nhập `src/capability` KỂ CẢ kiểu, nên một bản sao ở
// bên đó buộc đúng lời nhập bị cấm. Máy chủ đi vào tầng ② qua
// `AgentDeps.crmMcpServer` dưới dạng **giá trị mờ**.
//
// ⚠ TẬP NÀY LÀ LỚP PHÒNG THỦ, KHÔNG PHẢI ĐƯỜNG LẤY DỮ LIỆU.
// `AD-AG-3`: agent không gọi capability nào. Đã đo, hai lượt thật: handler chạy
// **0 lần**, và vẫn rút được 5 Phát hiện. Tập tồn tại để glob
// `allowedTools: ["mcp__crm__*"]` có đối tượng khớp, và để phép đối chứng phá
// hoại của `AD-1` có thứ để đo. `AD-CP-6` đã LOẠI phương án phơi rỗng: glob
// khớp rỗng thì phép đo mất đối tượng, và triệu chứng là agent *trông như* gọi
// capability, handler chạy 0 lần, **$1,607** một lượt.

import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import type { Actor } from "@/core/actor";
import type { Registry } from "./registry";
import { ALL_ENTRIES } from "./caps";

/// Khoá server, khai MỘT LẦN. `AD-AG-4` bắt cùng một chuỗi đi vào cả
/// `mcpServers` lẫn `allowedTools` — hai chuỗi rời nhau là cách chắc chắn để
/// glob khớp rỗng mà không ai thấy. `client.ts` khai bản của nó là `"crm"`;
/// hai bên phải khớp, và phép kiểm đối chiếu.
export const MCP_SERVER_KEY = "crm";

/// `AD-CP-6` — đúng năm tên. Danh sách viết TAY chứ không lọc động theo
/// `exposeToMcp`, và đó là chủ đích: lọc động thì thêm một cờ ở đâu đó là bề
/// mặt agent lớn thêm mà không ai duyệt. Ở đây, mở rộng bề mặt là một dòng
/// nhìn thấy được trong diff.
export const MCP_TOOL_NAMES = [
  "readArticle",
  "readAccountType",
  "listEnums",
  "readAccountList",
  "readSetting",
] as const;

/// Máy chủ đóng kín trên MỘT actor hệ thống (`AD-AG-4`).
///
/// ⚠ Không tool nào nhận trường danh tính. Nếu có, agent tự khai được mình là
/// ai, và cả bảy bước của `AD-4` mất đầu vào — Cổng sẽ canh một danh tính do
/// chính bên bị canh cung cấp.
const SYSTEM_ACTOR: Actor = { kind: "system" };

export function createCrmMcpServer(registry: Registry): unknown {
  const byName = new Map(ALL_ENTRIES.map((e) => [e.name, e]));

  const tools = MCP_TOOL_NAMES.map((name) => {
    const entry = byName.get(name);
    if (!entry) {
      // Hỏng ồn ào LÚC DỰNG. Một tên trong danh sách mà không có trong sổ nghĩa
      // là glob sẽ khớp thiếu, và triệu chứng lúc chạy là *"mô hình không chịu
      // dùng tool"* — đánh lạc hướng sang đúng chỗ khó nhất để chẩn đoán.
      throw new Error(`AD-CP-6: capability \`${name}\` không có trong sổ đăng ký.`);
    }
    if (entry.kind !== "read") {
      throw new Error(`AD-CP-6: \`${name}\` là mục ghi — không mục ghi nào được phơi.`);
    }

    return tool(
      // Tên tool là NGUYÊN VĂN tên capability (`AD-CP-6`). Đổi tên ở một bên là
      // glob khớp thiếu, im lặng.
      name,
      `Đọc ${name} — hạng đọc-chung, chỉ đọc.`,
      // ⚠ `.shape`, KHÔNG phải `entry.params`, và KHÔNG gọi `z.toJSONSchema`.
      // SDK nhận `AnyZodRawShape` (`{ a: z.string() }`), không nhận `ZodObject`.
      // Đây là lý do `AD-CP-3` bắt `params` phải là `ZodObject`: `.shape` chỉ có
      // trên `ZodObject`, và khai rộng hơn là `TS2339` ngay tại dòng này.
      entry.params.shape,
      async (args: unknown) => {
        // Đi qua `loadCapability`, tức qua đủ bảy bước của `AD-4`. Không có
        // đường tắt: `AD-1` chốt *không capability nào chạy mà không qua Cổng*,
        // và một handler gọi thẳng `entry.fn` là đúng cái cửa hậu đó.
        const fn = await registry.loadCapability(name, SYSTEM_ACTOR);
        const ket = await fn(args);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(ket ?? null) }],
        };
      },
      {
        // `alwaysLoad: true` cả năm (`AD-CP-6`). SDK bật tool search mặc định
        // và **hoãn** nạp lược đồ MCP, tốn thêm MỘT LƯỢT mà `AD-11` đếm vào
        // trần. Với năm tool nhỏ, nạp sẵn rẻ hơn hẳn.
        alwaysLoad: true,
      },
    );
  });

  return createSdkMcpServer({
    name: MCP_SERVER_KEY,
    version: "1.0.0",
    tools,
  });
}
