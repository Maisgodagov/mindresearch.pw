import { createHash } from "node:crypto";
import { z } from "zod";
import catalog from "./catalog.json" with { type: "json" };
import survey from "../data/survey.json" with { type: "json" };
import { rsesInstrument } from "../data/rses.js";
import { gsesInstrument } from "../data/gses.js";
import { scoreRses } from "../scoring/rses.js";
import { scoreGses } from "../scoring/gses.js";
import { scoreMspss } from "../scoring/mspss.js";
import { methodology as swls } from "../data/methodologies/method-2462.js";
import { methodology as shs } from "../data/methodologies/method-2433.js";
import { bitRuInstrument, bitRuScoring } from "../data/bitRu.js";
import { calculateConfigurableScores } from "../scoring/configurable.js";
import type { SeedSection } from "../types.js";

const text = (max: number) => z.string().trim().min(1).max(max);
export const contentSchema = z
  .object({
    slug: z.enum([
      "rosenberg-self-esteem",
      "general-self-efficacy",
      "perceived-social-support",
      "satisfaction-with-life",
      "subjective-happiness",
      "brief-thriving",
    ]),
    code: z.enum(["test_17", "test_19", "test_1", "test_2480", "test_2451", "test_59"]),
    title: text(120),
    name: text(180),
    abbreviation: text(20),
    topic: text(80),
    minutes: text(30),
    version: text(100),
    intro: text(800),
    seoTitle: text(160).optional(),
    seoDescription: text(350).optional(),
    audience: text(1200),
    instruction: text(1200),
    sections: z
      .array(z.object({ title: text(160), text: text(6000) }).strict())
      .min(1)
      .max(12),
    limitations: text(1800),
    rights: text(1800),
    sources: z
      .array(
        z
          .object({
            title: text(500),
            url: z
              .string()
              .url()
              .max(2048)
              .refine((v) => v.startsWith("https://"), "Нужна ссылка HTTPS"),
          })
          .strict(),
      )
      .min(1)
      .max(15),
  })
  .strict();
export type PublicMethod = z.infer<typeof contentSchema>;
export const initialCatalog = catalog.map((item) => contentSchema.parse(item));
export type Definition = {
  method: PublicMethod;
  questions: SeedSection["questions"];
  revision: string;
};
export type Scale = {
  label: string;
  value: number;
  min: number;
  max: number;
  explanation: string;
};
export type PublicResult = {
  method: PublicMethod;
  revision: string;
  completedAt: string;
  scales: Scale[];
  explanation: string;
};
export const failure = (status: number, message: string) =>
  Object.assign(new Error(message), { status });
