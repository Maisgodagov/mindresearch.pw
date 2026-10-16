import { describe, expect, it } from "vitest";
import { ageForProfile } from "./age.js";
import {
  matches,
  criteriaSchema,
  quotaFor,
  listingSchema,
  profileInputSchema,
  type Profile,
} from "./domain.js";
const input = {
  adultConfirmed: true as const,
  age: 29,
  sex: "female" as const,
  education: "higher" as const,
  studying: "no" as const,
  employment: "employed" as const,
  marital: "married" as const,
  children: 1,
  childAges: [4],
};
describe("Participant age and required card fields", () => {
  it("accepts zero children without location or child ages", () => {
    const parsed = profileInputSchema.parse({ ...input, children: 0, childAges: [] });
    expect(parsed.children).toBe(0);
    expect(parsed.childAges).toEqual([]);
    expect(parsed).not.toHaveProperty("country");
    expect(parsed).not.toHaveProperty("region");
  });
  it("increments age only on each recording anniversary, including multiple years", () => {
    const p = { age: 29, ageRecordedAt: "2026-10-16" };
    expect(ageForProfile(p, new Date("2027-10-15T23:59:00Z"))).toBe(29);
    expect(ageForProfile(p, new Date("2027-10-16T00:00:00Z"))).toBe(30);
    expect(ageForProfile(p, new Date("2030-10-16T00:00:00Z"))).toBe(33);
  });
  it("handles leap-day anniversaries and never decrements age before the recording date", () => {
    const p = { age: 25, ageRecordedAt: "2024-02-29" };
    expect(ageForProfile(p, new Date("2025-02-28T12:00:00Z"))).toBe(25);
    expect(ageForProfile(p, new Date("2025-03-01T00:00:00Z"))).toBe(26);
    expect(ageForProfile(p, new Date("2023-01-01T00:00:00Z"))).toBe(25);
  });
  it("reads legacy birth dates and prioritizes the new recorded age", () => {
    expect(
      ageForProfile(
        { birthDate: "1996-10-17" },
        new Date("2026-10-16T12:00:00Z"),
      ),
    ).toBe(29);
    expect(
      ageForProfile(
        { age: 31, ageRecordedAt: "2026-01-01", birthDate: "1996-10-17" },
        new Date("2026-10-16"),
      ),
    ).toBe(31);
  });
  it("uses the annually adjusted age for eligibility and quotas", () => {
    const p: Profile = { ...input, ageRecordedAt: "2026-10-16" };
    const c = criteriaSchema.parse({ ageMin: 30, ageMax: 30 });
    expect(matches(p, c, new Date("2027-10-15"))).toBe("fail");
    expect(matches(p, c, new Date("2027-10-16"))).toBe("pass");
    const l = listingSchema.parse({
      surveyId: "00000000-0000-4000-8000-000000000001",
      description: "Проверка возрастных групп исследования",
      topic: "Тест",
      minutes: 5,
      budget: 1,
      criteria: {},
      quotas: [{ id: "q", label: "30+", ageMin: 30, ageMax: 40, target: 10 }],
    });
    expect(quotaFor(p, l.quotas, new Date("2027-10-15"))).toBeUndefined();
    expect(quotaFor(p, l.quotas, new Date("2027-10-16"))?.id).toBe("q");
  });
  it("accepts two sexes, requires demographic fields and rejects new birth dates", () => {
    expect(profileInputSchema.safeParse(input).success).toBe(true);
    for (const change of [
      { age: 17 },
      { age: 101 },
      { age: undefined },
      { sex: "other" },
      { sex: "private" },
      { education: "private" },
      { employment: "private" },
      { studying: "private" },
      { marital: "private" },
      { birthDate: "1996-01-01" },
    ])
      expect(
        profileInputSchema.safeParse({ ...input, ...change }).success,
      ).toBe(false);
  });
  it("only permits withholding all child information, not unrelated fields", () => {
    expect(
      profileInputSchema.safeParse({ ...input, children: null, childAges: [] })
        .success,
    ).toBe(true);
    expect(
      profileInputSchema.safeParse({ ...input, childAges: [null] }).success,
    ).toBe(false);
  });
});
