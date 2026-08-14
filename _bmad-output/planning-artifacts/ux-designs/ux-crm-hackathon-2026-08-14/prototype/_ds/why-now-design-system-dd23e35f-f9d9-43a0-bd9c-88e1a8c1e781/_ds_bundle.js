/* @ds-bundle: {"format":4,"namespace":"WhyNowDesignSystem_dd23e3","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"TextField","sourcePath":"components/core/TextField.jsx"},{"name":"Metric","sourcePath":"components/data/Metric.jsx"},{"name":"QueueCallout","sourcePath":"components/data/QueueCallout.jsx"},{"name":"StatBox","sourcePath":"components/data/StatBox.jsx"},{"name":"StatRow","sourcePath":"components/data/StatRow.jsx"},{"name":"TimelineEntry","sourcePath":"components/data/TimelineEntry.jsx"},{"name":"AIOffBanner","sourcePath":"components/feedback/AIOffBanner.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"NewItemsBanner","sourcePath":"components/feedback/NewItemsBanner.jsx"},{"name":"PartialError","sourcePath":"components/feedback/PartialError.jsx"},{"name":"SkeletonRows","sourcePath":"components/feedback/SkeletonRows.jsx"},{"name":"Legend","sourcePath":"components/masthead/Legend.jsx"},{"name":"Masthead","sourcePath":"components/masthead/Masthead.jsx"},{"name":"SectionKicker","sourcePath":"components/masthead/SectionKicker.jsx"},{"name":"SnapshotHighlight","sourcePath":"components/reading/SnapshotHighlight.jsx"},{"name":"ConfidenceBadge","sourcePath":"components/signals/ConfidenceBadge.jsx"},{"name":"SignalChip","sourcePath":"components/signals/SignalChip.jsx"},{"name":"SourceByline","sourcePath":"components/signals/SourceByline.jsx"},{"name":"SuggestionPin","sourcePath":"components/signals/SuggestionPin.jsx"},{"name":"WarningFlag","sourcePath":"components/signals/WarningFlag.jsx"},{"name":"DISMISS_REASONS","sourcePath":"components/suggestions/DismissReasonPicker.jsx"},{"name":"DismissReasonPicker","sourcePath":"components/suggestions/DismissReasonPicker.jsx"},{"name":"SuggestionCard","sourcePath":"components/suggestions/SuggestionCard.jsx"},{"name":"QuoteBlock","sourcePath":"components/worklist/QuoteBlock.jsx"},{"name":"StagePill","sourcePath":"components/worklist/StagePill.jsx"},{"name":"UndoButton","sourcePath":"components/worklist/UndoButton.jsx"},{"name":"WorkItem","sourcePath":"components/worklist/WorkItem.jsx"}],"sourceHashes":{"components/core/Button.jsx":"686640f926a9","components/core/TextField.jsx":"e5d19fab21e4","components/data/Metric.jsx":"41bdb578730a","components/data/QueueCallout.jsx":"2af08d1ff9b6","components/data/StatBox.jsx":"f8591ba7ed89","components/data/StatRow.jsx":"21e8c607da0f","components/data/TimelineEntry.jsx":"0a6a91f219d6","components/feedback/AIOffBanner.jsx":"8bc6ab80b6fb","components/feedback/EmptyState.jsx":"fded84ca382b","components/feedback/NewItemsBanner.jsx":"4674694e5788","components/feedback/PartialError.jsx":"34c71778a576","components/feedback/SkeletonRows.jsx":"a38844d3a723","components/masthead/Legend.jsx":"49fcee19ba1a","components/masthead/Masthead.jsx":"49e87542f915","components/masthead/SectionKicker.jsx":"ba4a934c91bf","components/reading/SnapshotHighlight.jsx":"d02e974b83b4","components/signals/ConfidenceBadge.jsx":"e84ef75f9fe4","components/signals/SignalChip.jsx":"c327881e39bb","components/signals/SourceByline.jsx":"9aba72347720","components/signals/SuggestionPin.jsx":"a303bf24d403","components/signals/WarningFlag.jsx":"bf3a5e221cba","components/suggestions/DismissReasonPicker.jsx":"d1f35b8dfa5b","components/suggestions/SuggestionCard.jsx":"b1c839a936e3","components/worklist/QuoteBlock.jsx":"1f49e01cdb8d","components/worklist/StagePill.jsx":"1098cca05c1f","components/worklist/UndoButton.jsx":"e77173fefa7c","components/worklist/WorkItem.jsx":"bae309f6b60d","ui_kits/why-now/kit-account.jsx":"759c77f208e0","ui_kits/why-now/kit-admin.jsx":"8ee6a04cbcdd","ui_kits/why-now/kit-app.jsx":"d06594945048","ui_kits/why-now/kit-data.jsx":"19a51a02796f","ui_kits/why-now/kit-queue.jsx":"653c5504e11e","ui_kits/why-now/kit-today.jsx":"8a1246d710cc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WhyNowDesignSystem_dd23e3 = window.WhyNowDesignSystem_dd23e3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
const base = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--sp-6)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12-5)",
  fontWeight: "var(--fw-bold)",
  lineHeight: 1,
  borderRadius: "var(--radius-0)",
  border: "1px solid transparent",
  padding: "8px 14px",
  cursor: "pointer",
  textDecoration: "none",
  transition: "background var(--dur-instant) var(--ease-standard), color var(--dur-instant) var(--ease-standard)"
};
const buttonVariants = {
  primary: {
    background: "var(--ink)",
    color: "var(--paper)",
    borderColor: "var(--ink)"
  },
  secondary: {
    background: "var(--paper)",
    color: "var(--ink)",
    borderColor: "var(--rule-field)"
  },
  ghost: {
    background: "transparent",
    color: "var(--link)",
    borderColor: "transparent",
    padding: "8px 6px"
  },
  suggestion: {
    background: "var(--suggestion)",
    color: "#FDF6EC",
    borderColor: "var(--suggestion)"
  },
  danger: {
    background: "var(--paper)",
    color: "var(--warn)",
    borderColor: "var(--warn-border)"
  },
  onMachine: {
    background: "var(--band-2)",
    color: "var(--band-ink)",
    borderColor: "var(--band-rule)"
  }
};
const buttonSizes = {
  sm: {
    padding: "5px 10px",
    fontSize: "var(--fs-11-5)"
  },
  md: {},
  block: {
    padding: "8px",
    width: "100%"
  }
};
function Button({
  variant = "primary",
  size = "md",
  glyph,
  disabled,
  href,
  children,
  style,
  ...rest
}) {
  const s = Object.assign({}, base, buttonVariants[variant] || buttonVariants.primary, buttonSizes[size] || null, disabled ? {
    opacity: .45,
    cursor: "not-allowed"
  } : null, style);
  const inner = [glyph ? React.createElement("span", {
    key: "g",
    style: {
      fontSize: "var(--fs-12)",
      lineHeight: 1
    }
  }, glyph) : null, children];
  if (href && !disabled) return React.createElement("a", Object.assign({
    href,
    style: s
  }, rest), inner);
  return React.createElement("button", Object.assign({
    type: "button",
    disabled,
    style: s
  }, rest), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/TextField.jsx
try { (() => {
const twLabel = {
  display: "block",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-11)",
  fontWeight: "var(--fw-black)",
  letterSpacing: "var(--ls-label)",
  textTransform: "uppercase",
  color: "var(--ink-mid-2)",
  marginBottom: "var(--sp-5)"
};
const twInput = {
  display: "block",
  width: "100%",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12-5)",
  color: "var(--ink)",
  background: "var(--paper-tint)",
  border: "1px solid var(--rule-field)",
  borderRadius: "var(--radius-0)",
  padding: "7px 9px",
  lineHeight: "var(--lh-normal)"
};
const twHint = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-11)",
  color: "var(--ink-2)",
  lineHeight: "var(--lh-normal)",
  marginTop: "var(--sp-5)"
};
function TextField({
  label,
  hint,
  optional,
  multiline,
  rows = 3,
  value,
  onChange,
  placeholder,
  id,
  ...rest
}) {
  const tag = multiline ? "textarea" : "input";
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, [label ? React.createElement("label", {
    key: "l",
    htmlFor: id,
    style: twLabel
  }, [label, optional ? React.createElement("span", {
    key: "o",
    style: {
      fontWeight: "var(--fw-regular)",
      letterSpacing: 0,
      textTransform: "none",
      color: "var(--ink-3)",
      marginLeft: "var(--sp-6)"
    }
  }, "tuỳ chọn") : null]) : null, React.createElement(tag, Object.assign({
    key: "i",
    id,
    value,
    onChange,
    placeholder,
    rows: multiline ? rows : undefined,
    style: twInput
  }, rest)), hint ? React.createElement("div", {
    key: "h",
    style: twHint
  }, hint) : null]);
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextField.jsx", error: String((e && e.message) || e) }); }

// components/data/Metric.jsx
try { (() => {
const mtWrap = {
  background: "var(--paper)",
  border: "var(--border-hairline)",
  padding: "var(--pad-box)",
  fontFamily: "var(--font-sans)"
};
const mtLabel = {
  fontSize: "var(--fs-11)",
  letterSpacing: "var(--ls-box)",
  textTransform: "uppercase",
  fontWeight: "var(--fw-black)",
  color: "var(--ink-2)"
};
const mtValue = {
  fontSize: "30px",
  fontWeight: "var(--fw-black)",
  lineHeight: 1.05,
  color: "var(--ink)",
  fontVariantNumeric: "var(--num-tabular)",
  marginTop: "var(--sp-6)"
};
const mtCompare = {
  fontSize: "11.5px",
  color: "var(--ink-2)",
  marginTop: "var(--sp-6)",
  lineHeight: "var(--lh-normal)"
};
const mtInsufficient = {
  fontSize: "var(--fs-12-5)",
  color: "var(--ink-2)",
  marginTop: "var(--sp-8)",
  lineHeight: "var(--lh-normal)"
};
function Metric({
  label,
  value,
  compare,
  insufficient,
  insufficientNote,
  tone = "default"
}) {
  const v = Object.assign({}, mtValue, tone === "warn" ? {
    color: "var(--warn)"
  } : null);
  return React.createElement("div", {
    style: mtWrap
  }, [React.createElement("div", {
    key: "l",
    style: mtLabel
  }, label), insufficient ? React.createElement("div", {
    key: "i",
    style: mtInsufficient
  }, insufficientNote || "Chưa đủ dữ liệu để tính") : React.createElement("div", {
    key: "v",
    style: v
  }, value), !insufficient && compare ? React.createElement("div", {
    key: "c",
    style: mtCompare
  }, compare) : null]);
}
Object.assign(__ds_scope, { Metric });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Metric.jsx", error: String((e && e.message) || e) }); }

// components/data/StatBox.jsx
try { (() => {
const sbBox = {
  background: "var(--paper)",
  border: "var(--border-hairline)",
  padding: "var(--pad-box)",
  fontFamily: "var(--font-sans)"
};
const sbTitle = {
  margin: "0 0 2px",
  fontSize: "var(--fs-11)",
  letterSpacing: "var(--ls-box)",
  textTransform: "uppercase",
  fontWeight: "var(--fw-black)",
  color: "var(--ink)"
};
const sbSub = {
  fontSize: "var(--fs-11)",
  color: "var(--ink-2)",
  marginBottom: "var(--sp-8)",
  lineHeight: "var(--lh-normal)"
};
const sbNote = {
  fontSize: "var(--fs-11)",
  color: "var(--ink-2)",
  lineHeight: "var(--lh-relaxed)",
  marginTop: "var(--sp-7)"
};
function StatBox({
  title,
  sub,
  note,
  children
}) {
  return React.createElement("div", {
    style: sbBox
  }, [title ? React.createElement("h3", {
    key: "t",
    style: sbTitle
  }, title) : null, sub ? React.createElement("div", {
    key: "s",
    style: sbSub
  }, sub) : null, children, note ? React.createElement("div", {
    key: "n",
    style: sbNote
  }, note) : null]);
}
Object.assign(__ds_scope, { StatBox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatBox.jsx", error: String((e && e.message) || e) }); }

// components/data/StatRow.jsx
try { (() => {
const srRow = {
  display: "flex",
  alignItems: "baseline",
  gap: "var(--sp-8)",
  padding: "3.5px 0",
  borderBottom: "var(--border-dotted)",
  fontSize: "var(--fs-12-5)",
  fontFamily: "var(--font-sans)"
};
const srName = {
  flex: 1,
  color: "var(--ink-body)"
};
const srCount = {
  fontWeight: "var(--fw-bold)",
  fontVariantNumeric: "var(--num-tabular)",
  width: "24px",
  textAlign: "right"
};
const srValue = {
  fontVariantNumeric: "var(--num-tabular)",
  color: "var(--ink-2)",
  width: "96px",
  textAlign: "right",
  fontSize: "var(--fs-12)"
};
function StatRow({
  name,
  count,
  value,
  closed = false,
  last = false
}) {
  const dim = closed ? {
    color: "var(--text-closed)"
  } : null;
  return React.createElement("div", {
    style: Object.assign({}, srRow, last ? {
      borderBottom: "none"
    } : null)
  }, [React.createElement("span", {
    key: "n",
    style: Object.assign({}, srName, dim)
  }, name), count != null ? React.createElement("span", {
    key: "c",
    style: Object.assign({}, srCount, dim)
  }, count) : null, value != null ? React.createElement("span", {
    key: "v",
    style: Object.assign({}, srValue, dim)
  }, value) : null]);
}
Object.assign(__ds_scope, { StatRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatRow.jsx", error: String((e && e.message) || e) }); }

// components/data/TimelineEntry.jsx
try { (() => {
const teRow = {
  display: "grid",
  gridTemplateColumns: "96px 1fr",
  gap: "var(--gap-row)",
  padding: "10px 0",
  borderBottom: "var(--border-hairline)",
  fontFamily: "var(--font-sans)"
};
const teWhen = {
  fontSize: "var(--fs-11-5)",
  color: "var(--ink-3)",
  fontVariantNumeric: "var(--num-tabular)",
  paddingTop: "2px"
};
const teText = {
  fontSize: "var(--fs-12-5)",
  color: "var(--ink-body)",
  lineHeight: "var(--lh-relaxed)"
};
const teTag = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  marginLeft: "var(--sp-8)",
  fontSize: "var(--fs-10)",
  fontWeight: "var(--fw-black)",
  letterSpacing: "var(--ls-badge)",
  textTransform: "uppercase",
  color: "var(--rail-ink)",
  background: "var(--rail)",
  padding: "1px 5px",
  verticalAlign: "1px"
};
const teAuthor = {
  fontSize: "var(--fs-11)",
  color: "var(--ink-3)",
  marginTop: "var(--sp-3)"
};
function TimelineEntry({
  when,
  children,
  bySystem = false,
  author,
  last = false
}) {
  return React.createElement("div", {
    style: Object.assign({}, teRow, last ? {
      borderBottom: "none"
    } : null)
  }, [React.createElement("div", {
    key: "w",
    style: teWhen
  }, when), React.createElement("div", {
    key: "t"
  }, [React.createElement("div", {
    key: "x",
    style: teText
  }, [children, bySystem ? React.createElement("span", {
    key: "tg",
    style: teTag
  }, "⚙ do hệ thống thêm") : null]), author ? React.createElement("div", {
    key: "a",
    style: teAuthor
  }, author) : null])]);
}
Object.assign(__ds_scope, { TimelineEntry });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/TimelineEntry.jsx", error: String((e && e.message) || e) }); }

// components/feedback/AIOffBanner.jsx
try { (() => {
const aoWrap = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-12)",
  padding: "10px 24px",
  background: "var(--band)",
  borderLeft: "var(--rail-left)",
  borderBottom: "1px solid var(--band-edge)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12-5)",
  color: "var(--band-ink)",
  lineHeight: "var(--lh-normal)"
};
const aoGlyph = {
  fontSize: "var(--fs-13)",
  color: "var(--rail)"
};
const aoNote = {
  color: "var(--band-ink-2)"
};
function AIOffBanner({
  since,
  reason,
  canResume = false,
  onResume
}) {
  return React.createElement("div", {
    style: aoWrap,
    role: "status"
  }, [React.createElement("span", {
    key: "g",
    style: aoGlyph
  }, "⚙"), React.createElement("span", {
    key: "t"
  }, [React.createElement("b", {
    key: "b"
  }, "Phần gợi ý đang tắt."), " Việc đến hạn, quá hạn và cờ cảnh báo vẫn hiện đủ; ô do máy đặt giữ nguyên, chỉ ngừng sinh mới.", since ? React.createElement("span", {
    key: "s",
    style: aoNote
  }, " Tắt từ " + since + ".") : null, reason ? React.createElement("span", {
    key: "r",
    style: aoNote
  }, " Lý do: " + reason + ".") : null]), canResume ? React.createElement(__ds_scope.Button, {
    key: "a",
    variant: "onMachine",
    size: "sm",
    onClick: onResume,
    style: {
      marginLeft: "auto"
    }
  }, "Bật lại") : null]);
}
Object.assign(__ds_scope, { AIOffBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/AIOffBanner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
const esWrap = {
  padding: "28px 24px",
  background: "var(--paper)",
  fontFamily: "var(--font-sans)",
  borderBottom: "var(--border-hairline)"
};
const esLine = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-17)",
  color: "var(--ink-strong)",
  lineHeight: "var(--lh-snug)"
};
const esSub = {
  fontSize: "var(--fs-12-5)",
  color: "var(--ink-2)",
  marginTop: "var(--sp-8)",
  lineHeight: "var(--lh-relaxed)"
};
const esAction = {
  marginTop: "var(--sp-12)"
};
function EmptyState({
  line,
  sub,
  children
}) {
  return React.createElement("div", {
    style: esWrap
  }, [React.createElement("div", {
    key: "l",
    style: esLine
  }, line), sub ? React.createElement("div", {
    key: "s",
    style: esSub
  }, sub) : null, children ? React.createElement("div", {
    key: "a",
    style: esAction
  }, children) : null]);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/NewItemsBanner.jsx
try { (() => {
const nbWrap = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-10)",
  padding: "7px 24px",
  background: "var(--suggestion-bg)",
  borderBottom: "1px solid var(--suggestion-border)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12)",
  color: "var(--suggestion-ink)"
};
const nbBtn = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12)",
  fontWeight: "var(--fw-bold)",
  color: "var(--suggestion)",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--suggestion)",
  padding: 0,
  cursor: "pointer",
  marginLeft: "auto"
};
function NewItemsBanner({
  count,
  noun = "việc mới",
  scanAt,
  onLoad
}) {
  return React.createElement("div", {
    style: nbWrap,
    role: "status"
  }, [React.createElement("span", {
    key: "t"
  }, ["Có ", React.createElement("b", {
    key: "n"
  }, count), " " + noun + " từ vòng quét", scanAt ? " " + scanAt : null, " — trang không tự nạp để không cắt việc bạn đang làm."]), React.createElement("button", {
    key: "b",
    type: "button",
    style: nbBtn,
    onClick: onLoad
  }, "Nạp bây giờ")]);
}
Object.assign(__ds_scope, { NewItemsBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/NewItemsBanner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/PartialError.jsx
try { (() => {
const peWrap = {
  padding: "12px 14px",
  background: "var(--warn-bg)",
  border: "1px solid var(--warn-border)",
  fontFamily: "var(--font-sans)"
};
const peHead = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-6)",
  fontSize: "var(--fs-12-5)",
  fontWeight: "var(--fw-black)",
  color: "var(--warn)"
};
const peBody = {
  fontSize: "var(--fs-12)",
  color: "var(--ink-body)",
  marginTop: "var(--sp-6)",
  lineHeight: "var(--lh-relaxed)"
};
const peRetry = {
  marginTop: "var(--sp-9)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12)",
  fontWeight: "var(--fw-bold)",
  color: "var(--warn)",
  background: "var(--paper)",
  border: "1px solid var(--warn-border)",
  padding: "5px 10px",
  cursor: "pointer"
};
function PartialError({
  title,
  detail,
  retryLabel,
  onRetry
}) {
  return React.createElement("div", {
    style: peWrap,
    role: "alert"
  }, [React.createElement("div", {
    key: "h",
    style: peHead
  }, ["▲ ", title]), detail ? React.createElement("div", {
    key: "d",
    style: peBody
  }, detail) : null, onRetry ? React.createElement("button", {
    key: "r",
    type: "button",
    style: peRetry,
    onClick: onRetry
  }, retryLabel || "Thử lại") : null]);
}
Object.assign(__ds_scope, { PartialError });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/PartialError.jsx", error: String((e && e.message) || e) }); }

// components/feedback/SkeletonRows.jsx
try { (() => {
const skRow = {
  display: "grid",
  gridTemplateColumns: "var(--col-when) 1fr var(--col-side)",
  gap: "var(--gap-row)",
  padding: "var(--pad-row)",
  borderBottom: "var(--border-hairline)",
  background: "var(--paper)"
};
const skBar = {
  height: "11px",
  background: "var(--rule)",
  borderRadius: "var(--radius-0)"
};
function SkeletonRows({
  count = 9
}) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push(React.createElement("div", {
      key: i,
      style: skRow,
      "aria-hidden": "true"
    }, [React.createElement("div", {
      key: "a",
      style: Object.assign({}, skBar, {
        width: "64px"
      })
    }), React.createElement("div", {
      key: "b"
    }, [React.createElement("div", {
      key: "1",
      style: Object.assign({}, skBar, {
        width: "42%"
      })
    }), React.createElement("div", {
      key: "2",
      style: Object.assign({}, skBar, {
        width: "78%",
        marginTop: "var(--sp-9)",
        height: "15px"
      })
    })]), React.createElement("div", {
      key: "c",
      style: Object.assign({}, skBar, {
        width: "88px",
        marginLeft: "auto"
      })
    })]));
  }
  return React.createElement("div", {
    role: "status",
    "aria-label": "Đang tải danh sách việc"
  }, rows);
}
Object.assign(__ds_scope, { SkeletonRows });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/SkeletonRows.jsx", error: String((e && e.message) || e) }); }

// components/masthead/Legend.jsx
try { (() => {
const lgWrap = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-16)",
  flexWrap: "wrap",
  padding: "var(--pad-legend)",
  background: "var(--surface-legend)",
  borderTop: "1px solid var(--rule-strong)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-11)",
  color: "var(--legend-ink)"
};
const lgKey = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--sp-6)"
};
const lgSwBand = {
  display: "inline-block",
  width: "26px",
  height: "13px",
  background: "var(--band)",
  borderLeft: "var(--rail-left)"
};
const lgSwPaper = {
  display: "inline-block",
  width: "26px",
  height: "13px",
  background: "var(--paper)",
  border: "var(--border-hairline)"
};
function Legend({
  items
}) {
  const list = items || [{
    swatch: "machine",
    text: "Dải nền tối + ray vàng + ⚙ = Next step do hệ thống đặt"
  }, {
    swatch: "paper",
    text: "Giấy trắng + ✎ = Next step do bạn gõ"
  }];
  return React.createElement("div", {
    style: lgWrap
  }, list.map(function (it, i) {
    return React.createElement("span", {
      key: i,
      style: lgKey
    }, [it.swatch === "machine" ? React.createElement("span", {
      key: "s",
      style: lgSwBand
    }) : null, it.swatch === "paper" ? React.createElement("span", {
      key: "s",
      style: lgSwPaper
    }) : null, React.createElement("span", {
      key: "t"
    }, it.text)]);
  }));
}
Object.assign(__ds_scope, { Legend });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/masthead/Legend.jsx", error: String((e && e.message) || e) }); }

// components/masthead/Masthead.jsx
try { (() => {
const mhWrap = {
  background: "var(--paper)",
  padding: "var(--pad-masthead)",
  borderBottom: "var(--border-masthead)"
};
const mhRow1 = {
  display: "flex",
  alignItems: "baseline",
  gap: "var(--sp-16)"
};
const mhBrand = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-26)",
  fontWeight: "var(--fw-bold)",
  letterSpacing: "var(--ls-mast)",
  color: "var(--ink)"
};
const mhBrandSub = {
  color: "var(--ink-2)",
  fontWeight: "var(--fw-regular)"
};
const mhUnit = {
  fontSize: "var(--fs-11)",
  letterSpacing: "var(--ls-unit)",
  textTransform: "uppercase",
  border: "1px solid var(--rule-field)",
  padding: "3px 8px",
  color: "var(--ink-mid-2)"
};
const mhMeta = {
  fontSize: "12.5px",
  color: "var(--ink-2)"
};
const mhRow2 = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-18)",
  marginTop: "var(--sp-9)",
  paddingTop: "var(--sp-9)",
  borderTop: "var(--border-hairline)",
  fontSize: "var(--fs-12)",
  color: "var(--ink-mid)"
};
const mhSep = {
  color: "#B7BCC1"
};
const mhNav = {
  display: "flex",
  gap: "var(--sp-12)",
  marginLeft: "auto"
};
const mhLink = {
  color: "var(--link)",
  textDecoration: "none",
  fontWeight: "var(--fw-semibold)"
};
const mhLinkActive = {
  color: "var(--ink)",
  textDecoration: "none",
  fontWeight: "var(--fw-bold)",
  borderBottom: "2px solid var(--ink)"
};
function Masthead({
  view,
  user,
  date,
  currency = "JPY",
  stats = [],
  nav = [],
  activeNav,
  onNavigate
}) {
  return React.createElement("div", {
    style: mhWrap,
    "data-screen-label": view
  }, [React.createElement("div", {
    key: "r1",
    style: mhRow1
  }, [React.createElement("div", {
    key: "b",
    style: mhBrand
  }, ["Why\u00A0Now", view ? React.createElement("span", {
    key: "v",
    style: mhBrandSub
  }, " · " + view) : null]), React.createElement("div", {
    key: "sp",
    style: {
      flex: 1
    }
  }), React.createElement("div", {
    key: "u",
    style: mhUnit
  }, "Đơn vị tiền: " + currency), React.createElement("div", {
    key: "m",
    style: mhMeta
  }, [user, user && date ? " · " : null, date])]), React.createElement("div", {
    key: "r2",
    style: mhRow2
  }, [stats.map(function (s, i) {
    return React.createElement("span", {
      key: "s" + i,
      style: {
        display: "inline-flex",
        gap: "var(--sp-8)"
      }
    }, [i > 0 ? React.createElement("span", {
      key: "sep",
      style: mhSep
    }, "│") : null, React.createElement("span", {
      key: "t"
    }, s)]);
  }), React.createElement("nav", {
    key: "n",
    style: mhNav
  }, nav.map(function (n) {
    const label = typeof n === "string" ? n : n.label;
    return React.createElement("a", {
      key: label,
      href: "#",
      style: label === activeNav ? mhLinkActive : mhLink,
      onClick: function (e) {
        e.preventDefault();
        if (onNavigate) onNavigate(label);
      }
    }, label);
  }))])]);
}
Object.assign(__ds_scope, { Masthead });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/masthead/Masthead.jsx", error: String((e && e.message) || e) }); }

// components/masthead/SectionKicker.jsx
try { (() => {
const skWrap = {
  display: "flex",
  alignItems: "baseline",
  gap: "var(--sp-10)",
  padding: "var(--pad-kicker)",
  background: "var(--surface-section)",
  borderBottom: "var(--border-hairline)"
};
const skTitle = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "11.5px",
  letterSpacing: "var(--ls-kicker)",
  textTransform: "uppercase",
  fontWeight: "var(--fw-black)",
  color: "var(--ink)"
};
const skMeta = {
  fontSize: "11.5px",
  color: "var(--ink-2)",
  fontVariantNumeric: "var(--num-tabular)"
};
function SectionKicker({
  title,
  meta,
  tone = "default"
}) {
  const t = Object.assign({}, skTitle, tone === "overdue" ? {
    color: "var(--overdue)"
  } : null);
  return React.createElement("div", {
    style: skWrap
  }, [React.createElement("h2", {
    key: "t",
    style: t
  }, title), meta ? React.createElement("div", {
    key: "m",
    style: skMeta
  }, meta) : null]);
}
Object.assign(__ds_scope, { SectionKicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/masthead/SectionKicker.jsx", error: String((e && e.message) || e) }); }

// components/reading/SnapshotHighlight.jsx
try { (() => {
const shWrap = {
  background: "var(--paper)",
  border: "var(--border-hairline)",
  padding: "16px 20px",
  fontFamily: "var(--font-sans)"
};
const shHead = {
  fontSize: "var(--fs-11)",
  letterSpacing: "var(--ls-box)",
  textTransform: "uppercase",
  fontWeight: "var(--fw-black)",
  color: "var(--ink-2)",
  marginBottom: "var(--sp-9)"
};
const shBody = {
  fontSize: "var(--fs-14-5)",
  lineHeight: "var(--lh-loose)",
  color: "var(--ink-body)"
};
const shMark = {
  background: "var(--cothe-bg)",
  borderBottom: "2px solid var(--rail)",
  padding: "1px 2px",
  fontWeight: "var(--fw-medium)",
  color: "var(--ink)"
};
const shJump = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-8)",
  marginBottom: "var(--sp-12)",
  padding: "6px 10px",
  background: "var(--cothe-bg)",
  borderLeft: "var(--rail-left)",
  fontSize: "11.5px",
  fontWeight: "var(--fw-bold)",
  color: "var(--cothe)"
};
function SnapshotHighlight({
  source,
  capturedAt,
  paragraphs = [],
  lang
}) {
  return React.createElement("div", {
    style: shWrap
  }, [React.createElement("div", {
    key: "h",
    style: shHead
  }, [source, capturedAt ? " · bản lưu " + capturedAt : null]), React.createElement("div", {
    key: "j",
    style: shJump
  }, "▮ Đoạn được đánh dấu — nền vàng, gạch chân ray"), React.createElement("div", {
    key: "b",
    style: shBody,
    lang
  }, paragraphs.map(function (p, i) {
    const text = typeof p === "string" ? p : p.text;
    const marked = typeof p === "object" && p.marked;
    return React.createElement("p", {
      key: i,
      style: {
        margin: "0 0 12px"
      }
    }, marked ? React.createElement("mark", {
      style: shMark
    }, text) : text);
  }))]);
}
Object.assign(__ds_scope, { SnapshotHighlight });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/reading/SnapshotHighlight.jsx", error: String((e && e.message) || e) }); }

// components/signals/ConfidenceBadge.jsx
try { (() => {
const cbBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--sp-5)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-10-5)",
  fontWeight: "var(--fw-black)",
  letterSpacing: "var(--ls-badge)",
  padding: "2px 7px",
  border: "1px solid",
  borderRadius: "var(--radius-0)",
  whiteSpace: "nowrap"
};
const cbLevels = {
  chac: {
    label: "Chắc",
    glyph: "●",
    paper: {
      color: "var(--chac)",
      background: "var(--chac-bg)",
      borderColor: "var(--chac-border)"
    },
    band: {
      color: "var(--chac-band)",
      background: "var(--chac-band-bg)",
      borderColor: "var(--chac-band-border)"
    }
  },
  cothe: {
    label: "Có thể",
    glyph: "◐",
    paper: {
      color: "var(--cothe)",
      background: "var(--cothe-bg)",
      borderColor: "var(--cothe-border)"
    },
    band: {
      color: "var(--cothe-band)",
      background: "var(--cothe-band-bg)",
      borderColor: "var(--cothe-band-border)"
    }
  },
  doan: {
    label: "Đoán",
    glyph: "○",
    paper: {
      color: "var(--doan)",
      background: "var(--doan-bg)",
      borderColor: "var(--doan-border)"
    },
    band: {
      color: "var(--doan-band)",
      background: "var(--doan-band-bg)",
      borderColor: "var(--doan-band-border)"
    }
  }
};
function ConfidenceBadge({
  level = "chac",
  onMachine = false
}) {
  const cfg = cbLevels[level] || cbLevels.chac;
  const s = Object.assign({}, cbBase, onMachine ? cfg.band : cfg.paper);
  return React.createElement("span", {
    style: s
  }, [React.createElement("span", {
    key: "g",
    style: {
      fontSize: "11.5px",
      lineHeight: 1
    }
  }, cfg.glyph), cfg.label]);
}
Object.assign(__ds_scope, { ConfidenceBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signals/ConfidenceBadge.jsx", error: String((e && e.message) || e) }); }

// components/data/QueueCallout.jsx
try { (() => {
const qcBox = {
  background: "var(--surface-queue)",
  border: "1px solid var(--suggestion-border)",
  padding: "var(--pad-qbox)",
  fontFamily: "var(--font-sans)"
};
const qcHead = {
  display: "flex",
  alignItems: "baseline",
  gap: "var(--sp-9)"
};
const qcNum = {
  fontSize: "var(--fs-30)",
  fontWeight: "var(--fw-black)",
  lineHeight: 1,
  color: "var(--suggestion)",
  fontVariantNumeric: "var(--num-tabular)"
};
const qcTitle = {
  fontSize: "var(--fs-13)",
  fontWeight: "var(--fw-bold)",
  color: "var(--suggestion-ink)"
};
const qcSub = {
  fontSize: "11.5px",
  color: "var(--suggestion-ink-2)",
  marginTop: "var(--sp-5)",
  lineHeight: "var(--lh-relaxed)"
};
const qcItem = {
  display: "flex",
  gap: "var(--sp-9)",
  alignItems: "center",
  padding: "var(--sp-8) 0",
  borderTop: "1px dotted var(--suggestion-rule)",
  fontSize: "var(--fs-12)",
  color: "var(--suggestion-ink-3)",
  lineHeight: "var(--lh-normal)"
};
function QueueCallout({
  count,
  subject,
  sub,
  items = [],
  actionLabel = "Mở Suggestion queue →",
  onOpen
}) {
  return React.createElement("div", {
    style: qcBox
  }, [React.createElement("div", {
    key: "h",
    style: qcHead
  }, [React.createElement("span", {
    key: "n",
    style: qcNum
  }, count), React.createElement("span", {
    key: "t",
    style: qcTitle
  }, subject)]), sub ? React.createElement("div", {
    key: "s",
    style: qcSub
  }, sub) : null, items.map(function (it, i) {
    return React.createElement("div", {
      key: "i" + i,
      style: qcItem
    }, [React.createElement("span", {
      key: "n",
      style: {
        flex: 1
      }
    }, it.text), it.confidence ? React.createElement(__ds_scope.ConfidenceBadge, {
      key: "c",
      level: it.confidence
    }) : null]);
  }), React.createElement(__ds_scope.Button, {
    key: "b",
    variant: "suggestion",
    size: "block",
    onClick: onOpen,
    style: {
      marginTop: "var(--sp-10)"
    }
  }, actionLabel)]);
}
Object.assign(__ds_scope, { QueueCallout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/QueueCallout.jsx", error: String((e && e.message) || e) }); }

// components/signals/SignalChip.jsx
try { (() => {
const scWrap = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--sp-6)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-11-5)",
  padding: "2px 7px",
  border: "1px solid var(--rule-stage)",
  background: "var(--paper-tint)",
  color: "var(--ink-mid)",
  cursor: "pointer",
  borderRadius: "var(--radius-0)"
};
const scBand = {
  border: "1px solid var(--band-rule)",
  background: "var(--band-2)",
  color: "var(--band-ink-2)"
};
const scKind = {
  fontWeight: "var(--fw-bold)",
  color: "var(--link)"
};
const scKindBand = {
  fontWeight: "var(--fw-bold)",
  color: "var(--rail)"
};
function SignalChip({
  kind,
  date,
  onMachine = false,
  onOpen
}) {
  const s = Object.assign({}, scWrap, onMachine ? scBand : null);
  return React.createElement("span", {
    style: s,
    role: "button",
    tabIndex: 0,
    onClick: onOpen,
    title: "Mở đúng đoạn nguồn có đánh dấu"
  }, [React.createElement("span", {
    key: "k",
    style: onMachine ? scKindBand : scKind
  }, kind), date ? React.createElement("span", {
    key: "d",
    style: {
      fontVariantNumeric: "var(--num-tabular)"
    }
  }, "· " + date) : null]);
}
Object.assign(__ds_scope, { SignalChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signals/SignalChip.jsx", error: String((e && e.message) || e) }); }

// components/signals/SourceByline.jsx
try { (() => {
const sbBase = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-8)",
  marginTop: "var(--sp-8)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-11)",
  letterSpacing: "var(--ls-label-wide)",
  textTransform: "uppercase",
  fontWeight: "var(--fw-black)"
};
function SourceByline({
  source = "machine",
  detail
}) {
  const isMachine = source === "machine";
  const s = Object.assign({}, sbBase, {
    color: isMachine ? "var(--rail)" : "var(--ink-3)"
  });
  return React.createElement("div", {
    style: s
  }, [React.createElement("span", {
    key: "g",
    style: {
      fontSize: "13px",
      letterSpacing: 0
    }
  }, isMachine ? "⚙" : "✎"), isMachine ? "Next step do hệ thống đặt" : "Next step do bạn gõ", detail ? React.createElement("span", {
    key: "d",
    style: {
      fontWeight: "var(--fw-regular)",
      letterSpacing: 0,
      textTransform: "none"
    }
  }, "— " + detail) : null]);
}
Object.assign(__ds_scope, { SourceByline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signals/SourceByline.jsx", error: String((e && e.message) || e) }); }

// components/signals/SuggestionPin.jsx
try { (() => {
const spPaper = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  background: "var(--suggestion-bg)",
  border: "1px solid var(--suggestion-border)",
  color: "var(--suggestion)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-10)",
  fontWeight: "var(--fw-black)",
  padding: "1px 5px",
  marginLeft: "var(--sp-6)",
  verticalAlign: "1px",
  cursor: "pointer"
};
const spBand = {
  background: "var(--cothe-band-bg)",
  borderColor: "var(--cothe-band-border)",
  color: "var(--cothe-band)"
};
function SuggestionPin({
  count = 1,
  onMachine = false,
  onClick
}) {
  const s = Object.assign({}, spPaper, onMachine ? spBand : null);
  return React.createElement("span", {
    style: s,
    onClick,
    role: "button",
    tabIndex: 0
  }, "◆ " + count + " Suggestion");
}
Object.assign(__ds_scope, { SuggestionPin });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signals/SuggestionPin.jsx", error: String((e && e.message) || e) }); }

// components/signals/WarningFlag.jsx
try { (() => {
const wfBase = {
  display: "inline-flex",
  alignItems: "flex-start",
  gap: "var(--sp-6)",
  marginTop: "var(--sp-8)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-11-5)",
  fontWeight: "var(--fw-black)",
  padding: "2px 8px",
  border: "1px solid",
  borderRadius: "var(--radius-0)",
  lineHeight: "var(--lh-normal)"
};
const wfTones = {
  warn: {
    color: "var(--warn)",
    background: "var(--warn-bg)",
    borderColor: "var(--warn-border)"
  },
  stale: {
    color: "var(--doan)",
    background: "var(--doan-bg)",
    borderColor: "var(--doan-border)"
  },
  quiet: {
    color: "var(--ink-3)",
    background: "var(--paper-tint)",
    borderColor: "var(--rule)"
  }
};
function WarningFlag({
  tone = "warn",
  glyph = "▲",
  children
}) {
  const s = Object.assign({}, wfBase, wfTones[tone] || wfTones.warn);
  return React.createElement("span", {
    style: s
  }, [React.createElement("span", {
    key: "g"
  }, glyph), children]);
}
Object.assign(__ds_scope, { WarningFlag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signals/WarningFlag.jsx", error: String((e && e.message) || e) }); }

// components/suggestions/DismissReasonPicker.jsx
try { (() => {
const drWrap = {
  background: "var(--paper-tint)",
  border: "var(--border-hairline)",
  borderTop: "3px solid var(--warn)",
  padding: "11px 14px",
  fontFamily: "var(--font-sans)"
};
const drTitle = {
  fontSize: "var(--fs-11)",
  letterSpacing: "var(--ls-label)",
  textTransform: "uppercase",
  fontWeight: "var(--fw-black)",
  color: "var(--warn)",
  marginBottom: "var(--sp-8)"
};
const drList = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--sp-6)"
};
const drItem = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12)",
  padding: "5px 10px",
  background: "var(--paper)",
  border: "1px solid var(--rule-field)",
  color: "var(--ink)",
  cursor: "pointer",
  borderRadius: "var(--radius-0)"
};
const DISMISS_REASONS = ["Thông tin sai", "Không liên quan tới account này", "Đã biết rồi", "Nguồn không tin được", "Có gợi ý mới hơn"];
function DismissReasonPicker({
  reasons = DISMISS_REASONS,
  onPick
}) {
  return React.createElement("div", {
    style: drWrap
  }, [React.createElement("div", {
    key: "t",
    style: drTitle
  }, "Bỏ vì sao? — một bấm là xong"), React.createElement("div", {
    key: "l",
    style: drList
  }, reasons.map(function (r) {
    return React.createElement("button", {
      key: r,
      type: "button",
      style: drItem,
      onClick: function () {
        if (onPick) onPick(r);
      }
    }, r);
  }))]);
}
Object.assign(__ds_scope, { DISMISS_REASONS, DismissReasonPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/suggestions/DismissReasonPicker.jsx", error: String((e && e.message) || e) }); }

// components/worklist/QuoteBlock.jsx
try { (() => {
const qbBand = {
  marginTop: "var(--sp-9)",
  padding: "var(--pad-quote)",
  background: "var(--band-2)",
  borderLeft: "var(--bw-quote) solid var(--band-quote-rail)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12-5)",
  lineHeight: "var(--lh-relaxed)",
  color: "var(--band-quote-ink)",
  cursor: "pointer"
};
const qbPaper = {
  marginTop: "var(--sp-9)",
  padding: "var(--pad-quote)",
  background: "var(--paper-tint)",
  borderLeft: "var(--bw-quote) solid var(--rule-strong)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-12-5)",
  lineHeight: "var(--lh-relaxed)",
  color: "var(--ink-body)",
  cursor: "pointer"
};
const qbSrcBand = {
  display: "block",
  fontSize: "var(--fs-11)",
  color: "var(--band-quote-src)",
  marginTop: "var(--sp-3)"
};
const qbSrcPaper = {
  display: "block",
  fontSize: "var(--fs-11)",
  color: "var(--ink-3)",
  marginTop: "var(--sp-3)"
};
function QuoteBlock({
  quote,
  lang,
  source,
  onMachine = false,
  onOpen
}) {
  return React.createElement("div", {
    style: onMachine ? qbBand : qbPaper,
    onClick: onOpen,
    role: "button",
    tabIndex: 0
  }, [React.createElement("span", {
    key: "q",
    lang
  }, quote), source ? React.createElement("span", {
    key: "s",
    style: onMachine ? qbSrcBand : qbSrcPaper
  }, source) : null]);
}
Object.assign(__ds_scope, { QuoteBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/worklist/QuoteBlock.jsx", error: String((e && e.message) || e) }); }

// components/suggestions/SuggestionCard.jsx
try { (() => {
const suCard = {
  background: "var(--paper)",
  border: "var(--border-hairline)",
  borderLeft: "3px solid var(--suggestion-border)",
  padding: "13px 15px",
  fontFamily: "var(--font-sans)"
};
const suHead = {
  display: "flex",
  alignItems: "baseline",
  gap: "var(--sp-9)"
};
const suAcc = {
  fontSize: "var(--fs-13)",
  fontWeight: "var(--fw-bold)",
  color: "var(--ink)"
};
const suField = {
  fontSize: "var(--fs-11)",
  letterSpacing: "var(--ls-label)",
  textTransform: "uppercase",
  fontWeight: "var(--fw-black)",
  color: "var(--ink-3)",
  marginLeft: "auto"
};
const suDiff = {
  display: "grid",
  gridTemplateColumns: "1fr 18px 1fr",
  alignItems: "center",
  gap: "var(--sp-10)",
  marginTop: "var(--sp-10)",
  padding: "var(--sp-9) 0",
  borderTop: "var(--border-dotted)",
  borderBottom: "var(--border-dotted)"
};
const suSideLabel = {
  fontSize: "var(--fs-10-5)",
  letterSpacing: "var(--ls-label)",
  textTransform: "uppercase",
  fontWeight: "var(--fw-black)",
  color: "var(--ink-3)",
  marginBottom: "var(--sp-3)"
};
const suNow = {
  fontSize: "var(--fs-13)",
  color: "var(--ink-2)"
};
const suNext = {
  fontSize: "var(--fs-13)",
  fontWeight: "var(--fw-bold)",
  color: "var(--ink)"
};
const suArrow = {
  textAlign: "center",
  color: "var(--suggestion)",
  fontSize: "var(--fs-13)",
  fontWeight: "var(--fw-bold)"
};
const suRisk = {
  marginTop: "var(--sp-9)",
  fontSize: "11.5px",
  lineHeight: "var(--lh-normal)",
  color: "var(--suggestion-ink-2)",
  background: "var(--suggestion-bg)",
  border: "1px solid var(--suggestion-border)",
  padding: "6px 9px"
};
const suStale = {
  marginTop: "var(--sp-9)",
  fontSize: "11.5px",
  fontWeight: "var(--fw-black)",
  color: "var(--warn)",
  background: "var(--warn-bg)",
  border: "1px solid var(--warn-border)",
  padding: "2px 8px",
  display: "inline-block"
};
const suActions = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-8)",
  marginTop: "var(--sp-12)"
};
function SuggestionCard({
  account,
  field,
  current,
  proposed,
  confidence = "cothe",
  quote,
  quoteLang,
  quoteSource,
  risk,
  staleProfile = false,
  onApprove,
  onEditApprove,
  onDismiss,
  onOpenSource
}) {
  return React.createElement("div", {
    style: suCard
  }, [React.createElement("div", {
    key: "h",
    style: suHead
  }, [React.createElement("span", {
    key: "a",
    style: suAcc
  }, account), React.createElement(__ds_scope.ConfidenceBadge, {
    key: "c",
    level: confidence
  }), field ? React.createElement("span", {
    key: "f",
    style: suField
  }, field) : null]), React.createElement("div", {
    key: "d",
    style: suDiff
  }, [React.createElement("div", {
    key: "now"
  }, [React.createElement("div", {
    key: "l",
    style: suSideLabel
  }, "Hiện tại"), React.createElement("div", {
    key: "v",
    style: suNow
  }, current || "— còn trống")]), React.createElement("div", {
    key: "ar",
    style: suArrow
  }, "→"), React.createElement("div", {
    key: "nx"
  }, [React.createElement("div", {
    key: "l",
    style: suSideLabel
  }, "Đề nghị"), React.createElement("div", {
    key: "v",
    style: suNext
  }, proposed)])]), quote ? React.createElement(__ds_scope.QuoteBlock, {
    key: "q",
    quote,
    lang: quoteLang,
    source: quoteSource,
    onOpen: onOpenSource
  }) : null, staleProfile ? React.createElement("div", {
    key: "s",
    style: suStale
  }, "▲ Hồ sơ đã đổi sau khi gợi ý này sinh ra") : null, risk ? React.createElement("div", {
    key: "r",
    style: suRisk
  }, ["Nếu tin này sai: ", risk]) : null, React.createElement("div", {
    key: "ac",
    style: suActions
  }, [React.createElement(__ds_scope.Button, {
    key: "ap",
    variant: "primary",
    onClick: onApprove
  }, "Duyệt"), React.createElement(__ds_scope.Button, {
    key: "ed",
    variant: "secondary",
    onClick: onEditApprove
  }, "Sửa rồi duyệt"), React.createElement(__ds_scope.Button, {
    key: "dm",
    variant: "danger",
    onClick: onDismiss
  }, "Bỏ")])]);
}
Object.assign(__ds_scope, { SuggestionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/suggestions/SuggestionCard.jsx", error: String((e && e.message) || e) }); }

// components/worklist/StagePill.jsx
try { (() => {
const stPaper = {
  display: "inline-block",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-11)",
  color: "var(--ink-mid-2)",
  border: "1px solid var(--rule-stage)",
  padding: "1px 7px",
  background: "var(--paper-tint)",
  borderRadius: "var(--radius-0)",
  whiteSpace: "nowrap"
};
const stBand = {
  color: "var(--band-ink-2)",
  borderColor: "var(--band-rule)",
  background: "var(--band-2)"
};
function StagePill({
  stage,
  onMachine = false
}) {
  return React.createElement("span", {
    style: Object.assign({}, stPaper, onMachine ? stBand : null)
  }, stage);
}
Object.assign(__ds_scope, { StagePill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/worklist/StagePill.jsx", error: String((e && e.message) || e) }); }

// components/worklist/UndoButton.jsx
try { (() => {
const ubBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--sp-6)",
  marginTop: "var(--sp-9)",
  fontFamily: "var(--font-sans)",
  fontSize: "11.5px",
  fontWeight: "var(--fw-semibold)",
  color: "var(--rail-ink)",
  background: "var(--rail)",
  padding: "3px 10px",
  border: "none",
  borderRadius: "var(--radius-0)",
  cursor: "pointer"
};
const ubSoon = {
  background: "var(--band-od)",
  color: "var(--undo-soon-ink)"
};
function UndoButton({
  remaining,
  soon = false,
  note,
  onUndo
}) {
  const s = Object.assign({}, ubBase, soon ? ubSoon : null);
  return React.createElement("button", {
    type: "button",
    style: s,
    onClick: onUndo
  }, ["↩ Hoàn tác — ", soon ? "chỉ còn " : "còn ", React.createElement("b", {
    key: "r",
    style: {
      fontVariantNumeric: "var(--num-tabular)"
    }
  }, remaining), note ? ", " + note : null]);
}
Object.assign(__ds_scope, { UndoButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/worklist/UndoButton.jsx", error: String((e && e.message) || e) }); }

// components/worklist/WorkItem.jsx
try { (() => {
const wiGrid = {
  display: "grid",
  gridTemplateColumns: "var(--col-when) 1fr var(--col-side)",
  gap: "var(--gap-row)",
  padding: "var(--pad-row)",
  borderBottom: "var(--border-hairline)",
  background: "var(--paper)",
  fontFamily: "var(--font-sans)"
};
const wiMachine = {
  background: "var(--band)",
  borderBottom: "1px solid var(--band-edge)",
  borderLeft: "var(--rail-left)",
  paddingLeft: "var(--pad-row-machine-left)"
};
const wiWarn = {
  background: "var(--surface-warn-row)"
};
const wiWhen = {
  fontSize: "var(--fs-11)",
  fontWeight: "var(--fw-black)",
  letterSpacing: "var(--ls-label)",
  textTransform: "uppercase",
  color: "var(--ink-mid-2)",
  paddingTop: "var(--sp-3)"
};
const wiWhenDetail = {
  display: "block",
  fontWeight: "var(--fw-regular)",
  letterSpacing: 0,
  textTransform: "none",
  fontSize: "var(--fs-12)",
  color: "var(--ink-3)",
  marginTop: "var(--sp-2)",
  fontVariantNumeric: "var(--num-tabular)"
};
const wiAcc = {
  fontSize: "var(--fs-13)",
  fontWeight: "var(--fw-bold)",
  color: "var(--ink)"
};
const wiAccMeta = {
  fontWeight: "var(--fw-regular)",
  color: "var(--ink-2)",
  fontSize: "var(--fs-12)",
  marginLeft: "var(--sp-6)"
};
const wiOpp = {
  fontSize: "var(--fs-12)",
  color: "var(--ink-2)",
  marginTop: "var(--sp-1)"
};
const wiHeadline = {
  fontFamily: "var(--font-serif)",
  marginTop: "var(--sp-7)",
  fontSize: "var(--fs-17)",
  lineHeight: "var(--lh-snug)",
  color: "var(--ink-strong)"
};
const wiHeadlineMachine = {
  fontSize: "var(--fs-19)",
  fontWeight: "var(--fw-medium)",
  letterSpacing: "var(--ls-headline)",
  color: "var(--band-ink-strong)"
};
const wiSide = {
  textAlign: "right",
  paddingTop: "var(--sp-3)"
};
const wiMoney = {
  fontSize: "var(--fs-13)",
  fontVariantNumeric: "var(--num-tabular)",
  fontWeight: "var(--fw-semibold)",
  color: "var(--ink)"
};
const wiSigMeta = {
  fontSize: "11.5px",
  color: "var(--ink-3)",
  marginTop: "var(--sp-6)",
  lineHeight: "var(--lh-normal)",
  textWrap: "pretty"
};
function WorkItem({
  source = "human",
  when,
  whenDetail,
  overdue = false,
  flagged = false,
  account,
  accountMeta,
  accountAdornment,
  opportunity,
  stage,
  headline,
  bylineDetail,
  money,
  confidence,
  signalMeta,
  children
}) {
  const onMachine = source === "machine";
  const rowStyle = Object.assign({}, wiGrid, flagged && !onMachine ? wiWarn : null, onMachine ? wiMachine : null);
  const whenStyle = Object.assign({}, wiWhen, onMachine ? {
    color: "var(--band-ink-3)"
  } : null, overdue ? {
    color: onMachine ? "var(--band-od)" : "var(--overdue)"
  } : null);
  const whenDetailStyle = Object.assign({}, wiWhenDetail, onMachine ? {
    color: "var(--band-ink-2)"
  } : null);
  const headlineStyle = Object.assign({}, wiHeadline, onMachine ? wiHeadlineMachine : null);
  return React.createElement("div", {
    style: rowStyle
  }, [React.createElement("div", {
    key: "w",
    style: whenStyle
  }, [when, whenDetail ? React.createElement("span", {
    key: "d",
    style: whenDetailStyle
  }, whenDetail) : null]), React.createElement("div", {
    key: "m"
  }, [React.createElement("div", {
    key: "a",
    style: Object.assign({}, wiAcc, onMachine ? {
      color: "var(--band-ink)"
    } : null)
  }, [React.createElement("span", {
    key: "an"
  }, account), accountMeta ? React.createElement("span", {
    key: "am",
    style: Object.assign({}, wiAccMeta, onMachine ? {
      color: "var(--band-ink-2)"
    } : null)
  }, accountMeta) : null, accountAdornment ? React.createElement("span", {
    key: "ad"
  }, accountAdornment) : null]), opportunity ? React.createElement("div", {
    key: "o",
    style: Object.assign({}, wiOpp, onMachine ? {
      color: "var(--band-ink-2)"
    } : null)
  }, opportunity) : null, headline ? React.createElement("div", {
    key: "h",
    style: headlineStyle
  }, headline) : null, children, React.createElement(__ds_scope.SourceByline, {
    key: "b",
    source,
    detail: bylineDetail
  })]), React.createElement("div", {
    key: "s",
    style: wiSide
  }, [money ? React.createElement("div", {
    key: "$",
    style: Object.assign({}, wiMoney, onMachine ? {
      color: "var(--band-ink)"
    } : null)
  }, money) : null, stage ? React.createElement("div", {
    key: "st",
    style: {
      marginTop: "var(--sp-5)"
    }
  }, React.createElement(__ds_scope.StagePill, {
    stage,
    onMachine
  })) : null, confidence ? React.createElement("div", {
    key: "c",
    style: {
      marginTop: "var(--sp-7)"
    }
  }, React.createElement(__ds_scope.ConfidenceBadge, {
    level: confidence,
    onMachine
  })) : null, signalMeta ? React.createElement("div", {
    key: "sm",
    style: Object.assign({}, wiSigMeta, onMachine ? {
      color: "var(--band-ink-2)"
    } : null)
  }, signalMeta) : null])]);
}
Object.assign(__ds_scope, { WorkItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/worklist/WorkItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/why-now/kit-account.jsx
try { (() => {
const DSA = window.WhyNowDesignSystem_dd23e3;
function AccountScreen({
  state,
  onOpenSnapshot,
  onGoQueue
}) {
  const {
    SectionKicker,
    StatBox,
    StatRow,
    TimelineEntry,
    SignalChip,
    WarningFlag,
    SuggestionPin,
    PartialError,
    StagePill,
    ConfidenceBadge,
    Button
  } = DSA;
  const boxHead = {
    fontSize: "var(--fs-11)",
    letterSpacing: "var(--ls-box)",
    textTransform: "uppercase",
    fontWeight: "var(--fw-black)",
    color: "var(--ink-2)",
    marginBottom: "9px"
  };
  const field = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "5px 0",
    borderBottom: "1px dotted var(--rule-dotted)",
    fontSize: "var(--fs-12-5)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      overflow: "auto",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SectionKicker, {
    title: "Account \xB7 S\u014Dk\u014D Logistics Co., Ltd.",
    meta: "\u5009\u5EAB\u30ED\u30B8\u30B9\u30C6\u30A3\u30AF\u30B9\u682A\u5F0F\u4F1A\u793E \xB7 T\u014Dky\u014D \xB7 2 Suggestion \u0111ang ch\u1EDD"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "18px",
      padding: "16px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: boxHead
  }, "H\u1ED3 s\u01A1 Account ", /*#__PURE__*/React.createElement(SuggestionPin, {
    count: 2,
    onClick: onGoQueue
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--rule)",
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: field
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-2)"
    }
  }, "Primary contact"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-3)"
    }
  }, "\u2014 c\xF2n tr\u1ED1ng")), /*#__PURE__*/React.createElement("div", {
    style: field
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-2)"
    }
  }, "Ng\xE0nh"), /*#__PURE__*/React.createElement("span", null, "Logistics")), /*#__PURE__*/React.createElement("div", {
    style: field
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-2)"
    }
  }, "Quy m\xF4 nh\xE2n s\u1EF1"), /*#__PURE__*/React.createElement("span", null, "1.200 ng\u01B0\u1EDDi")), /*#__PURE__*/React.createElement("div", {
    style: field
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-2)"
    }
  }, "Tr\u1EE5 s\u1EDF"), /*#__PURE__*/React.createElement("span", null, "T\u014Dky\u014D, K\u014Dt\u014D-ku")), /*#__PURE__*/React.createElement("div", {
    style: Object.assign({}, field, {
      borderBottom: "none"
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-2)"
    }
  }, "C\u1EADp nh\u1EADt l\u1EA7n cu\u1ED1i"), /*#__PURE__*/React.createElement("span", null, "04/07/2026")), /*#__PURE__*/React.createElement(WarningFlag, {
    tone: "stale"
  }, "H\u1ED3 s\u01A1 kh\xF4ng \u0111\u1ED5i 41 ng\xE0y \u2014 qu\xE1 ng\u01B0\u1EE1ng 30 ng\xE0y, kh\xF4ng mang \u0111i h\u1ECDp \u0111\u01B0\u1EE3c")), /*#__PURE__*/React.createElement("div", {
    style: Object.assign({}, boxHead, {
      marginTop: "18px"
    })
  }, "Opportunity \u2014 1 \u0111ang m\u1EDF"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--rule)",
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-13)",
      fontWeight: "var(--fw-bold)"
    }
  }, "N\xE2ng c\u1EA5p WMS"), /*#__PURE__*/React.createElement(StagePill, {
    stage: "So\u1EA1n \u0111\u1EC1 xu\u1EA5t"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-12)",
      color: "var(--ink-2)",
      marginTop: "6px",
      fontVariantNumeric: "tabular-nums"
    }
  }, "32.000.000 JPY \xB7 h\u1EA1n 12/08 \u2014 qu\xE1 2 ng\xE0y"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-12-5)",
      marginTop: "8px",
      fontFamily: "var(--font-serif)"
    }
  }, "\u270E G\u1EEDi b\u1EA3n \u0111\u1EC1 xu\u1EA5t s\u1EEDa l\u1EA7n 2 cho \xF4ng Tanaka"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: boxHead
  }, "Reading area \u2014 v\xF9ng \u0111\u1ECDc, kh\xF4ng ph\u1EA3i h\u1ED3 s\u01A1 v\xE0 kh\xF4ng ph\u1EA3i Timeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--rule)",
      borderLeft: "4px solid var(--band-quote-rail)",
      padding: "12px 14px",
      background: "var(--paper-tint)"
    }
  }, state === "error" ? /*#__PURE__*/React.createElement(PartialError, {
    title: "Kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c ngu\u1ED3n c\u1EE7a S\u014Dk\u014D Logistics",
    detail: "Trang ngu\u1ED3n tr\u1EA3 v\u1EC1 l\u1ED7i t\u1EEB 12/08. N\u1ED9i dung d\u01B0\u1EDBi \u0111\xE2y l\xE0 b\u1EA3n l\u01B0u 10/08, kh\xF4ng ph\u1EA3i b\u1EA3n m\u1EDBi nh\u1EA5t.",
    onRetry: function () {}
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-12)",
      color: "var(--ink-2)",
      marginBottom: "9px"
    }
  }, "B\u1EA3n l\u01B0u g\u1EA7n nh\u1EA5t 10/08 11:03 \xB7 soko-logistics.co.jp / \u304A\u77E5\u3089\u305B"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px",
      flexWrap: "wrap",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement(SignalChip, {
    kind: "Nh\xE2n s\u1EF1",
    date: "10/08",
    onOpen: function () {
      onOpenSnapshot("soko");
    }
  }), /*#__PURE__*/React.createElement(SignalChip, {
    kind: "M\u1EDF r\u1ED9ng",
    date: "10/08",
    onOpen: function () {
      onOpenSnapshot("soko");
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-12-5)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--ink-body)"
    },
    lang: "ja"
  }, "\u300C\u30B7\u30B9\u30C6\u30E0\u90E8\u9577 \u7530\u4E2D \u5B8F \u304C\u672C\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u7A93\u53E3\u3092\u62C5\u5F53\u3044\u305F\u3057\u307E\u3059\u300D\u2026 \u300C\u81EA\u52D5\u5009\u5EAB\u30B7\u30B9\u30C6\u30E0\u306E\u5C0E\u5165\u3092\u5168\u62E0\u70B9\u306B\u62E1\u5927\u3059\u308B\u300D"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-11)",
      color: "var(--ink-3)",
      marginTop: "8px"
    }
  }, "B\u1EA5m m\u1ED9t Signal \u0111\u1EC3 m\u1EDF \u0111\xFAng \u0111o\u1EA1n c\xF3 \u0111\xE1nh d\u1EA5u trong b\u1EA3n l\u01B0u.")), /*#__PURE__*/React.createElement("div", {
    style: Object.assign({}, boxHead, {
      marginTop: "18px"
    })
  }, "Timeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--rule)",
      padding: "4px 14px 12px"
    }
  }, /*#__PURE__*/React.createElement(TimelineEntry, {
    when: "10/08 11:03",
    bySystem: true
  }, "Signal m\u1EDBi: Nh\xE2n s\u1EF1 \u2014 \u7530\u4E2D \u5B8F l\xE0m \u0111\u1EA7u m\u1ED1i d\u1EF1 \xE1n"), /*#__PURE__*/React.createElement(TimelineEntry, {
    when: "08/08 14:22",
    author: "Linh Tr\u1EA7n"
  }, "G\u1EEDi b\u1EA3n \u0111\u1EC1 xu\u1EA5t l\u1EA7n 1, \xF4ng Tanaka xin s\u1EEDa ph\u1EA1m vi"), /*#__PURE__*/React.createElement(TimelineEntry, {
    when: "04/07 10:10",
    author: "Linh Tr\u1EA7n",
    last: true
  }, "G\u1ECDi l\u1EA7n \u0111\u1EA7u, x\xE1c nh\u1EADn nhu c\u1EA7u n\xE2ng c\u1EA5p WMS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-11)",
      color: "var(--ink-3)",
      marginTop: "8px",
      lineHeight: 1.5
    }
  }, "H\u1EC7 th\u1ED1ng ch\u1EC9 th\xEAm m\u1EE5c m\u1EDBi, kh\xF4ng s\u1EEDa m\u1EE5c do b\u1EA1n t\u1EA1o.")))));
}
Object.assign(window, {
  AccountScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/why-now/kit-account.jsx", error: String((e && e.message) || e) }); }

// ui_kits/why-now/kit-admin.jsx
try { (() => {
const DSAd = window.WhyNowDesignSystem_dd23e3;
function AdminScreen({
  state,
  aiOff,
  onBrake,
  onResume,
  decidedCount
}) {
  const {
    SectionKicker,
    Metric,
    StatBox,
    StatRow,
    PartialError,
    Button,
    TextField,
    WarningFlag,
    ConfidenceBadge
  } = DSAd;
  const boxHead = {
    fontSize: "var(--fs-11)",
    letterSpacing: "var(--ls-box)",
    textTransform: "uppercase",
    fontWeight: "var(--fw-black)",
    color: "var(--ink-2)",
    marginBottom: "9px"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      overflow: "auto",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SectionKicker, {
    title: "Admin dashboard \u2014 s\u1EE9c kho\u1EBB ph\u1EA7n AI",
    meta: "H\xE0 Nguy\u1EC5n \xB7 Qu\u1EA3n tr\u1ECB ch\u1EA5t l\u01B0\u1EE3ng d\u1EEF li\u1EC7u \xB7 7 ng\xE0y g\u1EA7n nh\u1EA5t"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      display: "grid",
      gap: "18px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: boxHead
  }, "Hai s\u1ED1 \u0111o ph\u1EA3i \u0111\u1ECDc c\u1EA1nh nhau"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "T\u1EC9 l\u1EC7 duy\u1EC7t",
    value: "96%",
    compare: "141/147 l\u01B0\u1EE3t quy\u1EBFt trong 7 ng\xE0y"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Th\u1EDDi gian quy\u1EBFt trung b\xECnh",
    value: "1,8 s",
    tone: "warn",
    compare: "\u0110\u1EB7t c\u1EA1nh t\u1EC9 l\u1EC7 duy\u1EC7t 96% \u2014 con s\u1ED1 \u0111\u1EB9p \u1EDF nh\u1ECBp n\xE0y \u0111\u1ECDc th\xE0nh duy\u1EC7t m\xF9, kh\xF4ng ph\u1EA3i m\xE1y gi\u1ECFi"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "12px",
      background: "var(--warn-bg)",
      border: "1px solid var(--warn-border)",
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-13)",
      fontWeight: "var(--fw-black)",
      color: "var(--warn)"
    }
  }, "\u25B2 3 g\u1EE3i \xFD c\u1EA7n r\xE0 l\u1EA1i"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-12)",
      color: "var(--ink-body)",
      marginTop: "6px",
      lineHeight: 1.55
    }
  }, "Ba l\u01B0\u1EE3t duy\u1EC7t d\u01B0\u1EDBi 0,9 gi\xE2y tr\xEAn c\xF9ng m\u1ED9t Account, trong \u0111\xF3 m\u1ED9t l\u01B0\u1EE3t duy\u1EC7t g\u1EE3i \xFD m\u1EE9c \u0110o\xE1n. H\u1EA1 chu k\u1EF3 qu\xE9t ho\u1EB7c b\u1EA5m phanh n\u1EBFu c\u1EA7n."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "12px",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(StatBox, {
    title: "Signal \u0111\xE3 sinh",
    sub: "7 ng\xE0y \xB7 ph\xE2n b\u1ED1 theo M\u1EE9c ch\u1EAFc ch\u1EAFn"
  }, /*#__PURE__*/React.createElement(StatRow, {
    name: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        gap: "6px"
      }
    }, /*#__PURE__*/React.createElement(ConfidenceBadge, {
      level: "chac"
    })),
    count: 41,
    value: "52%"
  }), /*#__PURE__*/React.createElement(StatRow, {
    name: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        gap: "6px"
      }
    }, /*#__PURE__*/React.createElement(ConfidenceBadge, {
      level: "cothe"
    })),
    count: 26,
    value: "33%"
  }), /*#__PURE__*/React.createElement(StatRow, {
    name: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        gap: "6px"
      }
    }, /*#__PURE__*/React.createElement(ConfidenceBadge, {
      level: "doan"
    })),
    count: 12,
    value: "15%",
    last: true
  })), /*#__PURE__*/React.createElement(StatBox, {
    title: "Suggestion \u2014 k\u1EBFt c\u1EE5c",
    sub: "147 l\u01B0\u1EE3t quy\u1EBFt trong 7 ng\xE0y",
    note: "3 l\u01B0\u1EE3t \u0111\xF3ng v\xEC c\xF3 g\u1EE3i \xFD m\u1EDBi h\u01A1n \u2014 kh\xF4ng t\xEDnh v\xE0o t\u1EC9 l\u1EC7 duy\u1EC7t."
  }, /*#__PURE__*/React.createElement(StatRow, {
    name: "Duy\u1EC7t",
    count: 141,
    value: "96%"
  }), /*#__PURE__*/React.createElement(StatRow, {
    name: "S\u1EEDa r\u1ED3i duy\u1EC7t",
    count: 4,
    value: "3%"
  }), /*#__PURE__*/React.createElement(StatRow, {
    name: "B\u1ECF",
    count: 2,
    value: "1%",
    last: true
  })), /*#__PURE__*/React.createElement(StatBox, {
    title: "L\xFD do b\u1ECF",
    sub: "2 l\u01B0\u1EE3t \u2014 m\u1EABu c\xF2n nh\u1ECF",
    note: "T\u1EC9 l\u1EC7 ph\xE1t hi\u1EC7n l\u1ED7i c\u1EA7n \xEDt nh\u1EA5t 30 l\u01B0\u1EE3t b\u1ECF \u0111\u1EC3 c\xF3 ngh\u0129a."
  }, /*#__PURE__*/React.createElement(StatRow, {
    name: "Th\xF4ng tin sai",
    count: 1
  }), /*#__PURE__*/React.createElement(StatRow, {
    name: "Kh\xF4ng li\xEAn quan t\u1EDBi account",
    count: 1,
    last: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: boxHead
  }, "M\xE1y t\u1EF1 \u0111\u1EB7t Next step"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "S\u1ED1 l\u1EA7n t\u1EF1 \u0111\u1EB7t",
    value: "38",
    compare: "38/112 Next step \u0111ang c\xF3 trong h\u1EC7 th\u1ED1ng"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "T\u1EC9 l\u1EC7 b\u1ECB ho\xE0n t\xE1c",
    insufficient: true,
    insufficientNote: "C\u1EA7n \xEDt nh\u1EA5t 30 l\u01B0\u1EE3t ho\xE0n t\xE1c \u0111\u1EC3 t\xEDnh \u2014 hi\u1EC7n c\xF3 4."
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: boxHead
  }, "Tham s\u1ED1 v\xE0 phanh"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--rule)",
      padding: "12px 14px",
      display: "grid",
      gap: "11px"
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Chu k\u1EF3 qu\xE9t (gi\xE2y)",
    value: "60",
    onChange: function () {},
    hint: "\u0110\u1ED5i l\xFAc m\u1ED9t v\xF2ng \u0111ang ch\u1EA1y: v\xF2ng \u0111\xF3 gi\u1EEF nh\u1ECBp c\u0169, nh\u1ECBp m\u1EDBi c\xF3 hi\u1EC7u l\u1EF1c t\u1EEB v\xF2ng k\u1EBF."
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Ng\u01B0\u1EE1ng Signal ch\u01B0a ph\xE2n lo\u1EA1i (%)",
    value: "20",
    onChange: function () {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--rule)",
      paddingTop: "11px"
    }
  }, aiOff ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onResume
  }, "B\u1EADt l\u1EA1i ph\u1EA7n AI"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-11-5)",
      color: "var(--ink-2)",
      marginTop: "8px",
      lineHeight: 1.5
    }
  }, "\u0110\xE3 t\u1EAFt l\xFAc 09:52. V\xF2ng qu\xE9t \u0111ang ch\u1EA1y b\u1ECB c\u1EAFt t\u1EA1i ranh gi\u1EDBi Account v\xE0 \u0111\xE3 ghi m\u1ED9t d\xF2ng Nh\u1EADt k\xFD k\xE8m l\xFD do ", /*#__PURE__*/React.createElement("i", null, "c\u1EAFt do phanh"), ".")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    onClick: onBrake
  }, "T\u1EAFt to\xE0n b\u1ED9 ph\u1EA7n AI"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-11-5)",
      color: "var(--ink-2)",
      marginTop: "8px",
      lineHeight: 1.5
    }
  }, "T\u1EAFt ngay l\u1EADp t\u1EE9c. \xD4 do m\xE1y \u0111\u1EB7t gi\u1EEF nguy\xEAn, g\u1EE3i \xFD \u0111ang ch\u1EDD v\u1EABn duy\u1EC7t \u0111\u01B0\u1EE3c, v\xE0 Sales th\u1EA5y m\u1ED9t d\u1EA3i b\xE1o \u2014 kh\xF4ng im l\u1EB7ng bi\u1EBFn m\u1EA5t.")))))), state === "error" ? /*#__PURE__*/React.createElement(PartialError, {
    title: "Ch\u01B0a t\xEDnh \u0111\u01B0\u1EE3c t\u1EC9 l\u1EC7 Signal ch\u01B0a ph\xE2n lo\u1EA1i",
    detail: "B\u1EA3ng nh\u1EADt k\xFD qu\xE9t thi\u1EBFu 2 v\xF2ng c\u1EE7a ng\xE0y 13/08. C\xE1c s\u1ED1 \u0111o c\xF2n l\u1EA1i v\u1EABn t\xEDnh \u0111\u01B0\u1EE3c."
  }) : null));
}
Object.assign(window, {
  AdminScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/why-now/kit-admin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/why-now/kit-app.jsx
try { (() => {
const DSApp = window.WhyNowDesignSystem_dd23e3;
function SnapshotOverlay({
  id,
  onClose
}) {
  const {
    SnapshotHighlight,
    Button
  } = DSApp;
  const snap = window.SNAPSHOTS[id];
  if (!snap) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(17,20,23,.55)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 24px",
      zIndex: 20
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "760px",
      maxWidth: "100%"
    },
    onClick: function (e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "var(--band)",
      borderLeft: "4px solid var(--rail)",
      padding: "9px 14px",
      color: "var(--band-ink)",
      fontSize: "var(--fs-12-5)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Snapshot viewer \u2014 m\u1EDF t\u1EEB m\u1ED9t Signal, m\u1ED9t c\xFA b\u1EA5m"), /*#__PURE__*/React.createElement(Button, {
    variant: "onMachine",
    size: "sm",
    onClick: onClose,
    style: {
      marginLeft: "auto"
    }
  }, "\u0110\xF3ng \u2715")), /*#__PURE__*/React.createElement(SnapshotHighlight, {
    source: snap.source,
    capturedAt: snap.capturedAt,
    lang: snap.lang,
    paragraphs: snap.paragraphs
  })));
}
function App() {
  const {
    Masthead,
    AIOffBanner
  } = DSApp;
  const [screen, setScreen] = React.useState("Today");
  const [role, setRole] = React.useState("sales");
  const [state, setState] = React.useState("ready");
  const [aiOff, setAiOff] = React.useState(false);
  const [snapshot, setSnapshot] = React.useState(null);
  const [undone, setUndone] = React.useState([]);
  const [decided, setDecided] = React.useState({});
  const [log, setLog] = React.useState([]);
  const [newItems, setNewItems] = React.useState(0);
  React.useEffect(function () {
    if (state !== "ready" || aiOff) return;
    const t = setTimeout(function () {
      setNewItems(2);
    }, 12000);
    return function () {
      clearTimeout(t);
    };
  }, [state, aiOff]);
  const pendingCount = window.SUGGESTIONS.filter(function (s) {
    return !decided[s.id];
  }).length;
  function decide(id, how) {
    setDecided(Object.assign({}, decided, {
      [id]: how
    }));
    setLog(["Suggestion " + id + " — " + how].concat(log).slice(0, 4));
  }
  function undo(id) {
    setUndone(undone.concat([id]));
    setLog(["Hoàn tác ô Next step do máy đặt — về giá trị trước khi máy chạm"].concat(log).slice(0, 4));
  }
  const nav = role === "admin" ? ["Today", "Pipeline", "Accounts", "Watching", "Scan log", "Admin"] : ["Today", "Pipeline", "Accounts", "Watching", "Scan log"];
  const stats = [aiOff ? "Vòng quét đang tắt — số liệu giữ ở lần quét 09:41" : "Vòng quét gần nhất 09:41 — 15/15 Account đã quét, 4 Signal mới", aiOff ? "Hệ thống đã tự đặt 3/8 Next step hôm nay (ngừng sinh mới)" : "Hệ thống đã tự đặt 3/8 Next step hôm nay", pendingCount + " Suggestion đang chờ trên 4 Account"];
  let body;
  if (screen === "Today") body = /*#__PURE__*/React.createElement(window.TodayScreen, {
    state: state,
    aiOff: aiOff,
    onOpenSnapshot: setSnapshot,
    onGoQueue: function () {
      setScreen("Queue");
    },
    onUndo: undo,
    undoneRows: undone,
    pendingCount: pendingCount,
    newItems: newItems,
    onLoadNew: function () {
      setNewItems(0);
    }
  });else if (screen === "Queue") body = /*#__PURE__*/React.createElement(window.QueueScreen, {
    state: state,
    aiOff: aiOff,
    decided: decided,
    onDecide: decide,
    onOpenSnapshot: setSnapshot,
    onBack: function () {
      setScreen("Today");
    }
  });else if (screen === "Accounts") body = /*#__PURE__*/React.createElement(window.AccountScreen, {
    state: state,
    onOpenSnapshot: setSnapshot,
    onGoQueue: function () {
      setScreen("Queue");
    }
  });else if (screen === "Admin") body = /*#__PURE__*/React.createElement(window.AdminScreen, {
    state: state,
    aiOff: aiOff,
    onBrake: function () {
      setAiOff(true);
      setScreen("Today");
    },
    onResume: function () {
      setAiOff(false);
    }
  });else body = /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      flex: 1,
      padding: "28px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "var(--fs-17)",
      color: "var(--ink-strong)"
    }
  }, screen, " \u2014 b\u1EC1 m\u1EB7t n\xE0y c\u1ED1 \xFD gi\u1EEF d\u1EA1ng bi\u1EC3u m\u1EABu."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-12-5)",
      color: "var(--ink-2)",
      marginTop: "9px",
      maxWidth: "620px",
      lineHeight: 1.6
    }
  }, "Quy\u1EBFt \u0111\u1ECBnh c\xF3 \xFD th\u1EE9c, kh\xF4ng ph\u1EA3i b\u1ECF qu\xEAn: c\xF4ng d\u1ED3n v\xE0o b\u1ED1n b\u1EC1 m\u1EB7t Today \xB7 Suggestion queue \xB7 Account detail \xB7 Admin dashboard. C\xE1i gi\xE1 c\u1EE7a vi\u1EC7c \u0111\u1EC3 b\u1EA3y m\xE0n c\xF2n l\u1EA1i \u1EDF d\u1EA1ng bi\u1EC3u m\u1EABu, v\xE0 d\u1EA5u hi\u1EC7u ph\u1EA3i n\xE2ng c\u1EA5p, ghi \u1EDF ", /*#__PURE__*/React.createElement("b", null, "backlog-giao-dien.md"), " c\u1EE7a ngu\u1ED3n."));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "1440px",
      height: "928px",
      background: "var(--app)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "var(--shadow-app)"
    }
  }, /*#__PURE__*/React.createElement(Masthead, {
    view: screen,
    currency: "JPY",
    user: role === "admin" ? "Hà Nguyễn — Quản trị chất lượng dữ liệu" : "Linh Trần — Sales / BD, thị trường JP",
    date: "Th\u1EE9 S\xE1u, 14/08/2026",
    stats: stats,
    nav: nav,
    activeNav: screen,
    onNavigate: setScreen
  }), aiOff ? /*#__PURE__*/React.createElement(AIOffBanner, {
    since: "14/08 09:52",
    reason: "Qu\u1EA3n tr\u1ECB b\u1EA5m phanh",
    canResume: role === "admin",
    onResume: function () {
      setAiOff(false);
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "7px 24px",
      background: "var(--band)",
      color: "var(--band-ink-2)",
      fontSize: "var(--fs-11)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      letterSpacing: ".1em",
      textTransform: "uppercase",
      fontWeight: 800,
      color: "var(--rail)"
    }
  }, "\u0110i\u1EC1u khi\u1EC3n b\u1EA3n demo"), /*#__PURE__*/React.createElement("span", null, "Vai:"), ["sales", "admin"].map(function (r) {
    return /*#__PURE__*/React.createElement("button", {
      key: r,
      onClick: function () {
        setRole(r);
        if (r === "sales" && screen === "Admin") setScreen("Today");
      },
      style: {
        background: role === r ? "var(--rail)" : "transparent",
        color: role === r ? "var(--rail-ink)" : "var(--band-ink-2)",
        border: "1px solid " + (role === r ? "var(--rail)" : "var(--band-rule)"),
        padding: "2px 8px",
        fontSize: "var(--fs-11)",
        fontFamily: "var(--font-sans)",
        cursor: "pointer"
      }
    }, r === "sales" ? "Sales" : "Quản trị");
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "10px"
    }
  }, "Tr\u1EA1ng th\xE1i:"), [["ready", "bình thường"], ["empty", "rỗng"], ["loading", "đang tải"], ["error", "lỗi một phần"]].map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s[0],
      onClick: function () {
        setState(s[0]);
      },
      style: {
        background: state === s[0] ? "var(--rail)" : "transparent",
        color: state === s[0] ? "var(--rail-ink)" : "var(--band-ink-2)",
        border: "1px solid " + (state === s[0] ? "var(--rail)" : "var(--band-rule)"),
        padding: "2px 8px",
        fontSize: "var(--fs-11)",
        fontFamily: "var(--font-sans)",
        cursor: "pointer"
      }
    }, s[1]);
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setAiOff(!aiOff);
    },
    style: {
      background: "transparent",
      color: aiOff ? "var(--band-od)" : "var(--band-ink-2)",
      border: "1px solid var(--band-rule)",
      padding: "2px 8px",
      fontSize: "var(--fs-11)",
      fontFamily: "var(--font-sans)",
      cursor: "pointer",
      marginLeft: "10px"
    }
  }, aiOff ? "AI đang tắt — bật lại" : "Tắt phần AI"), log.length ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      color: "var(--band-ink-3)"
    }
  }, log[0]) : null), snapshot ? /*#__PURE__*/React.createElement(SnapshotOverlay, {
    id: snapshot,
    onClose: function () {
      setSnapshot(null);
    }
  }) : null);
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/why-now/kit-app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/why-now/kit-data.jsx
try { (() => {
// Bộ dữ liệu của bản demo — nội dung thật của sản phẩm, không lorem.
// 15 Account (Nhật và Việt), 8 Opportunity đang mở, một đơn vị tiền: JPY.

const TODAY_ROWS = [{
  id: "r1",
  section: "overdue",
  source: "machine",
  when: "Quá 1 ngày",
  whenDetail: "hạn 13/08",
  overdue: true,
  account: "Hoshino Retail Systems",
  accountMeta: "星野リテールシステムズ · Ōsaka",
  opp: "Cổng đối tác B2B",
  stage: "Soạn đề xuất",
  money: "21.000.000",
  confidence: "chac",
  headline: "Hoshino mở trung tâm phát triển thứ hai tại Ōsaka — hỏi lại phạm vi giai đoạn 2",
  quote: "「大阪に第二開発拠点を開設し、2026年内に80名体制とする計画です」",
  quoteLang: "ja",
  quoteSource: "Bản lưu 11/08 09:41 — bấm để mở đúng đoạn có đánh dấu",
  signalMeta: "Signal: Mở rộng · 11/08",
  undo: "5 ngày 22 giờ",
  snapshot: "hoshino"
}, {
  id: "r2",
  section: "overdue",
  source: "human",
  when: "Quá 2 ngày",
  whenDetail: "hạn 12/08",
  overdue: true,
  account: "Sōkō Logistics Co., Ltd.",
  accountMeta: "倉庫ロジスティクス株式会社 · Tōkyō",
  pending: 2,
  opp: "Nâng cấp WMS",
  stage: "Soạn đề xuất",
  money: "32.000.000",
  headline: "Gửi bản đề xuất sửa lần 2 cho ông Tanaka",
  byline: "08/08 lúc 14:22",
  signalMeta: "Không sinh từ Signal"
}, {
  id: "r3",
  section: "today",
  source: "machine",
  when: "Hôm nay",
  whenDetail: "14/08",
  account: "Kaisei Denshi K.K.",
  accountMeta: "株式会社カイセイ電子 · Nagoya",
  pending: 1,
  opp: "MES giai đoạn 1",
  stage: "Thương lượng",
  money: "48.000.000",
  confidence: "chac",
  headline: "Kaisei Denshi vừa công bố vòng Series B 3,2 tỷ yên — liên hệ trong ngày",
  quote: "「シリーズBラウンドにて総額32億円の資金調達を完了いたしました」",
  quoteLang: "ja",
  quoteSource: "Bản lưu 14/08 08:12 — bấm để mở đúng đoạn có đánh dấu",
  signalMeta: "Signal: Gọi vốn · 13/08",
  signalMeta2: "hạn theo độ gấp: 1 ngày",
  undo: "6 ngày 21 giờ",
  snapshot: "kaisei"
}, {
  id: "r4",
  section: "today",
  source: "machine",
  when: "Hôm nay",
  whenDetail: "14/08",
  account: "CTCP Công nghệ Minh Quang",
  accountMeta: "IT Product · Hà Nội",
  opp: "Thuê ngoài đội QA",
  stage: "Tiếp cận",
  money: "9.500.000",
  confidence: "chac",
  headline: "Minh Quang có CTO mới từ 01/09 — chào lại với người quyết mới",
  quote: "“Hội đồng quản trị bổ nhiệm ông Nguyễn Đức Toàn giữ chức Giám đốc Công nghệ kể từ ngày 01/09/2026”",
  quoteSource: "Bản lưu 07/08 16:20 — bấm để mở đúng đoạn có đánh dấu",
  signalMeta: "Signal: Nhân sự cấp cao · 06/08",
  undo: "4 giờ 10 phút",
  undoSoon: true,
  undoNote: "sau đó sửa tay như ô bình thường",
  snapshot: "minhquang"
}, {
  id: "r5",
  section: "today",
  source: "human",
  when: "Hôm nay",
  whenDetail: "14/08",
  flagged: true,
  account: "Midori Pharma K.K.",
  accountMeta: "株式会社ミドリ製薬 · Kyōto",
  pending: 1,
  opp: "Hệ thống truy xuất lô",
  stage: "Đủ điều kiện",
  money: "26.500.000",
  headline: "Gọi bà Ishikawa xác nhận ngân sách quý IV",
  byline: "12/08 lúc 17:04",
  flag: "Thiếu dấu hiệu ngân sách cho Stage Đủ điều kiện — bổ sung ngay",
  signalMeta: "Hệ thống ghim một dòng đề xuất, không ghi đè ô bạn gõ"
}, {
  id: "r6",
  section: "today",
  source: "human",
  when: "Hôm nay",
  whenDetail: "14/08",
  account: "Tsubasa Mobility Inc.",
  accountMeta: "株式会社ツバサモビリティ · Yokohama",
  pending: 1,
  opp: "Cổng dữ liệu xe điện",
  stage: "Tiếp cận",
  money: "18.000.000",
  headline: "Chốt lịch demo với đội kỹ thuật",
  byline: "13/08 lúc 09:15",
  signalMeta: "Không sinh từ Signal"
}, {
  id: "r7",
  section: "flagged",
  source: "human",
  when: "—",
  whenDetail: "chưa có hạn",
  flagged: true,
  account: "Công ty CP Thực phẩm Trường An",
  accountMeta: "Traditional · TP.HCM",
  opp: "Migration ERP lên cloud",
  stage: "Đủ điều kiện",
  money: "15.000.000",
  flag: "Thiếu Next step và ngày hạn — đặt Next step để việc này vào danh sách"
}, {
  id: "r8",
  section: "flagged",
  source: "human",
  when: "—",
  whenDetail: "tạm ngưng",
  account: "Công ty TNHH Dệt may Phú Hòa",
  accountMeta: "Traditional · Nam Định",
  opp: "Cổng ERP nhà cung cấp",
  stage: "Tạm dừng",
  money: "12.000.000",
  quiet: "Cũng thiếu Next step, nhưng cờ im lặng có chủ đích; hệ thống không tự đặt cho tới khi Opportunity quay lại Stage đang chạy."
}];
const SUGGESTIONS = [{
  id: "s1",
  account: "Sōkō Logistics Co., Ltd.",
  field: "Primary contact",
  current: null,
  proposed: "Tanaka Hiroshi — Trưởng phòng Hệ thống",
  confidence: "chac",
  quote: "「システム部長 田中 宏 が本プロジェクトの窓口を担当いたします」",
  quoteLang: "ja",
  quoteSource: "Bản lưu 10/08 11:03 — bấm để mở đúng đoạn có đánh dấu",
  snapshot: "soko",
  risk: "người liên hệ sai làm mất một vòng gọi, và Timeline ghi nhầm đối tượng."
}, {
  id: "s2",
  account: "Sōkō Logistics Co., Ltd.",
  field: "Ngành",
  current: "Logistics",
  proposed: "Logistics · kho tự động",
  confidence: "cothe",
  quote: "「自動倉庫システムの導入を全拠点に拡大する」",
  quoteLang: "ja",
  quoteSource: "Bản lưu 10/08 11:03 — bấm để mở đúng đoạn có đánh dấu",
  snapshot: "soko",
  risk: "phân khúc lệch một bậc, và bộ tiêu chí chấm điểm cơ hội sẽ chấm sai."
}, {
  id: "s3",
  account: "Midori Pharma K.K.",
  field: "Quy mô nhân sự",
  current: "480 người",
  proposed: "640 người",
  confidence: "cothe",
  staleProfile: true,
  quote: "「グループ従業員数は640名となりました」",
  quoteLang: "ja",
  quoteSource: "Bản lưu 12/08 07:55 — bấm để mở đúng đoạn có đánh dấu",
  snapshot: "midori",
  risk: "hồ sơ mang quy mô sai khi mang đi họp, và tiêu chí phân khúc sẽ lệch."
}, {
  id: "s4",
  account: "Kaisei Denshi K.K.",
  field: "Timeline",
  current: null,
  proposed: "Thêm mục: gọi vốn Series B 3,2 tỷ yên (13/08)",
  confidence: "chac",
  quote: "「シリーズBラウンドにて総額32億円の資金調達を完了いたしました」",
  quoteLang: "ja",
  quoteSource: "Bản lưu 14/08 08:12 — bấm để mở đúng đoạn có đánh dấu",
  snapshot: "kaisei",
  risk: "Timeline thiếu một mốc quan trọng, và lần chào sau sẽ nhắc lại thứ khách đã công bố."
}, {
  id: "s5",
  account: "Tsubasa Mobility Inc.",
  field: "Ghi chú ngành",
  current: null,
  proposed: "Đang tuyển 25 kỹ sư nhúng tại Yokohama",
  confidence: "doan",
  quote: "「組込みエンジニア 若干名 募集」",
  quoteLang: "ja",
  quoteSource: "Bản lưu 09/08 15:12 — bấm để mở đúng đoạn có đánh dấu",
  snapshot: "tsubasa",
  risk: "con số 25 là suy ra từ cụm 若干名, không có trong nguồn — dùng nó trong đề xuất là nói quá."
}, {
  id: "s6",
  account: "Hoshino Retail Systems",
  field: "Ghi chú ngành",
  current: "Bán lẻ · POS",
  proposed: "Bán lẻ · POS · trung tâm phát triển Ōsaka (80 người, 2026)",
  confidence: "chac",
  quote: "「大阪に第二開発拠点を開設し、2026年内に80名体制とする計画です」",
  quoteLang: "ja",
  quoteSource: "Bản lưu 11/08 09:41 — bấm để mở đúng đoạn có đánh dấu",
  snapshot: "hoshino",
  risk: "bỏ mất một dấu hiệu mở rộng đang chạy, đúng thứ làm nên độ gấp của deal này."
}, {
  id: "s7",
  account: "CTCP Công nghệ Minh Quang",
  field: "Primary contact",
  current: "Lê Thị Hòa — Trưởng phòng IT",
  proposed: "Nguyễn Đức Toàn — Giám đốc Công nghệ (từ 01/09)",
  confidence: "cothe",
  quote: "“Hội đồng quản trị bổ nhiệm ông Nguyễn Đức Toàn giữ chức Giám đốc Công nghệ kể từ ngày 01/09/2026”",
  quoteSource: "Bản lưu 07/08 16:20 — bấm để mở đúng đoạn có đánh dấu",
  snapshot: "minhquang",
  risk: "đổi Primary contact quá sớm thì mất người đang giữ quan hệ, trước khi người mới nhận việc."
}];
const SNAPSHOTS = {
  kaisei: {
    source: "kaisei-denshi.co.jp / ニュースリリース",
    capturedAt: "14/08 08:12",
    lang: "ja",
    paragraphs: ["当社は2026年8月13日開催の取締役会において、資金調達に関する決議を行いましたのでお知らせいたします。", {
      text: "「シリーズBラウンドにて総額32億円の資金調達を完了いたしました」",
      marked: true
    }, "調達した資金は、名古屋の開発体制の拡充および海外パートナーとの協業推進に充当する予定です。"]
  },
  hoshino: {
    source: "hoshino-retail.co.jp / IR",
    capturedAt: "11/08 09:41",
    lang: "ja",
    paragraphs: ["小売業向け基幹システムの需要拡大に対応するため、開発体制の見直しを進めております。", {
      text: "「大阪に第二開発拠点を開設し、2026年内に80名体制とする計画です」",
      marked: true
    }, "第一拠点である東京との二拠点体制により、開発の継続性を確保いたします。"]
  },
  minhquang: {
    source: "minhquang.vn / Tin công ty",
    capturedAt: "07/08 16:20",
    lang: "vi",
    paragraphs: ["Ngày 07/08/2026, Công ty Cổ phần Công nghệ Minh Quang tổ chức phiên họp Hội đồng quản trị thường kỳ.", {
      text: "“Hội đồng quản trị bổ nhiệm ông Nguyễn Đức Toàn giữ chức Giám đốc Công nghệ kể từ ngày 01/09/2026”",
      marked: true
    }, "Ông Toàn có 14 năm kinh nghiệm trong lĩnh vực phát triển sản phẩm phần mềm."]
  },
  midori: {
    source: "midori-pharma.co.jp / 会社概要",
    capturedAt: "12/08 07:55",
    lang: "ja",
    paragraphs: ["2026年8月現在の会社概要は以下のとおりです。", {
      text: "「グループ従業員数は640名となりました」",
      marked: true
    }, "京都本社および滋賀工場を中心に、医薬品の製造および品質管理を行っております。"]
  },
  soko: {
    source: "soko-logistics.co.jp / お知らせ",
    capturedAt: "10/08 11:03",
    lang: "ja",
    paragraphs: [{
      text: "「システム部長 田中 宏 が本プロジェクトの窓口を担当いたします」",
      marked: true
    }, "「自動倉庫システムの導入を全拠点に拡大する」方針のもと、2026年度中に東京・大阪・福岡の三拠点で稼働を予定しております。"]
  },
  tsubasa: {
    source: "tsubasa-mobility.co.jp / 採用情報",
    capturedAt: "09/08 15:12",
    lang: "ja",
    paragraphs: ["横浜開発センターでは、次世代EV向けソフトウェアの開発を行っています。", {
      text: "「組込みエンジニア 若干名 募集」",
      marked: true
    }, "応募資格および待遇の詳細は募集要項をご確認ください。"]
  }
};
const STAGE_STATS = [{
  name: "Tiếp cận",
  count: 2,
  value: "27.500.000"
}, {
  name: "Đủ điều kiện",
  count: 2,
  value: "41.500.000"
}, {
  name: "Soạn đề xuất",
  count: 2,
  value: "53.000.000"
}, {
  name: "Thương lượng",
  count: 1,
  value: "48.000.000"
}, {
  name: "Tạm dừng",
  count: 1,
  value: "12.000.000"
}, {
  name: "Thắng",
  count: 2,
  value: "57.000.000",
  closed: true
}, {
  name: "Thua",
  count: 5,
  value: "88.500.000",
  closed: true
}];
const LOSS_REASONS = [{
  name: "Giá cao hơn đối thủ",
  count: 3
}, {
  name: "Ngân sách bị hoãn",
  count: 2
}, {
  name: "Chọn nhà cung cấp trong nước",
  count: 1
}, {
  name: "Thiếu chứng chỉ bảo mật",
  count: 1
}];
const INDUSTRIES = [{
  name: "Sản xuất",
  count: 6
}, {
  name: "Logistics",
  count: 3
}, {
  name: "Bán lẻ",
  count: 3
}, {
  name: "Dược phẩm",
  count: 2
}, {
  name: "Dệt may",
  count: 1
}];
Object.assign(window, {
  TODAY_ROWS,
  SUGGESTIONS,
  SNAPSHOTS,
  STAGE_STATS,
  LOSS_REASONS,
  INDUSTRIES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/why-now/kit-data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/why-now/kit-queue.jsx
try { (() => {
const DSQ = window.WhyNowDesignSystem_dd23e3;
function QueueScreen({
  state,
  aiOff,
  decided,
  onDecide,
  onOpenSnapshot,
  onBack
}) {
  const {
    SectionKicker,
    SuggestionCard,
    DismissReasonPicker,
    EmptyState,
    SkeletonRows,
    Button,
    TextField
  } = DSQ;
  const [dismissing, setDismissing] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const open = window.SUGGESTIONS.filter(function (s) {
    return !decided[s.id];
  });
  const byAccount = {};
  open.forEach(function (s) {
    (byAccount[s.account] = byAccount[s.account] || []).push(s);
  });
  const accounts = Object.keys(byAccount);
  if (state === "loading") return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionKicker, {
    title: "H\xE0ng \u0111\u1EE3i",
    meta: "\u0111ang t\u1EA3i"
  }), /*#__PURE__*/React.createElement(SkeletonRows, {
    count: 4
  }));
  if (state === "empty" || accounts.length === 0) {
    return /*#__PURE__*/React.createElement(EmptyState, {
      line: "Kh\xF4ng c\xF3 g\u1EE3i \xFD n\xE0o ch\u1EDD.",
      sub: "V\xF2ng qu\xE9t g\u1EA7n nh\u1EA5t 09:41 \u2014 15/15 Account \u0111\xE3 qu\xE9t. G\u1EE3i \xFD m\u1EDBi s\u1EBD hi\u1EC7n \u1EDF \u0111\xE2y, kh\xF4ng t\u1EF1 \xE1p d\u1EE5ng v\xE0o h\u1ED3 s\u01A1."
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: onBack
    }, "\u2190 V\u1EC1 Today"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      overflow: "auto",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SectionKicker, {
    title: "H\xE0ng \u0111\u1EE3i \u2014 x\u1EBFp theo th\u1EE9 t\u1EF1 \u01B0u ti\xEAn, gom theo Account",
    meta: open.length + " gợi ý chờ trên " + accounts.length + " Account · Duyệt 1 bấm · Bỏ 2 bấm"
  }), accounts.map(function (acc) {
    return /*#__PURE__*/React.createElement("div", {
      key: acc,
      style: {
        padding: "12px 24px 4px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "var(--fs-11)",
        letterSpacing: "var(--ls-box)",
        textTransform: "uppercase",
        fontWeight: "var(--fw-black)",
        color: "var(--ink-2)",
        marginBottom: "9px"
      }
    }, acc, " \u2014 ", byAccount[acc].length, " g\u1EE3i \xFD"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gap: "12px",
        marginBottom: "14px"
      }
    }, byAccount[acc].map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        key: s.id
      }, /*#__PURE__*/React.createElement(SuggestionCard, {
        account: s.account,
        field: s.field,
        current: s.current,
        proposed: s.proposed,
        confidence: s.confidence,
        quote: s.quote,
        quoteLang: s.quoteLang,
        quoteSource: s.quoteSource,
        risk: s.risk,
        staleProfile: s.staleProfile,
        onOpenSource: function () {
          onOpenSnapshot(s.snapshot);
        },
        onApprove: function () {
          onDecide(s.id, "duyệt");
        },
        onEditApprove: function () {
          setEditing(s.id);
          setDraft(typeof s.proposed === "string" ? s.proposed : "");
        },
        onDismiss: function () {
          setDismissing(s.id);
        }
      }), editing === s.id ? /*#__PURE__*/React.createElement("div", {
        style: {
          background: "var(--paper-tint)",
          border: "1px solid var(--rule)",
          borderTop: "3px solid var(--ink)",
          padding: "11px 14px"
        }
      }, /*#__PURE__*/React.createElement(TextField, {
        label: "S\u1EEDa r\u1ED3i duy\u1EC7t",
        value: draft,
        onChange: function (e) {
          setDraft(e.target.value);
        },
        hint: "Gi\xE1 tr\u1ECB b\u1EA1n s\u1EEDa v\xE0o h\u1ED3 s\u01A1 nh\u01B0 th\u1EC3 b\u1EA1n t\u1EF1 g\xF5 \u2014 \xF4 s\u1EBD n\u1EB1m tr\xEAn gi\u1EA5y, kh\xF4ng tr\xEAn d\u1EA3i m\xE1y."
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: "8px",
          marginTop: "10px"
        }
      }, /*#__PURE__*/React.createElement(DSQ.Button, {
        variant: "primary",
        onClick: function () {
          setEditing(null);
          onDecide(s.id, "sửa rồi duyệt");
        }
      }, "X\xE1c nh\u1EADn"), /*#__PURE__*/React.createElement(DSQ.Button, {
        variant: "secondary",
        onClick: function () {
          setEditing(null);
        }
      }, "Th\xF4i"))) : null, dismissing === s.id ? /*#__PURE__*/React.createElement(DismissReasonPicker, {
        onPick: function (reason) {
          setDismissing(null);
          onDecide(s.id, "bỏ · " + reason);
        }
      }) : null);
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 24px 24px",
      fontSize: "var(--fs-11-5)",
      color: "var(--ink-2)",
      lineHeight: 1.55
    }
  }, "G\u1EE3i \xFD ch\u01B0a quy\u1EBFt gi\u1EEF nguy\xEAn v\xF4 th\u1EDDi h\u1EA1n \u2014 kh\xF4ng t\u1EF1 \xE1p d\u1EE5ng, kh\xF4ng h\u1EBFt h\u1EA1n th\xE0nh h\xE0nh \u0111\u1ED9ng. Duy\u1EC7t c\u0169ng c\xF3 Ho\xE0n t\xE1c, c\xF9ng c\u1EEDa s\u1ED5 7 ng\xE0y."));
}
Object.assign(window, {
  QueueScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/why-now/kit-queue.jsx", error: String((e && e.message) || e) }); }

// ui_kits/why-now/kit-today.jsx
try { (() => {
const DS = window.WhyNowDesignSystem_dd23e3;
function TodayRow({
  row,
  onOpenSnapshot,
  undone,
  onUndo,
  edited
}) {
  const {
    WorkItem,
    QuoteBlock,
    UndoButton,
    WarningFlag,
    SuggestionPin,
    ConfidenceBadge
  } = DS;
  const machine = row.source === "machine" && !undone;
  const bold = machine ? {
    color: "var(--band-ink-3)",
    fontWeight: 650
  } : {
    color: "var(--ink-mid)",
    fontWeight: 650
  };
  return /*#__PURE__*/React.createElement(WorkItem, {
    source: machine ? "machine" : "human",
    when: row.when,
    whenDetail: row.whenDetail,
    overdue: row.overdue,
    flagged: row.flagged,
    account: row.account,
    accountMeta: row.accountMeta,
    accountAdornment: row.pending ? /*#__PURE__*/React.createElement(SuggestionPin, {
      count: row.pending,
      onMachine: machine
    }) : null,
    opportunity: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
      style: bold
    }, row.opp), " · Stage " + row.stage),
    headline: undone ? "— ô đã về giá trị trước khi máy chạm: chưa có Next step" : row.headline,
    bylineDetail: machine ? null : undone ? "hoàn tác 14/08" : row.byline,
    money: row.money,
    stage: row.stage,
    confidence: machine ? row.confidence : null,
    signalMeta: row.signalMeta ? /*#__PURE__*/React.createElement("span", null, row.signalMeta, row.signalMeta2 ? /*#__PURE__*/React.createElement("br", null) : null, row.signalMeta2) : null
  }, machine && row.quote ? /*#__PURE__*/React.createElement(QuoteBlock, {
    onMachine: true,
    lang: row.quoteLang,
    quote: row.quote,
    source: row.quoteSource,
    onOpen: () => onOpenSnapshot(row.snapshot)
  }) : null, machine && row.undo && !edited ? /*#__PURE__*/React.createElement(UndoButton, {
    remaining: row.undo,
    soon: row.undoSoon,
    note: row.undoNote,
    onUndo: () => onUndo(row.id)
  }) : null, row.flag ? /*#__PURE__*/React.createElement(WarningFlag, null, row.flag) : null, row.quiet ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11.5px",
      color: "var(--ink-3)",
      marginTop: "6px",
      lineHeight: 1.45
    }
  }, row.quiet) : null, undone ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11.5px",
      color: "var(--ink-3)",
      marginTop: "6px"
    }
  }, "\u0110\xE3 ho\xE0n t\xE1c. H\u1EC7 th\u1ED1ng kh\xF4ng \u0111\u1EB7t l\u1EA1i \xF4 n\xE0y; b\u1EA1n g\xF5 ho\u1EB7c \u0111\u1EC3 tr\u1ED1ng \u0111\u1EC1u \u0111\u01B0\u1EE3c.") : null);
}
function TodayScreen({
  state,
  aiOff,
  onOpenSnapshot,
  onGoQueue,
  onUndo,
  undoneRows,
  pendingCount,
  newItems,
  onLoadNew
}) {
  const {
    SectionKicker,
    QueueCallout,
    StatBox,
    StatRow,
    EmptyState,
    SkeletonRows,
    PartialError,
    Button,
    Legend,
    ConfidenceBadge,
    NewItemsBanner
  } = DS;
  const rows = window.TODAY_ROWS;
  const sections = [{
    key: "overdue",
    title: "Quá hạn",
    tone: "overdue",
    meta: "2 việc · việc cũ nhất quá 2 ngày"
  }, {
    key: "today",
    title: "Đến hạn hôm nay",
    meta: aiOff ? "4 việc · phần gợi ý đang tắt, ô do máy đặt giữ nguyên" : "4 việc · 2 do hệ thống đặt"
  }, {
    key: "flagged",
    title: "Mang cờ — không nằm trong danh sách việc",
    meta: "2 Opportunity"
  }];
  let left;
  if (state === "loading") {
    left = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionKicker, {
      tone: "overdue",
      title: "Qu\xE1 h\u1EA1n",
      meta: "\u0111ang t\u1EA3i"
    }), /*#__PURE__*/React.createElement(SkeletonRows, {
      count: 9
    }));
  } else if (state === "empty") {
    left = /*#__PURE__*/React.createElement(EmptyState, {
      line: "H\xF4m nay ch\u01B0a c\xF3 vi\u1EC7c \u0111\u1EBFn h\u1EA1n.",
      sub: "V\xF2ng qu\xE9t g\u1EA7n nh\u1EA5t 09:41 \u2014 15/15 Account \u0111\xE3 qu\xE9t. Kh\xF4ng c\xF3 vi\u1EC7c n\xE0o qu\xE1 h\u1EA1n."
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "suggestion",
      onClick: onGoQueue
    }, "M\u1EDF Suggestion queue \u2014 ", pendingCount, " \u0111ang ch\u1EDD \u2192"));
  } else {
    left = /*#__PURE__*/React.createElement("div", null, sections.map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        key: s.key
      }, /*#__PURE__*/React.createElement(SectionKicker, {
        title: s.title,
        tone: s.tone,
        meta: s.meta
      }), rows.filter(function (r) {
        return r.section === s.key;
      }).map(function (r) {
        return /*#__PURE__*/React.createElement(TodayRow, {
          key: r.id,
          row: r,
          undone: undoneRows.indexOf(r.id) >= 0,
          onUndo: onUndo,
          onOpenSnapshot: onOpenSnapshot
        });
      }));
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, newItems > 0 && state === "ready" ? /*#__PURE__*/React.createElement(NewItemsBanner, {
    count: newItems,
    scanAt: "09:41",
    onLoad: onLoadNew
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr var(--col-rail)",
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      overflow: "auto"
    }
  }, left), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--app)",
      borderLeft: "1px solid var(--rule)",
      padding: "14px 18px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      overflow: "auto"
    }
  }, state === "error" ? /*#__PURE__*/React.createElement(PartialError, {
    title: "Kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c ngu\u1ED3n c\u1EE7a Aozora Tech",
    detail: "Trang ngu\u1ED3n ch\u1EB7n truy c\u1EADp t\u1EEB 12/08. V\xF2ng qu\xE9t sau s\u1EBD th\u1EED l\u1EA1i \u2014 ba kh\u1ED1i c\xF2n l\u1EA1i v\u1EABn ch\u1EA1y.",
    onRetry: function () {}
  }) : null, state === "empty" ? null : /*#__PURE__*/React.createElement(QueueCallout, {
    count: pendingCount,
    subject: /*#__PURE__*/React.createElement("span", null, "Suggestion \u0111ang ch\u1EDD", /*#__PURE__*/React.createElement("br", null), "tr\xEAn 4 Account"),
    sub: aiOff ? "Phần sinh gợi ý đang tắt. Gợi ý đang chờ vẫn bấm được — phanh chặn phần sinh ra, không chặn phần bạn quyết." : "19 Suggestion đã sinh trong 24 giờ qua. Không duyệt thì hồ sơ giữ nguyên — không có gợi ý nào tự áp dụng.",
    items: window.SUGGESTIONS.filter(function (s) {
      return true;
    }).slice(0, 3).map(function (s) {
      const label = s.current ? s.field + " " + s.current + " → " + s.proposed : s.field + " — còn trống, đề nghị " + s.proposed;
      return {
        text: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, s.account), " — " + label),
        confidence: s.confidence
      };
    }),
    onOpen: onGoQueue
  }), /*#__PURE__*/React.createElement(StatBox, {
    title: "Opportunity theo Stage",
    sub: "T\u1ED5ng gi\xE1 tr\u1ECB \u01B0\u1EDBc t\xEDnh (ch\u01B0a nh\xE2n x\xE1c su\u1EA5t) \xB7 JPY",
    note: "8 Opportunity \u0111ang m\u1EDF / 15 t\u1ED5ng c\u1ED9ng."
  }, window.STAGE_STATS.map(function (s, i) {
    return /*#__PURE__*/React.createElement(StatRow, {
      key: s.name,
      name: s.name,
      count: s.count,
      value: s.value,
      closed: s.closed,
      last: i === window.STAGE_STATS.length - 1
    });
  })), /*#__PURE__*/React.createElement(StatBox, {
    title: "L\xFD do thua",
    sub: "4 Opportunity \xB7 7 l\u01B0\u1EE3t l\xFD do \u2014 m\u1ED9t Opportunity \u0111\u1EBFm v\xE0o nhi\u1EC1u d\xF2ng",
    note: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "1 Opportunity Thua ch\u01B0a c\xF3 l\xFD do"), " \u2014 \u0111\u1EE9ng ngo\xE0i b\u1EA3ng cho t\u1EDBi khi \u0111\u01B0\u1EE3c b\u1ED5 sung.")
  }, window.LOSS_REASONS.map(function (r, i) {
    return /*#__PURE__*/React.createElement(StatRow, {
      key: r.name,
      name: r.name,
      count: r.count,
      last: i === window.LOSS_REASONS.length - 1
    });
  })), /*#__PURE__*/React.createElement(StatBox, {
    title: "Account theo ng\xE0nh",
    sub: "15 Account trong danh m\u1EE5c c\u1EE7a b\u1EA1n"
  }, window.INDUSTRIES.map(function (r, i) {
    return /*#__PURE__*/React.createElement(StatRow, {
      key: r.name,
      name: r.name,
      count: r.count,
      last: i === window.INDUSTRIES.length - 1
    });
  })))), /*#__PURE__*/React.createElement(Legend, {
    items: [{
      swatch: "machine",
      text: "Dải nền tối + ray vàng + ⚙ = Next step do hệ thống đặt"
    }, {
      swatch: "paper",
      text: "Giấy trắng + ✎ = Next step do bạn gõ"
    }, {
      text: /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          gap: "6px",
          alignItems: "center"
        }
      }, "M\u1EE9c ch\u1EAFc ch\u1EAFn:", /*#__PURE__*/React.createElement(ConfidenceBadge, {
        level: "chac"
      }), /*#__PURE__*/React.createElement(ConfidenceBadge, {
        level: "cothe"
      }), /*#__PURE__*/React.createElement(ConfidenceBadge, {
        level: "doan"
      }), /*#__PURE__*/React.createElement("span", null, "\u2014 k\xFD hi\u1EC7u \u0111i c\xF9ng m\xE0u, kh\xF4ng d\xF9ng m\xE0u \u0111\u01A1n \u0111\u1ED9c"))
    }]
  }));
}
Object.assign(window, {
  TodayScreen,
  TodayRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/why-now/kit-today.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.Metric = __ds_scope.Metric;

__ds_ns.QueueCallout = __ds_scope.QueueCallout;

__ds_ns.StatBox = __ds_scope.StatBox;

__ds_ns.StatRow = __ds_scope.StatRow;

__ds_ns.TimelineEntry = __ds_scope.TimelineEntry;

__ds_ns.AIOffBanner = __ds_scope.AIOffBanner;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.NewItemsBanner = __ds_scope.NewItemsBanner;

__ds_ns.PartialError = __ds_scope.PartialError;

__ds_ns.SkeletonRows = __ds_scope.SkeletonRows;

__ds_ns.Legend = __ds_scope.Legend;

__ds_ns.Masthead = __ds_scope.Masthead;

__ds_ns.SectionKicker = __ds_scope.SectionKicker;

__ds_ns.SnapshotHighlight = __ds_scope.SnapshotHighlight;

__ds_ns.ConfidenceBadge = __ds_scope.ConfidenceBadge;

__ds_ns.SignalChip = __ds_scope.SignalChip;

__ds_ns.SourceByline = __ds_scope.SourceByline;

__ds_ns.SuggestionPin = __ds_scope.SuggestionPin;

__ds_ns.WarningFlag = __ds_scope.WarningFlag;

__ds_ns.DISMISS_REASONS = __ds_scope.DISMISS_REASONS;

__ds_ns.DismissReasonPicker = __ds_scope.DismissReasonPicker;

__ds_ns.SuggestionCard = __ds_scope.SuggestionCard;

__ds_ns.QuoteBlock = __ds_scope.QuoteBlock;

__ds_ns.StagePill = __ds_scope.StagePill;

__ds_ns.UndoButton = __ds_scope.UndoButton;

__ds_ns.WorkItem = __ds_scope.WorkItem;

})();
