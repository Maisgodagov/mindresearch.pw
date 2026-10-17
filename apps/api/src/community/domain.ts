import { z } from "zod";
import { ageAt, ageForProfile } from "./age.js";
export { ageAt, ageForProfile } from "./age.js";

export const choices = {
  sex: ["female", "male", "other", "private"],
  education: [
    "school",
    "college",
    "university_student",
    "higher",
    "postgraduate",
    "private",
  ],
  employment: [
    "employed",
    "self_employed",
    "student",
    "unemployed",
    "retired",
    "parental_leave",
    "private",
  ],
  marital: [
    "single",
    "relationship",
    "married",
    "divorced",
    "widowed",
    "private",
  ],
} as const;
const text = z.string().trim().min(1).max(160);
export const profileSchema = z
  .object({
    adultConfirmed: z.literal(true),
    birthDate: z.iso.date().nullable().optional(),
    age: z.number().int().min(18).max(100).optional(),
    ageRecordedAt: z.iso.date().optional(),
    sex: z.enum(choices.sex),
    country: text.optional(),
    region: text.optional(),
    education: z.enum(choices.education),
    studying: z.enum(["yes", "no", "private"]),
    employment: z.enum(choices.employment),
    marital: z.enum(choices.marital),
    children: z.number().int().min(0).max(30).nullable(),
    childAges: z.array(z.number().int().min(0).max(100).nullable()).max(30),
  })
  .superRefine((p, ctx) => {
    if (p.birthDate && (ageAt(p.birthDate) < 18 || ageAt(p.birthDate) > 100))
      ctx.addIssue({
        code: "custom",
        message: "Участие доступно с 18 лет. Проверьте дату рождения.",
        path: ["birthDate"],
      });
    if (p.childAges.length !== (p.children ?? 0))
      ctx.addIssue({
        code: "custom",
        message: "Укажите возраст каждого ребёнка или выберите «Не указывать».",
        path: ["childAges"],
      });
  });
export type Profile = z.infer<typeof profileSchema>;
// New submissions are mandatory except for information about children.
// The wider read schema above preserves already saved cards and snapshots.
export const profileInputSchema = profileSchema
  .safeExtend({
    age: z.number().int().min(18).max(100),
    birthDate: z.never().optional(),
    sex: z.enum(["female", "male"]),
    education: z.enum([
      "school",
      "college",
      "university_student",
      "higher",
      "postgraduate",
    ]),
    studying: z.enum(["yes", "no"]),
    employment: z.enum([
      "employed",
      "self_employed",
      "student",
      "unemployed",
      "retired",
      "parental_leave",
    ]),
    marital: z.enum([
      "single",
      "relationship",
      "married",
      "divorced",
      "widowed",
    ]),
    childAges: z.array(z.number().int().min(0).max(100)).max(30),
  });
export const criteriaSchema = z
  .object({
    ageMin: z.number().int().min(18).max(100).optional(),
    ageMax: z.number().int().min(18).max(100).optional(),
    sex: z
      .array(z.enum(["female", "male", "other"]))
      .max(3)
      .default([]),
    childrenMin: z.number().int().min(0).max(30).optional(),
    childrenMax: z.number().int().min(0).max(30).optional(),
    country: z.string().trim().max(160).optional(),
    region: z.string().trim().max(160).optional(),
    education: z.array(z.enum(choices.education)).max(6).default([]),
    employment: z.array(z.enum(choices.employment)).max(7).default([]),
    marital: z.array(z.enum(choices.marital)).max(6).default([]),
    studying: z.enum(["yes", "no"]).optional(),
  })
  .superRefine((c, ctx) => {
    if (
      (c.ageMin ?? 18) > (c.ageMax ?? 100) ||
      (c.childrenMin ?? 0) > (c.childrenMax ?? 30)
    )
      ctx.addIssue({
        code: "custom",
        message: "Минимум не может превышать максимум.",
      });
  });
export type Criteria = z.infer<typeof criteriaSchema>;
export const screeningSchema = z
  .object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,40}$/),
    question: z.string().trim().min(3).max(300),
    options: z.array(z.string().trim().min(1).max(160)).min(2).max(8),
    accepted: z.array(z.number().int().min(0).max(7)).min(1).max(8),
  })
  .superRefine((s, ctx) => {
    if (
      s.accepted.some((n) => n >= s.options.length) ||
      new Set(s.options).size !== s.options.length
    )
      ctx.addIssue({
        code: "custom",
        message: "Проверьте варианты отборочного вопроса.",
      });
  });
const quotaSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]{1,40}$/),
  label: text,
  sex: z.enum(["female", "male", "other"]).optional(),
  ageMin: z.number().int().min(18).max(100).default(18),
  ageMax: z.number().int().min(18).max(100).default(100),
  target: z.number().int().min(1).max(1000),
});
export const listingSchema = z
  .object({
    surveyId: z.string().uuid(),
    description: z.string().trim().min(20).max(1500),
    topic: z.string().trim().min(2).max(80),
    sensitive: z.string().trim().max(300).default(""),
    minutes: z.number().int().min(1).max(240),
    criteria: criteriaSchema,
    screening: z.array(screeningSchema).max(5).default([]),
    quotas: z.array(quotaSchema).min(1).max(12),
    budget: z.number().int().min(1).max(10000),
  })
  .superRefine((l, ctx) => {
    if (
      new Set(l.quotas.map((q) => q.id)).size !== l.quotas.length ||
      new Set(l.screening.map((q) => q.id)).size !== l.screening.length
    )
      ctx.addIssue({
        code: "custom",
        message: "Повторяющиеся идентификаторы.",
      });
    for (let i = 0; i < l.quotas.length; i++) {
      const a = l.quotas[i];
      if (a.ageMin > a.ageMax)
        ctx.addIssue({
          code: "custom",
          message: "Проверьте возрастные границы групп.",
        });
      for (const b of l.quotas.slice(i + 1)) {
        if (
          (!a.sex || !b.sex || a.sex === b.sex) &&
          Math.max(a.ageMin, b.ageMin) <= Math.min(a.ageMax, b.ageMax)
        )
          ctx.addIssue({
            code: "custom",
            message: "Группы квот не должны пересекаться.",
          });
      }
    }
  });
export type Listing = z.infer<typeof listingSchema>;
export { rewardFor } from "./duration.js";
const known = (v: unknown) =>
  v !== null &&
  v !== undefined &&
  !["private", "не указывать", "предпочитаю не указывать"].includes(
    String(v).toLocaleLowerCase("ru"),
  );
export function matches(
  p: Profile,
  c: Criteria,
  today = new Date(),
): "pass" | "unknown" | "fail" {
  let unknown = false;
  const check = (value: unknown, valid: (v: any) => boolean) => {
    if (!known(value)) unknown = true;
    else if (!valid(value)) return false;
    return true;
  };
  const age = ageForProfile(p, today);
  if (
    (c.ageMin !== undefined || c.ageMax !== undefined) &&
    !check(age, (a) => a >= (c.ageMin ?? 18) && a <= (c.ageMax ?? 100))
  )
    return "fail";
  if (
    (c.childrenMin !== undefined || c.childrenMax !== undefined) &&
    !check(
      p.children,
      (a) => a >= (c.childrenMin ?? 0) && a <= (c.childrenMax ?? 30),
    )
  )
    return "fail";
  for (const key of ["sex", "education", "employment", "marital"] as const)
    if (
      c[key].length &&
      !check(p[key], (v) => (c[key] as string[]).includes(v))
    )
      return "fail";
  for (const key of ["country", "region", "studying"] as const)
    if (
      c[key] &&
      !check(
        p[key],
        (v) =>
          String(v).toLocaleLowerCase("ru") === c[key]!.toLocaleLowerCase("ru"),
      )
    )
      return "fail";
  return unknown ? "unknown" : "pass";
}
export function quotaFor(
  p: Profile,
  quotas: Listing["quotas"],
  today = new Date(),
) {
  return quotas.find(
    (q) =>
      (!q.sex || q.sex === p.sex) &&
      ((q.ageMin === 18 && q.ageMax === 100) ||
        (ageForProfile(p, today) !== null &&
          ageForProfile(p, today)! >= q.ageMin &&
          ageForProfile(p, today)! <= q.ageMax)),
  );
}
export function screeningPass(
  questions: Listing["screening"],
  answers: Record<string, number>,
) {
  return questions.every(
    (q) =>
      Number.isInteger(answers[q.id]) && q.accepted.includes(answers[q.id]),
  );
}
export function rewardDecision(input: {
  duplicate?: boolean;
  eligibility?: string;
  cohort?: string;
  deleted?: boolean;
  seconds: number;
  minutes: number;
  quality?: any;
  answerTimes?: (number|null)[];
}) {
  if (
    input.deleted ||
    input.duplicate ||
    input.eligibility === "fail" ||
    input.cohort === "admin_test"
  )
    return {
      status: "rejected",
      reason:
        "Прохождение исключено: тестовая группа, подтверждённый повтор или несоответствие условиям.",
    };
  const times=input.answerTimes??[];
  const fast=times.filter(ms=>ms!==null&&ms<1000).length;
  if(fast>=3 && fast/Math.max(1,times.length)>=0.3)
    return {status:'rejected',reason:`Прохождение не зачтено: ${fast} из ${times.length} ответов даны быстрее секунды.`};
  if(times.length>=3 && Number.isFinite(input.seconds) && input.seconds>=0 && input.seconds<times.length)
    return {status:'rejected',reason:'Прохождение не зачтено: в среднем на ответ затрачено меньше секунды.'};
  return {status:'credited',reason:'Прохождение зачтено. Баллы начислены.'};
}