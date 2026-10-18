import { expect, it, vi } from "vitest";
vi.mock("../db.js", () => ({ db: {} }));
import { calculateStatistics } from "./service.js";

it("runs the deployed JSON subprocess protocol and returns finite numeric results with Unicode trace", async () => {
  const result = await calculateStatistics({
    method: "descriptive",
    alpha: 0.05,
    groups: [{ label: "Проверка", values: [1, 2, 3, 4] }],
  });
  expect(result.summary[0].mean).toBe(2.5);
  expect(result.formula).toContain("Σ");
  expect(result.scipy).toBe("1.17.1");
}, 30000);

it("propagates an undefined statistical test as a useful error rather than saving a successful NaN result", async () => {
  await expect(
    calculateStatistics({
      method: "pearson",
      alpha: 0.05,
      groups: [
        { label: "X", values: [1, 1, 1] },
        { label: "Y", values: [2, 3, 4] },
      ],
    }),
  ).rejects.toThrow("вариативность");
}, 30000);
