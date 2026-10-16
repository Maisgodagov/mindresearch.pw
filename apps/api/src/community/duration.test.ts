import { expect, it } from "vitest";
import { surveyDurationLabel, surveyDurationMinutes } from "./duration.js";

it("uses the same automatic estimate as the survey card", () => {
  expect(surveyDurationLabel(20)).toBe("до 5 минут");
  expect(surveyDurationMinutes(20)).toBe(5);
  expect(surveyDurationMinutes(180)).toBe(15);
});
it("uses the upper bound of custom minute/hour ranges", () => {
  expect(surveyDurationMinutes(20, { mode: "custom", text: "10–15 минут" })).toBe(15);
  expect(surveyDurationMinutes(20, { mode: "custom", text: "1,5 часа" })).toBe(90);
  expect(surveyDurationMinutes(20, { mode: "custom", text: "несколько минут" })).toBe(5);
});
