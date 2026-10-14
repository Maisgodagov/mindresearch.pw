import { expect, it } from "vitest";
import { createInstrumentIndex, searchInstruments } from "./search";
import type { Instrument } from "../../types";
const items: Instrument[] = [
  {
    id: "other",
    title: "Авторский опрос",
    description: "В описании упомянута шкала Марлоу—Крауна",
    author: "Другой автор",
    questionCount: 1,
    isVerified: false,
  },
  {
    id: "mc",
    code: "test_1391",
    title: "Шкала мотивации одобрения Марлоу—Крауна (вариант Ханина)",
    description: "Шкала социальной желательности MC-SDS",
    author: "Дуглас Краун, Дэвид Марлоу; адаптация Ю. Л. Ханина",
    questionCount: 20,
    isVerified: true,
  },
  {
    id: "dass",
    title: "Шкала депрессии, тревоги и стресса (DASS-21)",
    description: "Русская версия",
    author: "Фаттахова и Горобец",
    questionCount: 21,
    isVerified: true,
  },
  {
    id: "yo",
    title: "Опросник учёта эмоций",
    description: "Самочувствие",
    questionCount: 3,
    isVerified: true,
    categories: [
      { id: "emotion", label: "Эмоции", group: "Психология", url: "" },
    ],
  },
];
const index = createInstrumentIndex(items);
it.each([
  "Марлоу",
  "Краун",
  "Марлоу краун",
  "Марлоу-краун",
  "Марлоу—Крауна",
  "  МАРЛОУ   КРАУН  ",
  "Краун Марлоу",
  "«Марлоу» – Краун",
  "Марлоу‑Краун",
  "Марлоукраун",
])("finds Marlowe–Crowne for %s", (q) =>
  expect(searchInstruments(index, q)[0].id).toBe("mc"),
);
it.each([
  "Фаттахова стресс",
  "Горобец депресс",
  "DASS21",
  "DASS-21",
  "тревоги стресса",
])("searches across title, author and description for %s", (q) =>
  expect(searchInstruments(index, q)[0].id).toBe("dass"),
);
it("normalizes ё/е, partial words, categories and methodology codes", () => {
  expect(searchInstruments(index, "учета эмоци")[0].id).toBe("yo");
  expect(searchInstruments(index, "психология")[0].id).toBe("yo");
  expect(searchInstruments(index, "test_1391")[0].id).toBe("mc");
});
it("requires every word rather than returning unrelated partial hits", () =>
  expect(searchInstruments(index, "Марлоу депрессия")).toEqual([]));
it("keeps catalogue order for empty queries", () => {
  expect(searchInstruments(index, "  ")).toEqual(items);
  expect(searchInstruments(index, "—")).toEqual(items);
});
it("ranks title matches ahead of incidental description mentions", () =>
  expect(searchInstruments(index, "Марлоу краун").map((i) => i.id)).toEqual([
    "mc",
    "other",
  ]));
