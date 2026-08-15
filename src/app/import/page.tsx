// Luật thi `3.1` — bề mặt nạp dữ liệu bằng upload zip.
//
// Thay cho cách nạp bằng một lệnh ở `§7.5` của đề bài. Luật ngày thi ghi rõ:
// *"Nạp bộ dữ liệu bằng tính năng upload file zip từ giao diện — không gõ tay,
// không sửa mã"*, và *"đội chưa nạp được dữ liệu thì các lượt chấm chưa có dữ
// liệu để chấm cho đội đó"*. Đây là điều kiện tiên quyết của mọi điểm số.

import { Block } from "../_block";
import { ImportForm } from "./_form";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <>
      <div className="row">
        <h1 className="page-title">Nạp bộ dữ liệu</h1>
      </div>
      <Block title="Tải tệp zip">
        <ImportForm />
      </Block>
    </>
  );
}
