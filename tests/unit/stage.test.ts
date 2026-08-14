import { describe, it, expect } from "vitest";
import {
  canTransition, canResume, changeStage, resumeOrReopen,
  INITIAL_STAGE, type Stage, type StageChange, type RunningStage,
} from "@/core/opportunity/stage";
import { BusinessRuleError } from "@/core/errors";
import { normalize } from "@/core/normalize";
import type { Actor } from "@/core/actor";

const ALL: Stage[] = [
  "tiep_can", "du_dieu_kien", "soan_de_xuat", "thuong_luong",
  "thang", "thua", "tam_dung",
];

// ORACLE — chép TAY từ bảng §5.1 của PRD, KHÔNG suy từ mã đang kiểm.
const ORACLE: ReadonlyArray<string> = [
  "tiep_can>du_dieu_kien", "tiep_can>soan_de_xuat", "tiep_can>thuong_luong",
  "du_dieu_kien>tiep_can", "du_dieu_kien>soan_de_xuat", "du_dieu_kien>thuong_luong",
  "soan_de_xuat>tiep_can", "soan_de_xuat>du_dieu_kien", "soan_de_xuat>thuong_luong",
  "thuong_luong>tiep_can", "thuong_luong>du_dieu_kien", "thuong_luong>soan_de_xuat",
  "tiep_can>tam_dung", "du_dieu_kien>tam_dung",
  "soan_de_xuat>tam_dung", "thuong_luong>tam_dung",
  "tiep_can>thua", "du_dieu_kien>thua", "soan_de_xuat>thua",
  "thuong_luong>thua", "tam_dung>thua",
  "tiep_can>thang", "du_dieu_kien>thang", "soan_de_xuat>thang",
  "thuong_luong>thang", "tam_dung>thang",
];

const sales: Actor = { kind: "human", userId: "u1", role: "sales" };
const admin: Actor = { kind: "human", userId: "u2", role: "admin" };
const machine: Actor = { kind: "system" };
const seed: Actor = { kind: "seed" };

const at = (stage: Stage, carried: RunningStage | null = null): StageChange =>
  ({ stage, latestOpenStage: carried });

/// Hàng HỢP LỆ theo bất biến hai chiều: chỉ ba giai đoạn này mới mang giá trị.
const needsCarry = (s: Stage) => s === "tam_dung" || s === "thang" || s === "thua";
const valid = (s: Stage): StageChange =>
  at(s, needsCarry(s) ? "thuong_luong" : null);

describe("canTransition — quét vét cạn 49 cặp", () => {
  it("oracle có đúng 26 cặp, không trùng", () => {
    expect(new Set(ORACLE).size).toBe(26);
  });

  it("khớp bảng §5.1 trên toàn bộ 49 cặp", () => {
    const lech: string[] = [];
    for (const from of ALL) {
      for (const to of ALL) {
        const mong = ORACLE.includes(`${from}>${to}`);
        const that = canTransition(from, to);
        if (mong !== that) lech.push(`${from}→${to}: mong ${mong}, được ${that}`);
      }
    }
    expect(lech).toEqual([]);
  });

  it("lùi giai đoạn và nhảy cóc ĐỀU ĐƯỢC", () => {
    expect(canTransition("thuong_luong", "du_dieu_kien")).toBe(true);
    expect(canTransition("tiep_can", "thuong_luong")).toBe(true);
  });

  it("`thang` → `thua` bị bác", () => {
    expect(canTransition("thang", "thua")).toBe(false);
  });

  it("`canResume` phủ đúng ba giai đoạn rời đường chạy", () => {
    for (const s of ALL) expect(canResume(s)).toBe(needsCarry(s));
  });

  it("`D44` — giai đoạn khởi đầu là `tiep_can`", () => {
    expect(INITIAL_STAGE).toBe("tiep_can");
  });
});

describe("changeStage — Giai đoạn mở gần nhất", () => {
  it("rời một giai đoạn đang chạy thì ghi chính nó", () => {
    expect(changeStage(sales, at("soan_de_xuat"), "tam_dung"))
      .toEqual({ stage: "tam_dung", latestOpenStage: "soan_de_xuat" });
    expect(changeStage(sales, at("thuong_luong"), "thang"))
      .toEqual({ stage: "thang", latestOpenStage: "thuong_luong" });
  });

  it("đi từ `tam_dung` thì GIỮ NGUYÊN, không ghi đè bằng `tam_dung`", () => {
    expect(changeStage(sales, at("tam_dung", "thuong_luong"), "thua"))
      .toEqual({ stage: "thua", latestOpenStage: "thuong_luong" });
    expect(changeStage(sales, at("tam_dung", "du_dieu_kien"), "thang"))
      .toEqual({ stage: "thang", latestOpenStage: "du_dieu_kien" });
  });

  it("quay lại đường chạy thì xoá dấu", () => {
    expect(changeStage(sales, at("tiep_can"), "thuong_luong").latestOpenStage)
      .toBeNull();
  });

  it("không bao giờ trả `tam_dung` ở cột Giai đoạn mở gần nhất", () => {
    for (const from of ALL) {
      for (const to of ALL) {
        if (!canTransition(from, to)) continue;
        const r = changeStage(sales, valid(from), to);
        expect(r.latestOpenStage).not.toBe("tam_dung");
        // và bất biến hai chiều luôn đúng ở đầu ra
        expect(r.latestOpenStage !== null).toBe(needsCarry(r.stage));
      }
    }
  });
});

