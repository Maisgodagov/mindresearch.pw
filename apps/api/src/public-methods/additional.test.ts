import { describe, it, expect } from "vitest";
import { initialCatalog, definition, calculate, validateAnswers } from "./model.js";
import { additionalInstruments } from "./additional.js";
import { withdrawnMethodologyCodes } from "../data/withdrawnMethodologies.js";

const additions = initialCatalog.filter(m => additionalInstruments[m.code]);
const result = (code: string, values: number | number[]) => {
  const method = additions.find(m => m.code === code)!;
  const def = definition(method);
  const answers = Object.fromEntries(def.questions.map((q, i) => [q.code, typeof values === "number" ? values : values[i]]));
  return calculate(def, answers);
};
const values = (code: string, answers: number | number[]) => result(code, answers).scales.map(s => s.value);

describe("additional public versions", () => {
  it("uses the registered keys for the three new public versions", () => {
    expect(values("test_39", Array.from({length:25}, (_, i) => Math.floor(i / 5) + 1))).toEqual([1,2,3,4,5]);
    expect(values("test_40", [0,1,2,3,4,4])).toEqual([14]);
    expect(values("test_576", 0)).toEqual([8,0,0,0]);
    expect(values("test_576", 2)).toEqual([14,8,8,8]);
  });
  it("registers distinct nonwithdrawn instruments with immutable snapshots and complete articles", () => {
    expect(additions).toHaveLength(17);
    expect(new Set(additions.map(m => m.code)).size).toBe(17);
    for (const m of additions) {
      expect(withdrawnMethodologyCodes).not.toContain(m.code);
      expect(m.sections.length).toBeGreaterThanOrEqual(5);
      expect(m.sections.some(s => s.title.includes("Авторы"))).toBe(true);
      expect(m.sources.every(s => s.url.startsWith("https://"))).toBe(true);
      const def = definition(m);
      expect(def.questions.length).toBeGreaterThan(0);
      expect(def.revision).toBe(definition(m).revision);
      expect(() => definition({ ...m, version: m.version + "other" })).toThrow();
      expect(() => validateAnswers(def, {}, true)).toThrow();
      const answer = { [def.questions[0].code]: 99 };
      expect(() => validateAnswers(def, answer)).toThrow();
    }
  });
  it("TIPI uses pair means rather than pair sums, including all five inverse items", () => {
    expect(values("test_14", 1)).toEqual([4,4,4,4,4]);
    expect(values("test_14", 7)).toEqual([4,4,4,4,4]);
    expect(values("test_14", [7,6,5,4,3,2,1,7,6,5])).toEqual([6.5,1.5,3,5,3]);
    expect(values("test_14", [7,1,7,1,7,1,7,1,7,1])).toEqual([7,7,7,7,7]);
    expect(values("test_14", [1,7,1,7,1,7,1,7,1,7])).toEqual([1,1,1,1,1]);
    expect(result("test_14",4).presentation).toBe("profile");
  });
  it("IAF preserves three means and the opposite meaning of control", () => {
    expect(values("test_24",1)).toEqual([1,1,1]);
    expect(values("test_24",5)).toEqual([5,5,5]);
    // Authorship (1+4+3+5+5)/5; interest (3+5+4+2+3)/5; control (2+1+2+1+4)/5.
    expect(values("test_24",Array.from({length:15},(_,i)=>i%5+1))).toEqual([3.6,3.4,2]);
    expect(result("test_24",3).scales[2].explanation).toContain("давлению");
  });
  it("SMM-G has two sums and an explicitly reverse-coded second scale", () => {
    expect(values("test_829",0)).toEqual([0,16]);
    expect(values("test_829",4)).toEqual([16,0]);
    expect(values("test_829",[0,4,1,3,2,2,4,1])).toEqual([10,9]);
    expect(result("test_829",2).scales[1].explanation).toContain("меньшее согласие");
  });
  it("belonging keeps the published reversed key and unequal ranges", () => {
    expect(values("test_44",1)).toEqual([36,9,22]);
    expect(values("test_44",7)).toEqual([12,15,10]);
    expect(values("test_44",[1,1,1,1,1,1,1,1,7,7,1,7,7])).toEqual([36,9,22]);
    expect(result("test_44",4).scales.map(s=>[s.min,s.max])).toEqual([[6,42],[3,21],[4,28]]);
    const reverse = [1,3,4,5,7,8,10,11,13];
    const low = Array.from({length:13},(_,i)=>reverse.includes(i+1)?7:1);
    expect(values("test_44",low)).toEqual([6,3,4]);
    expect(values("test_44",low.map(v=>8-v))).toEqual([42,21,28]);
  });
  it("CAV separates own aggression from victimization", () => {
    expect(values("test_29",0)).toEqual([0,0]);
    expect(values("test_29",4)).toEqual([48,48]);
    expect(values("test_29",[...Array(12).fill(1),...Array(12).fill(3)])).toEqual([12,36]);
  });
  it("CAAS returns the real total first and four separate subscales", () => {
    expect(values("test_23",1)).toEqual([24,6,6,6,6]);
    expect(values("test_23",5)).toEqual([120,30,30,30,30]);
    expect(values("test_23",Array.from({length:24},(_,i)=>i%5+1))).toEqual([70,16,17,18,19]);
    expect(result("test_23",1).explanation).toContain("старше 19");
  });
  it("SCS weights six means equally and leaves negative subscales in their raw direction", () => {
    const reversed = [1,2,4,6,8,11,13,16,18,20,21,24,25];
    const high = Array.from({length:26},(_,i)=>reversed.includes(i+1)?1:5);
    expect(values("test_2434",high)).toEqual([5,5,1,5,1,5,1]);
    expect(values("test_2434",high.map(v=>6-v))).toEqual([1,1,5,1,5,1,5]);
    expect(values("test_2434",3)).toEqual([3,3,3,3,3,3,3]);
    // One positive answer changes a five-item mean by .4; total by .4/6, NOT 2/26.
    const mixed = Array(26).fill(3); mixed[4]=5;
    expect(values("test_2434",mixed)[0]).toBeCloseTo(3 + .4/6, 12);
    expect(values("test_2434",mixed)[0]).not.toBeCloseTo(3 + 2/26, 5);
  });
  it("AAQ-II reports its actual unvalidated ACBS version without claiming Yasin's validation", () => {
    expect(values("test_1168",1)).toEqual([7]);
    expect(values("test_1168",7)).toEqual([49]);
    expect(values("test_1168",[1,2,3,4,5,6,7])).toEqual([28]);
    expect(result("test_1168",4).explanation).toContain("validation needed");
  });
  it("GAD-7 and PHQ-4 use the two-week forms and separate PHQ sums", () => {
    expect(values("test_918",0)).toEqual([0]);
    expect(values("test_918",3)).toEqual([21]);
    expect(values("test_918",[0,1,2,3,0,1,2])).toEqual([9]);
    expect(values("test_1616",0)).toEqual([0,0]);
    expect(values("test_1616",3)).toEqual([6,6]);
    expect(values("test_1616",[1,2,2,3])).toEqual([3,5]);
    expect(result("test_1616",1).presentation).toBe("profile");
  });
});
