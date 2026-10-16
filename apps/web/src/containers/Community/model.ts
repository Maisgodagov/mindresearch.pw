export const labels: Record<string, string> = {
  female: "Женщины",
  male: "Мужчины",
  other: "Другой",
  private: "Предпочитаю не указывать",
  school: "Среднее",
  college: "Среднее профессиональное",
  university_student: "Неоконченное высшее",
  higher: "Высшее",
  postgraduate: "Послевузовское",
  employed: "Работаю по найму",
  self_employed: "Работаю на себя",
  student: "Учусь",
  unemployed: "Не работаю",
  retired: "На пенсии",
  parental_leave: "В отпуске по уходу за ребёнком",
  single: "Не состою в отношениях",
  relationship: "В отношениях",
  married: "В браке",
  divorced: "В разводе",
  widowed: "Вдовец / вдова",
  yes: "Да",
  no: "Нет",
};
export const options = (keys: string[], privateOption = false) =>
  [...keys, ...(privateOption ? ["private"] : [])].map((value) => ({
    value,
    label: labels[value] ?? value,
  }));
export const profileFields = {
  sex: ["female", "male", "other"],
  education: [
    "school",
    "college",
    "university_student",
    "higher",
    "postgraduate",
  ],
  employment: [
    "employed",
    "self_employed",
    "student",
    "unemployed",
    "retired",
    "parental_leave",
  ],
  marital: ["single", "relationship", "married", "divorced", "widowed"],
};
export const statusLabels: Record<string, string> = {
  reserved: "Место зарезервировано",
  pending: "На проверке",
  review: "Нужна дополнительная проверка",
  credited: "Баллы начислены",
  rejected: "Баллы не начислены",
  expired: "Резерв истёк",
  screened_out: "Другая группа участников",
};
export const rewardFor = (n: number) =>
  n <= 5 ? 1 : n <= 15 ? 2 : n <= 30 ? 4 : 6;
export function criteriaText(c: any = {}) {
  const parts = [];
  if (c.ageMin !== undefined || c.ageMax !== undefined)
    parts.push(`Возраст: ${c.ageMin ?? 18}–${c.ageMax ?? 100} лет`);
  for (const k of ["sex", "education", "employment", "marital"])
    if (c[k]?.length)
      parts.push(c[k].map((v: string) => labels[v]).join(" / "));
  if (c.childrenMin !== undefined || c.childrenMax !== undefined)
    parts.push(`Детей: ${c.childrenMin ?? 0}–${c.childrenMax ?? 30}`);
  if (c.country) parts.push(c.country);
  if (c.region) parts.push(c.region);
  if (c.studying)
    parts.push(c.studying === "yes" ? "Учится сейчас" : "Не учится сейчас");
  return parts.join(" · ") || "Любые участники от 18 лет";
}
export const dateLabel = (date: string) =>
  new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