export function definition(method: PublicMethod): Definition {
  const original = initialCatalog.find((item) => item.slug === method.slug);
  if (
    !original ||
    method.code !== original.code ||
    method.version !== original.version
  )
    throw failure(
      400,
      "Код и версия методики не могут изменяться через редактор публикации",
    );
  const instruments: Record<string, SeedSection | undefined> = {
    test_17: rsesInstrument,
    test_19: gsesInstrument,
    test_1: survey.find((item) => item.code === "test_1") as SeedSection | undefined,
    test_2480: swls.instrument,
    test_2451: shs.instrument,
    test_59: bitRuInstrument,
  };
  const instrument = instruments[method.code];
  if (!instrument) throw failure(400, "Не найден бланк публичной методики");
  const snapshot = { method, questions: instrument.questions };
  return {
    ...snapshot,
    revision: createHash("sha256")
      .update(JSON.stringify(snapshot))
      .digest("hex"),
  };
}
export const answersSchema = z.record(
  z.string().min(1).max(100),
  z.number().int().min(0).max(7),
);
export function validateAnswers(
  def: Definition,
  answers: Record<string, number>,
  complete = false,
) {
  const questions = new Map(def.questions.map((q) => [q.code, q]));
  for (const [code, value] of Object.entries(answers)) {
    const question = questions.get(code);
    if (
      !question ||
      !question.options?.some((option) => Number(option.value) === value)
    )
      throw failure(400, "Ответ не соответствует вопросу");
  }
  if (complete && def.questions.some((q) => !Object.hasOwn(answers, q.code)))
    throw failure(400, "Ответьте на все вопросы перед расчётом");
}
export function calculate(
  def: Definition,
  answers: Record<string, number>,
  completedAt = new Date().toISOString(),
): PublicResult {
  validateAnswers(def, answers, true);
  const input = new Map(def.questions.map((q, i) => [i + 1, answers[q.code]]));
  let scales: Scale[];
  let explanation: string;
  if (def.method.code === "test_17") {
    const score = scoreRses(input);
    if (!score) throw failure(400, "Не удалось рассчитать показатель");
    scales = [
      {
        label: "Отношение к себе",
        value: score.score,
        min: 0,
        max: 30,
        explanation:
          "Чем выше балл, тем более положительное отношение к себе отражено в ответах.",
      },
    ];
    explanation =
      "Это показатель глобальной самооценки. Мы не присваиваем ему универсальный нормативный уровень: для такого вывода нужны подходящие нормы конкретной аудитории.";
  } else if (def.method.code === "test_19") {
    const score = scoreGses(input);
    if (!score) throw failure(400, "Не удалось рассчитать показатель");
    scales = [
      {
        label: "Общая самоэффективность",
        value: score.score,
        min: 10,
        max: 40,
        explanation:
          "Чем выше сумма, тем сильнее выражена уверенность в способности справляться с трудностями.",
      },
    ];
    explanation =
      "Шкала описывает уверенность в своих возможностях. Здесь нет универсального порога «нормы»: балл не определяет, справитесь ли вы с конкретной задачей.";
  } else if (def.method.code === "test_1") {
    const score = scoreMspss(input);
    if (!score) throw failure(400, "Не удалось рассчитать показатели");
    scales = [score.overall, ...Object.values(score.scales)].map((s) => ({
      label: s.label,
      value: s.score,
      min: 1,
      max: 7,
      explanation:
        s.levelLabel +
        ". Это ориентир по шкале ответов, не популяционная норма.",
    }));
    explanation =
      "Общий показатель — среднее всех ответов. Остальные шкалы помогают увидеть, насколько доступной ощущается поддержка из разных источников. Значимый другой — важный для вас человек.";
  } else {
    const variants = {
      test_2480: { scoring: swls.scoringConfig!, key: "total", label: "Удовлетворённость жизнью", min: 5, max: 35,
        meaning: "Чем выше балл, тем больше удовлетворённость жизнью отражена в ответах.",
        explanation: "Шкала описывает вашу общую оценку жизни по собственным критериям. Балл не является диагнозом или универсальной оценкой того, насколько хорошо вы живёте." },
      test_2451: { scoring: shs.scoringConfig!, key: "shs", label: "Субъективное счастье", min: 1, max: 7,
        meaning: "Чем выше балл, тем более счастливым человеком вы описываете себя.",
        explanation: "Это средний балл четырёх вопросов с обратным кодированием последнего. Он описывает ваше восприятие счастья, а не процент счастья и не нормативный уровень." },
      test_59: { scoring: bitRuScoring, key: "thriving", label: "Психологическое благополучие", min: 10, max: 50,
        meaning: "Чем выше балл, тем больше признаков психологического благополучия отражено в ответах.",
        explanation: "Общий показатель объединяет ответы о смысле, отношениях, энергии и достижении целей. Краткая версия не оценивает каждую область отдельно. Универсальный порог нормы не применяется." },
    };
    const variant = variants[def.method.code as keyof typeof variants];
    if (!variant) throw failure(400, "Не найден расчёт публичной методики");
    const score = calculateConfigurableScores(variant.scoring, Object.fromEntries(input));
    if (!score || !Number.isFinite(score[variant.key])) throw failure(400, "Не удалось рассчитать показатель");
    scales = [{ label: variant.label, value: score[variant.key], min: variant.min, max: variant.max, explanation: variant.meaning }];
    explanation = variant.explanation;
  }
  return {
    method: def.method,
    revision: def.revision,
    completedAt,
    scales,
    explanation,
  };
}
