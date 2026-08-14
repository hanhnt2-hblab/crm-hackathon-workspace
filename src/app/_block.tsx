"use client";

// `AD-UI-8` — KHỐI HỎNG ĐỘC LẬP.
//
// Luật đòi *"mỗi khối một `error.tsx` riêng"*, nhưng `error.tsx` của Next là
// ranh giới theo **đoạn đường dẫn**, không theo khối: một trang có bốn khối
// (`S3`) chỉ có một `error.tsx`, nên một khối hỏng vẫn đổ cả trang — đúng thứ
// `AD-UI-8` dựng ra để cấm. Ranh giới đúng hạt là một error boundary React
// bọc từng khối, và error boundary bắt buộc là **class component client**
// (React chưa có bản hook).
//
// Ghép với `Suspense` anh em ở phía server: `<Block><Suspense …>` cho mỗi khối
// thì một khối chậm không chặn khối khác, và một khối hỏng không kéo theo ba
// khối kia.
//
// ⚠ Câu báo lỗi nói **việc phải làm**, không nói mã lỗi (`EXPERIENCE.md`,
// *Giọng chữ*: *"Không đọc được nguồn của Aozora Tech. Vòng sau thử lại."*,
// không phải *"Fetch failed (503)"*).

import { Component, type ReactNode } from "react";

type Props = { title: string; children: ReactNode };
type State = { failed: boolean };

export class Block extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="card">
          <h2 className="card-title">{this.props.title}</h2>
          <p className="failed" role="alert">
            Chưa đọc được khối này. Các khối khác trên trang vẫn dùng được — tải
            lại trang để thử lại.
          </p>
        </section>
      );
    }
    return this.props.children;
  }
}
