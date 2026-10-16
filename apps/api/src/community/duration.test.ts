import { expect, it } from "vitest";
import { rewardFor, surveyDurationLabel, surveyDurationMinutes } from "./duration.js";

it("uses the same automatic estimate as the survey card", () => {
  expect(surveyDurationLabel(20)).toBe("до 5 минут");
  expect(surveyDurationMinutes(20)).toBe(5);
  expect(surveyDurationMinutes(180)).toBe(30);
  expect(surveyDurationLabel(208)).toBe("15–35 минут");
  expect(rewardFor(surveyDurationMinutes(208))).toBe(6);
});
it("budgets longer open questions and supports surveys beyond an hour", () => {
  expect(surveyDurationMinutes(Array.from({length:100},()=>({type:'text'})))).toBe(150);
  expect(rewardFor(90)).toBe(9);
  expect(rewardFor(120)).toBe(12);
  expect(rewardFor(240)).toBe(24);
});
it("uses the upper bound of custom minute/hour ranges", () => {
  expect(surveyDurationMinutes(20, { mode: "custom", text: "10–15 минут" })).toBe(15);
  expect(surveyDurationMinutes(20, { mode: "custom", text: "1,5 часа" })).toBe(90);
  expect(surveyDurationMinutes(20, { mode: "custom", text: "несколько минут" })).toBe(5);
});
