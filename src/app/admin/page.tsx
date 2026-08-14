// `S8` Admin dashboard · `AD-9` · `AD-UI-10` · `D28` · `UJ-3`.
//
// ⚠ MÀN 403 LÀ **KẾT QUẢ** CỦA MỘT LẦN TỪ CHỐI, không phải sản phẩm của một
// phép kiểm vai riêng (`AD-UI-10`). Hành động ĐẦU TIÊN của bề mặt này là gọi
// capability `readAdminMetrics`, vốn khai `allowedRoles: ["admin"]`; phiên
// Sales vào thẳng địa chỉ này vẫn nhận `GateDenied("role")` từ bước ⑤ của Cổng.
//
// Nhờ vậy `D28` (*"chặn ở tầng nghiệp vụ, không phải ẩn menu"*) nằm **trên**
// đường đi. Mục menu vẫn ẩn với Sales ở `layout.tsx` — nhưng đó là thẩm mỹ, và
// nếu ai xoá dòng ẩn đó thì chặn vẫn còn nguyên.
//
// ⚠ `try/catch` ở đây KHÔNG phá luật *"chỉ `action()` có `try/catch`"*: luật đó
// (`AD-UI-6`) nói về **server action**, tức đường GHI, nơi Next nuốt mất mã lỗi.
// Đây là đường ĐỌC trong một server component, và `GateDenied` ở đây là một
// **kết quả mong đợi** cần render thành màn 403 chứ không phải một sự cố.

import { Suspense } from "react";
import { GateDenied } from "@/capability/errors";
import { Block } from "../_block";
import { appRegistry } from "../_registry";
import { currentSession } from "../_session";
import { AiSwitch } from "./_ai-switch";

type MetricPair = { numerator: number; denominator: number; ratio: number | null };

type AdminMetrics = {
  autoAccept: MetricPair;
  errorDetection: MetricPair;
  unclassified: { ratio: number | null; overThreshold: boolean };
  blind: { tooFast: number; burstPerMinute: number; overThreshold: boolean };
};

export default function AdminPage() {
  return (
    <>
      <div className="row">
        <h1 className="page-title">Bảng quản trị</h1>
      </div>
      <Block title="Công tắc AI">
        <Suspense fallback={<p className="muted">Đang đọc trạng thái…</p>}>
          <AiSwitchBlock />
        </Suspense>
      </Block>
      <Block title="Số đo">
        <Suspense fallback={<p className="muted">Đang tính số đo…</p>}>
          <MetricsBlock />
        </Suspense>
      </Block>
    </>
  );
}

/// `T-1` · `T-9` — công tắc phải nằm ở bề mặt, không chỉ ở CSDL.
///
/// ⚠ Đọc trạng thái qua `readAiEnabled` chứ không nhận từ `layout.tsx`: hai
/// cây render là hai lượt đọc, và truyền xuống qua props là dựng một đường dẫn
/// trạng thái thứ hai có thể trôi khỏi cái đầu.
async function AiSwitchBlock() {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("readAiEnabled", session.actor);
  const { aiEnabled } = (await read({})) as { aiEnabled: boolean };
  return <AiSwitch aiEnabled={aiEnabled} />;
}

async function MetricsBlock() {
  const session = await currentSession();

  let data: AdminMetrics;
  try {
    const read = await appRegistry.loadCapability("readAdminMetrics", session.actor);
    data = (await read({})) as AdminMetrics;
  } catch (error) {
    if (error instanceof GateDenied && error.reason === "role") {
      return (
        <section className="card">
          <h2 className="card-title">Không đủ quyền</h2>
          <p className="failed" role="alert">
            Màn hình này cần tài khoản Quản trị. Tài khoản đang dùng là Sales.
          </p>
          <p className="field-note">
            Chặn diễn ra ở tầng nghiệp vụ: địa chỉ này mở được, nhưng lượt đọc
            đầu tiên bị Cổng từ chối.
          </p>
        </section>
      );
    }
    throw error;
  }

  return (
    <>
      <div className="grid-4">
        <Ratio
          label="Tỉ lệ duyệt thẳng"
          pair={data.autoAccept}
          hint="Duyệt / đã có người quyết. Sửa-rồi-duyệt không tính vào tử số."
        />
        <Ratio
          label="Tỉ lệ bắt lỗi"
          pair={data.errorDetection}
          hint="Bỏ vì thông tin sai / đã có người quyết."
        />
        <div className="stat">
          <div className="stat-num">
            {data.unclassified.ratio === null
              ? "—"
              : `${Math.round(data.unclassified.ratio * 100)}%`}
          </div>
          <div className="stat-label">
            phát hiện chưa phân loại
            {data.unclassified.overThreshold ? " · vượt ngưỡng" : ""}
          </div>
        </div>
        <div className="stat">
          <div className="stat-num">{data.blind.tooFast}</div>
          <div className="stat-label">
            lượt duyệt nhanh bất thường trong 24 giờ
            {data.blind.overThreshold ? " · cần rà lại" : ""}
          </div>
        </div>
      </div>

      <section className="card">
        <h2 className="card-title">Đọc hai con số này thế nào</h2>
        <p>
          Tỉ lệ duyệt cao mà số lượt duyệt nhanh cũng cao là dấu hiệu{" "}
          <strong>duyệt mù</strong>, không phải dấu hiệu máy giỏi. Hai con số chỉ
          nói được điều đó khi đứng cạnh nhau.
        </p>
      </section>
    </>
  );
}

/// `EXPERIENCE.md` (`S8`, hàng *Rỗng*) — chưa đủ mẫu thì hiện *"cần ít nhất N
/// lượt quyết"*, **không** hiện `0%`. `0%` đọc thành *máy sai hết*, và đó là
/// một câu sai về dữ liệu chưa có.
function Ratio({
  label,
  pair,
  hint,
}: {
  label: string;
  pair: MetricPair;
  hint: string;
}) {
  return (
    <div className="stat">
      <div className="stat-num">
        {pair.ratio === null ? "—" : `${Math.round(pair.ratio * 100)}%`}
      </div>
      <div className="stat-label">
        {label}
        {pair.ratio === null ? (
          <>
            {" · "}chưa đủ mẫu ({pair.denominator} lượt quyết)
          </>
        ) : (
          <>
            {" · "}
            {pair.numerator}/{pair.denominator} lượt quyết
          </>
        )}
      </div>
      <div className="field-note">{hint}</div>
    </div>
  );
}