describe("changeStage — chặn", () => {
  it("`NFR-14` chặn MÁY trên mọi cặp, kể cả cặp hợp lệ", () => {
    for (const from of ALL) {
      for (const to of ALL) {
        expect(() => changeStage(machine, valid(from), to))
          .toThrowError(/Chỉ người đổi được Giai đoạn/);
      }
    }
  });

  it("`seed` cũng bị chặn — nhánh thứ ba của ActorKind", () => {
    expect(() => changeStage(seed, at("tiep_can"), "du_dieu_kien"))
      .toThrowError(/Chỉ người đổi được Giai đoạn/);
    expect(() => resumeOrReopen(seed, at("thua", "thuong_luong")))
      .toThrowError(/Chỉ người mở lại/);
  });

  it("`from === to` báo đúng nguyên nhân, kể cả trên giai đoạn đã đóng", () => {
    expect(() => changeStage(sales, at("thang", "thuong_luong"), "thang"))
      .toThrowError(/Cơ hội đã ở `thang`/);
  });

  it("đã đóng thì không đi tiếp bằng `changeStage`", () => {
    expect(() => changeStage(sales, at("thang", "thuong_luong"), "tiep_can"))
      .toThrowError(/mở lại phải đi qua resumeOrReopen/);
  });

  it("`tam_dung` → giai đoạn đang chạy tuỳ chọn bị bác", () => {
    expect(() => changeStage(sales, at("tam_dung", "thuong_luong"), "tiep_can"))
      .toThrowError(/không nằm trong bảng §5\.1/);
  });

  it("ba mã của `AD-CR-1` được dùng đúng chỗ", () => {
    const grab = (fn: () => unknown) => {
      try { fn(); } catch (e) { return (e as BusinessRuleError).code; }
      return "KHÔNG NÉM";
    };
    expect(grab(() => changeStage(sales, at("tam_dung", "thuong_luong"), "tiep_can")))
      .toBe("STATE_TRANSITION_NOT_ALLOWED");
    expect(grab(() => changeStage(sales, at("thang", "thuong_luong"), "tiep_can")))
      .toBe("STATE_TARGET_FIXED");
    expect(grab(() => resumeOrReopen(sales, at("thuong_luong"))))
      .toBe("STATE_TARGET_FIXED");
  });
});

describe("resumeOrReopen", () => {
  it("Sales quay lại từ `tam_dung` được", () => {
    expect(resumeOrReopen(sales, at("tam_dung", "soan_de_xuat")))
      .toEqual({ stage: "soan_de_xuat", latestOpenStage: null });
  });

  it("`AD-CR-10` — LÕI KHÔNG canh vai; `D43` là việc của Cổng bước ⑤", () => {
    for (const closed of ["thang", "thua"] as const) {
      expect(resumeOrReopen(sales, at(closed, "thuong_luong")))
        .toEqual({ stage: "thuong_luong", latestOpenStage: null });
      expect(resumeOrReopen(admin, at(closed, "thuong_luong")))
        .toEqual({ stage: "thuong_luong", latestOpenStage: null });
    }
  });

  it("Cơ hội đang chạy thì không có gì để mở lại", () => {
    expect(() => resumeOrReopen(admin, at("thuong_luong")))
      .toThrowError(/không có gì để mở lại/);
  });

  it("phân nhánh theo `stage`, không theo cột hệ quả — hàng hỏng bị bắt", () => {
    // stage đang chạy nhưng có carried: bất biến vỡ. Bản trước đọc cột hệ quả
    // nên sẽ âm thầm chuyển `thuong_luong` → `tiep_can`.
    expect(() => resumeOrReopen(admin, { stage: "thuong_luong", latestOpenStage: "tiep_can" }))
      .toThrowError(/không có gì để mở lại/);
    expect(() => resumeOrReopen(admin, { stage: "thang", latestOpenStage: null }))
      .toThrowError(/dữ liệu hỏng/);
    expect(() => changeStage(sales, { stage: "tiep_can", latestOpenStage: "soan_de_xuat" }, "thua"))
      .toThrowError(/dữ liệu hỏng/);
  });
});

describe("normalize — U+3000 phải sống sót", () => {
  const IDEO = "　";
  const A = "あ"; // あ

  it("không bị cắt ở đầu/cuối chuỗi", () => {
    expect(normalize(IDEO + A + IDEO)).toBe(IDEO + A + IDEO);
  });

  it("không bị cắt ở đầu/cuối MỖI DÒNG", () => {
    expect(normalize("x\n" + IDEO + A + IDEO + "\ny"))
      .toBe("x\n" + IDEO + A + IDEO + "\ny");
  });

  it("vẫn luỹ đẳng", () => {
    const cases = [IDEO + A + IDEO, "a\r\n\r\n\r\n\r\nb", "  x\t\ty  ", "", "\n\n"];
    for (const s of cases) expect(normalize(normalize(s))).toBe(normalize(s));
  });

  it("vẫn cắt dấu cách thường và tab như cũ", () => {
    expect(normalize("  x\t\ty  ")).toBe("x y");
  });
});
