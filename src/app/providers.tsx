"use client";

// `AD-UI-4` — ĐÚNG MỘT tệp registry của Griffel, và cờ flush-một-lần.
//
// `@fluentui/react-components` không ship directive `'use client'` (kiểm trên
// bundle đã publish), nên mọi component Fluent phải nằm dưới một tệp
// `'use client'` của đội — tệp này là gốc đó.
//
// ⚠ Cờ `flushed` là BẮT BUỘC, không phải tối ưu. `renderToStyleElements()` trả
// **toàn bộ** CSS đã thu thập ở **mỗi** lần gọi, còn Next gọi callback của
// `useServerInsertedHTML` một lần cho **mỗi** lần flush stream. Thiếu cờ thì
// toàn bộ stylesheet nhân bản vào thân trang, và bản cũ ghi đè style sau khi
// điều hướng phía client — lỗi chỉ lộ ở trang lớn, tức qua mắt lúc thử rồi vỡ
// đúng lúc chấm.
//
// ⚠ Bọc quanh PHẦN THÂN, không bọc thẻ `html` (`AD-UI-4`).

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import {
  createDOMRenderer,
  FluentProvider,
  RendererProvider,
  renderToStyleElements,
  webLightTheme,
} from "@fluentui/react-components";

export function Providers({ children }: { children: React.ReactNode }) {
  const [renderer] = useState(() => createDOMRenderer());
  const [flushed, setFlushed] = useState(false);

  useServerInsertedHTML(() => {
    if (flushed) return null;
    setFlushed(true);
    return <>{renderToStyleElements(renderer)}</>;
  });

  return (
    <RendererProvider renderer={renderer}>
      {/* `DESIGN.md` chốt lớp token Fluent 2 và **một** bộ màu duy nhất — nền
          tối đã bỏ khỏi hệ, nên ở đây chỉ có `webLightTheme`. */}
      <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
    </RendererProvider>
  );
}
