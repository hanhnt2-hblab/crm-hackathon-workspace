import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /// ⚠ Luật thi `3.1` — mặc định của Next cho server action là **1 MB**, và
    /// bộ dữ liệu BTC là **2,9 MB**. Không nâng thì nút *Nạp dữ liệu* im lặng
    /// không làm gì: Next chặn ở tầng vận chuyển, action không bao giờ chạy, và
    /// màn hình không có thông báo nào để đọc.
    ///
    /// Đã đo bằng trình duyệt thật — phép thử gọi thẳng `applyImport` KHÔNG
    /// thấy được lỗi này, vì nó không đi qua đường HTTP.
    ///
    /// 64 MB: bộ hiện tại 2,9 MB, và BTC có thể phát bộ lớn hơn ở vòng sau.
    serverActions: { bodySizeLimit: "64mb" },
  },
  /* config options here */
};

export default nextConfig;
