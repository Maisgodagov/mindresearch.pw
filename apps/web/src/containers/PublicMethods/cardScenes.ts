import type { PublicResult } from "./types";

export const characters = { none: "Без персонажа", woman: "Женский", man: "Мужской" } as const;
export type Character = keyof typeof characters;
export const characterAtlases = ["atlas", "atlas-2"] as const;
export const characterColumns = 5;
export const layouts = { poster: "Колонка", journal: "Диагональ", tiles: "Мягкий контур" } as const;
export type Layout = keyof typeof layouts;

const scenes = {
  meadow: { label: "Солнечный луг", column: 0, row: 0, dark: false, fill: "#dce3bc" },
  library: { label: "Свет у окна", column: 1, row: 0, dark: false, fill: "#e9d6ae" },
  rain: { label: "Дождливый вечер", column: 0, row: 1, dark: true, fill: "#283d50" },
  dusk: { label: "Горы в сумерках", column: 1, row: 1, dark: true, fill: "#4a405d" },
} as const;
export type Scene = keyof typeof scenes;

const locations = [
  ["Ботанический сад", "Морской берег", "Фруктовый сад", "Горное озеро", "Солнечный двор"],
  ["Читальный зал", "Кафе", "Оранжерея", "Мастерская", "Старый город"],
  ["Дождь за окном", "Вечерние горы", "Улица под дождём", "Синий берег", "Туманный лес"],
] as const;

export function cardChoices(result: PublicResult, seed: string) {
  const allowed = scenesFor(result);
  const row = allowed.includes("meadow") ? 0 : allowed.includes("rain") ? 2 : 1;
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const seedNumber = hash >>> 0;
  const scenesIn = (mood: 0 | 1 | 2) => locations[mood].map((label, column) => ({ label, row: mood, column }));
  const primary = scenesIn(row);
  const offset = seedNumber % primary.length;
  const otherScenes = ([0, 1, 2] as const).filter(mood => mood !== row).flatMap(scenesIn);
  const personCount = characterAtlases.length * characterColumns;
  const person = (hash >>> 8) % personCount;
  const peopleFor = (start: number) => Array.from({ length: personCount },
    (_, index) => (start + index) % personCount);
  return {
    row,
    locations: [...primary.slice(offset), ...primary.slice(0, offset), ...otherScenes],
    people: { woman: peopleFor(person), man: peopleFor(person + 1) },
    character: (hash & 1) === 0 ? "woman" as const : "man" as const,
  };
}
export const cardScenes = scenes;

// These are art directions across possible scores. They are not norms or score interpretations.
const higherResource = new Set([
  "rses-ru-zolotareva-2020-v1", "gses-ru-romek-1996-v1", "mspss-zimet-v1",
  "swls-yelshansky-et-al-2015-direct-sum-v1",
  "shs-lyubomirsky-lepper-osin-leontiev-ru-mean-reverse-4-v1", "bit-ru-kostenko-nabieva-lebedeva-2025-v1",
  "caas-ru-kondratyuk-2021-public-v1", "scs-ru-2020-six-subscale-means-public-v1",
]);
const higherDifficulty = new Set([
  "fomos-ru-ardislamov-2024-six-item-v1", "nmpq-ru-maksimenko-2025-v1",
  "bsmas-ru-kornienko-2023-public-source-v1", "aaq-ii-acbs-russian-educational-public-v1",
  "paq-s-larionow-ru-2024-public-v1", "pps-steel-2010-en-v1", "gps-lay-student-1986-v1",
  "gad-7-ru-zolotareva-2023-public-v1",
]);
export function rangePosition({value,min,max}: PublicResult["scales"][number]) {
  return Number.isFinite(value) && max > min ? Math.max(0,Math.min(1,(value-min)/(max-min))) : null;
}

export function scenesFor(result: PublicResult): readonly Scene[] {
  const neutral = ["library", "dusk"] as const;
  const version = result.method.version;
  const isPhq4 = version === "phq-4-ru-2024-two-subscales-public-v1";
  if ((!isPhq4 && result.presentation === "profile") || !result.scales.length) return neutral;
  const relevant = isPhq4 ? result.scales : result.scales.slice(0,1);
  const positions = relevant.map(rangePosition);
  if (positions.some(position => position === null)) return neutral;
  const position = Math.max(...positions.map(p => p ?? 0));
  if (higherResource.has(version)) {
    if (position >= .67) return ["meadow", "library"];
    if (position <= .33) return ["rain", "dusk"];
  } else if (higherDifficulty.has(version) || isPhq4) {
    if (position >= .67) return ["rain", "dusk"];
    if (position <= .33) return ["meadow", "library"];
  }
  return neutral;
}
