import { describe, it, expect } from "vitest";
import { resultDemoPeople } from "./resultsDemoData";
import { scoreMspss } from "../../../../api/src/scoring/mspss";
describe("fictional respondent results", () => {
  it("has six complete fictional respondents whose visible scores match answers", () => {
    expect(resultDemoPeople).toHaveLength(6);
    expect(new Set(resultDemoPeople.map((p) => p.alias)).size).toBe(6);
    for (const p of resultDemoPeople) {
      expect(p.answered).toBe(
        p.groups.reduce((n, g) => n + g.answers.length, 0),
      );
      const g = p.groups.find((g) => g.code === "test_1")!;
      expect(g.result?.values).toEqual(
        scoreMspss(new Map(g.answers.map((a, i) => [i + 1, Number(a.value)]))),
      );
      expect(g.answers.every((a) => a.displayValue)).toBe(true);
    }
  });
});
