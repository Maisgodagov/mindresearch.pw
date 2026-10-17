import { describe, expect, it } from "vitest";
import {
  ageAt,
  criteriaSchema,
  listingSchema,
  matches,
  profileSchema,
  quotaFor,
  rewardDecision,
  rewardFor,
  screeningPass,
  type Profile,
} from "./domain.js";

const profile: Profile = {
  adultConfirmed: true,
  birthDate: "1996-10-17",
  sex: "female",
  country: "Россия",
  region: "Москва",
  education: "higher",
  studying: "no",
  employment: "employed",
  marital: "married",
  children: 2,
  childAges: [3, 7],
};
const date = new Date("2026-10-16T12:00:00Z");
const base = {
  surveyId: "00000000-0000-4000-8000-000000000001",
  description: "Исследование отношений в семье и родительства.",
  topic: "Семья",
  minutes: 10,
  criteria: {},
  budget: 8,
  quotas: [{ id: "all", label: "Все", target: 100 }],
};
describe("Community eligibility and quotas", () => {
  it("calculates age on birthday boundaries, independent of host timezone", () => {
    expect(ageAt(profile.birthDate!, date)).toBe(29);
    expect(ageAt(profile.birthDate!, new Date("2026-10-17T00:00:00Z"))).toBe(
      30,
    );
  });
  it("requires all criteria but accepts any selected value within a field", () => {
    const c = criteriaSchema.parse({
      ageMin: 25,
      ageMax: 35,
      sex: ["female", "other"],
      childrenMin: 2,
      education: ["higher", "postgraduate"],
      country: "РОССИЯ",
      studying: "no",
    });
    expect(matches(profile, c, date)).toBe("pass");
    expect(matches({ ...profile, children: 1 }, c, date)).toBe("fail");
    expect(matches({ ...profile, sex: "male" }, c, date)).toBe("fail");
  });
  it("does not interpret withheld data as a passing or failing answer", () => {
    const c = criteriaSchema.parse({ ageMin: 25, childrenMin: 1 });
    expect(matches({ ...profile, birthDate: null }, c, date)).toBe("unknown");
    expect(matches({ ...profile, children: null }, c, date)).toBe("unknown");
    expect(
      matches(
        { ...profile, region: "Не указывать" },
        criteriaSchema.parse({ region: "Москва" }),
        date,
      ),
    ).toBe("unknown");
    expect(
      matches(
        { ...profile, children: null, birthDate: null },
        criteriaSchema.parse({}),
        date,
      ),
    ).toBe("pass");
  });
  it("uses inclusive boundaries and rejects inverted ranges", () => {
    expect(
      matches(
        profile,
        criteriaSchema.parse({
          ageMin: 29,
          ageMax: 29,
          childrenMin: 2,
          childrenMax: 2,
        }),
        date,
      ),
    ).toBe("pass");
    expect(criteriaSchema.safeParse({ ageMin: 40, ageMax: 20 }).success).toBe(
      false,
    );
    expect(
      criteriaSchema.safeParse({ childrenMin: 4, childrenMax: 2 }).success,
    ).toBe(false);
  });
  it("selects one disjoint quota and permits a general quota without revealing age", () => {
    const l = listingSchema.parse({
      ...base,
      quotas: [
        {
          id: "young",
          label: "Младшая",
          sex: "female",
          ageMin: 18,
          ageMax: 29,
          target: 25,
        },
        {
          id: "older",
          label: "Старшая",
          sex: "female",
          ageMin: 30,
          ageMax: 45,
          target: 25,
        },
      ],
    });
    expect(quotaFor(profile, l.quotas, date)?.id).toBe("young");
    expect(
      quotaFor({ ...profile, sex: "male" }, l.quotas, date),
    ).toBeUndefined();
    expect(
      quotaFor(
        { ...profile, birthDate: null },
        listingSchema.parse(base).quotas,
        date,
      )?.id,
    ).toBe("all");
  });
  it("rejects overlapping quotas, duplicate ids and impossible age intervals", () => {
    expect(
      listingSchema.safeParse({
        ...base,
        quotas: [
          { id: "a", label: "A", target: 10 },
          { id: "b", label: "B", sex: "female", target: 10 },
        ],
      }).success,
    ).toBe(false);
    expect(
      listingSchema.safeParse({
        ...base,
        quotas: [
          { id: "a", label: "A", sex: "male", target: 10 },
          { id: "a", label: "B", sex: "female", target: 10 },
        ],
      }).success,
    ).toBe(false);
    expect(
      listingSchema.safeParse({
        ...base,
        quotas: [{ id: "a", label: "A", ageMin: 40, ageMax: 30, target: 10 }],
      }).success,
    ).toBe(false);
  });
  it("limits screening and validates accepted option indices", () => {
    const question = {
      id: "teacher",
      question: "Работаете учителем?",
      options: ["Да", "Нет"],
      accepted: [0],
    };
    expect(screeningPass([question], { teacher: 0 })).toBe(true);
    expect(screeningPass([question], { teacher: 1 })).toBe(false);
    expect(screeningPass([question], {})).toBe(false);
    expect(
      listingSchema.safeParse({
        ...base,
        screening: [{ ...question, accepted: [2] }],
      }).success,
    ).toBe(false);
    expect(
      listingSchema.safeParse({
        ...base,
        screening: Array.from({ length: 6 }, (_, i) => ({
          ...question,
          id: `q${i}`,
        })),
      }).success,
    ).toBe(false);
  });
  it("requires adulthood confirmation and consistent child data", () => {
    expect(profileSchema.safeParse(profile).success).toBe(true);
    expect(
      profileSchema.safeParse({ ...profile, adultConfirmed: false }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({ ...profile, birthDate: "2020-01-01" }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({ ...profile, childAges: [3] }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...profile,
        children: null,
        childAges: [],
        birthDate: null,
      }).success,
    ).toBe(true);
  });
});
describe("Community reward policy", () => {
  const input = { seconds: 600, minutes: 10 };
  it("rewards completion without a statistical baseline", () =>
    expect(rewardDecision(input).status).toBe("credited"));
  it("does not punish unusual answers or a single concerning domain", () =>
    expect(
      rewardDecision({
        ...input,
        quality: { independent_concerning_domains: 1, strong_flag_count: 3 },
      }).status,
    ).toBe("credited"));
  it('ignores statistical quality and declared duration',()=>{
    expect(rewardDecision({...input,seconds:5,quality:{independent_concerning_domains:2,strong_flag_count:2}}).status).toBe('credited');
  });
  it('rejects mass subsecond answers, not isolated quick answers',()=>{
    expect(rewardDecision({...input,answerTimes:[999,999,999,2000,2000,2000,2000,2000,2000,2000]}).status).toBe('rejected');
    expect(rewardDecision({...input,answerTimes:[999,999,2000]}).status).toBe('credited');
    expect(rewardDecision({...input,answerTimes:Array(10).fill(1000)}).status).toBe('credited');
    expect(rewardDecision({...input,answerTimes:[999,999,999,...Array(8).fill(2000)]}).status).toBe('credited');
    expect(rewardDecision({...input,answerTimes:[null,null,null]}).status).toBe('credited');
    expect(rewardDecision({...input,seconds:2,answerTimes:[null,null,null]}).status).toBe('rejected');
  });
  it.each([
    { duplicate: true },
    { eligibility: "fail" },
    { cohort: "admin_test" },
    { deleted: true },
  ])("rejects an objectively excluded participation: %j", (exclusion) =>
    expect(rewardDecision({ ...input, ...exclusion }).status).toBe("rejected"),
  );
  it("scales reward with the declared duration", () =>
    expect([1, 5, 6, 15, 16, 30, 31, 60].map(rewardFor)).toEqual([
      1, 1, 2, 2, 4, 4, 6, 6,
    ]));
});
