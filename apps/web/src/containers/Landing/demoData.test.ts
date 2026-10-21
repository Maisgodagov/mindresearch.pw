import { describe, it, expect } from "vitest";
import {
  descriptive,
  correlation,
  demoPeople,
  personValue,
  initialSections,
  previewQuestions,
} from "./demoData";
describe("research demo calculations", () => {
  it("uses sample standard deviation and the middle pair for even samples", () => {
    expect(descriptive([1, 2, 3, 4])).toEqual({
      n: 4,
      mean: 2.5,
      median: 2.5,
      min: 1,
      max: 4,
      sd: Math.sqrt(5 / 3),
    });
    expect(descriptive([])).toBeNull();
    expect(descriptive([2])?.sd).toBeNull();
  });
  it("does not produce a correlation for constant or unmatched data", () => {
    expect(correlation([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1);
    expect(correlation([1, 1, 1], [1, 2, 3])).toBeNull();
    expect(correlation([1, 2, 3], [1, 2])).toBeNull();
  });
  it("uses synthetic participant data and valid source questions", () => {
    expect(
      demoPeople.every(
        (p) =>
          p.id.startsWith("synthetic-") &&
          Number.isFinite(personValue(p, "test_1")),
      ),
    ).toBe(true);
    const questions = previewQuestions(initialSections, "");
    expect(questions).toHaveLength(2);
    expect(questions.every((q) => q.text && q.options.length > 0)).toBe(true);
  });
});
