import { extendedMethods, type StatisticsMethod } from "./extended-methods.js";
export const methods: StatisticsMethod[] = [
  {
    id: "descriptive",
    label: "Описательная статистика",
    kind: "single",
    description:
      "Среднее, медиана, разброс, квартили и доверительный интервал среднего.",
  },
  {
    id: "shapiro",
    label: "Шапиро—Уилк",
    kind: "single",
    description:
      "Проверка отклонения от нормального распределения; 3–5000 наблюдений.",
  },
  {
    id: "t_one",
    label: "Одновыборочный t Стьюдента",
    kind: "single",
    description: "Сравнение среднего с заданным значением μ₀.",
  },
  {
    id: "welch",
    label: "t Уэлча · независимые группы",
    kind: "independent",
    description:
      "Разность средних двух независимых групп без предположения равных дисперсий.",
  },
  {
    id: "mannwhitney",
    label: "U Манна—Уитни",
    kind: "independent",
    description: "Сравнение распределений двух независимых групп.",
  },
  {
    id: "kruskal",
    label: "H Краскала—Уоллиса",
    kind: "multiple",
    description: "Ранговое сравнение нескольких независимых групп.",
  },
  {
    id: "anova",
    label: "Однофакторный ANOVA",
    kind: "multiple",
    description:
      "Классический дисперсионный анализ независимых групп. Требует проверки допущений.",
  },
  {
    id: "t_paired",
    label: "Парный t Стьюдента",
    kind: "paired",
    description:
      "Средняя разность двух связанных показателей одного участника.",
  },
  {
    id: "wilcoxon",
    label: "T Вилкоксона",
    kind: "paired",
    description: "Ранговый анализ парных разностей.",
  },
  {
    id: "sign",
    label: "G-критерий знаков",
    kind: "paired",
    description: "Направление парных изменений, точный биномиальный p.",
  },
  {
    id: "pearson",
    label: "Корреляция Пирсона",
    kind: "paired",
    description: "Линейная связь двух количественных показателей.",
  },
  {
    id: "spearman",
    label: "Корреляция Спирмена",
    kind: "paired",
    description: "Монотонная ранговая связь; в пилоте p асимптотический.",
  },
  {
    id: "kendall",
    label: "Корреляция Кендалла τ-b",
    kind: "paired",
    description: "Ранговая связь с учётом совпадений.",
  },
  ...extendedMethods,
];

export type Condition = {
  question: string;
  title: string;
  values?: (string | number)[];
  min?: number;
  max?: number;
};
export type Person = {
  id: string;
  alias: string;
  age: number | null;
  gender: string | null;
  status: string;
  groups: any[];
};
export type Variable = {
  id: string;
  label: string;
  source: string;
  version: string | null;
  categories?: { code: number; label: string }[];
};
export const fail = (message: string, status = 400): never => {
  throw Object.assign(new Error(message), { status });
};
const finite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const numericAnswer = (value: unknown) =>
  finite(value)
    ? value
    : typeof value === "string" &&
        value.trim() &&
        Number.isFinite(Number(value))
      ? Number(value)
      : undefined;

export function matches(
  person: Person,
  conditions: Condition[],
  completedOnly: boolean,
) {
  if (completedOnly && person.status !== "completed") return false;
  return conditions.every((condition) => {
    const answer = person.groups
      .flatMap((g) => g.answers)
      .find((a) => a.questionId === condition.question);
    const value = condition.question === "__age" ? person.age : answer?.value;
    if (condition.min !== undefined || condition.max !== undefined) {
      const number = numericAnswer(value);
      return (
        number !== undefined &&
        (condition.min === undefined || number >= condition.min) &&
        (condition.max === undefined || number <= condition.max)
      );
    }
    return (Array.isArray(value) ? value : [value]).some((v) =>
      condition.values?.some((expected) => String(expected) === String(v)),
    );
  });
}

export function analyticalData(people: Person[]) {
  const variables = new Map<string, Variable>();
  const rows: Record<string, Record<string, number>> = {};
  for (const person of people) {
    const row: Record<string, number> = {};
    const add = (
      id: string,
      label: string,
      value: unknown,
      source: string,
      version: string | null = null,
    ) => {
      if (!finite(value)) return;
      variables.set(id, { id, label, source, version });
      row[id] = value;
    };
    add("age", "Возраст", person.age, "Анкета");
    for (const group of person.groups) {
      const version = group.result?.formulaVersion ?? null;
      const root = group.result?.values;
      if (root && root.complete !== false) {
        const score = (value: any, path: string, label: string) => {
          if (finite(value))
            add(
              `score:${group.id}:${path}:${version}`,
              `${group.title} · ${label}`,
              value,
              group.title,
              version,
            );
          else if (value && typeof value === "object") {
            for (const field of ["score", "average", "sum", "value"])
              if (finite(value[field])) {
                add(
                  `score:${group.id}:${path}.${field}:${version}`,
                  `${group.title} · ${value.label ?? label} · ${{ score: "балл", average: "средний балл", sum: "сумма", value: "значение" }[field]}`,
                  value[field],
                  group.title,
                  version,
                );
                break;
              }
          }
        };
        for (const key of ["score", "average", "sum", "overall"])
          score(
            root[key],
            key,
            {
              score: "Общий балл",
              average: "Средний балл",
              sum: "Сумма",
              overall: "Общий показатель",
            }[key]!,
          );
        for (const container of ["scales", "domains", "facets"])
          for (const [key, value] of Object.entries(root[container] ?? {}))
            score(value, `${container}.${key}`, key);
      }
      // Raw numeric answers are explicit variables, not accidentally mixed into scores.
      for (const answer of group.answers)
        if (answer.type === "number")
          add(
            `answer:${answer.questionId}`,
            `${group.title} · ${answer.question} (ответ)`,
            numericAnswer(answer.value),
            "Числовой ответ",
          );
    }
    rows[person.id] = row;
  }
  // Explicit categorical variables have a shared codebook across the entire survey.
  const categorical = new Map<string, { label: string; values: Map<string, string> }>();
  for (const person of people) {
    if (person.gender) {
      const entry = categorical.get("gender") ?? { label: "Пол", values: new Map<string, string>() };
      entry.values.set(person.id, person.gender);
      categorical.set("gender", entry);
    }
    for (const group of person.groups) for (const answer of group.answers) {
      if (!["choice", "single", "select", "radio", "boolean", "yesno"].includes(answer.type) || answer.value == null || Array.isArray(answer.value)) continue;
      const id = `category:${answer.questionId}`;
      const entry = categorical.get(id) ?? { label: `${group.title} · ${answer.question} (категория)`, values: new Map<string, string>() };
      entry.values.set(person.id, String(answer.displayValue ?? answer.value));
      categorical.set(id, entry);
    }
  }
  for (const [id, entry] of categorical) {
    const categories = [...new Set(entry.values.values())].sort().map((label, code) => ({ code, label }));
    if (categories.length > 50) continue;
    variables.set(id, { id, label: entry.label, source: "Категориальный ответ", version: null, categories });
    for (const [personId, label] of entry.values) rows[personId][id] = categories.find(c => c.label === label)!.code;
  }
  return { variables: [...variables.values()], rows };
}

export function prepareInput(
  methodId: string,
  groups: {
    sample: { id: string; name: string; revision: number; members: string[] };
    variable: Variable;
  }[],
  people: Person[],
  rows: Record<string, Record<string, number>>,
  manual: Record<string, number>,
) {
  const method =
    methods.find((m) => m.id === methodId) ??
    fail("Метод пока не поддерживается.");
  if (
    groups.length !==
      (method.kind === "single"
        ? 1
        : ["multiple", "repeated", "multivariate", "paired_groups"].includes(method.kind)
          ? groups.length
          : 2) ||
    groups.length < (method.minInputs ?? (["multiple", "repeated", "multivariate", "paired_groups"].includes(method.kind) ? 2 : 1)) ||
    groups.length > (method.maxInputs ?? 16)
  )
    fail("Проверьте количество групп/показателей.");
  const available = new Map(people.map((p) => [p.id, p]));
  if (
    (method.kind === "independent" || method.kind === "multiple") &&
    groups.some((g) => g.variable.id !== groups[0].variable.id)
  )
    fail(
      "Для независимого сравнения выберите один и тот же показатель во всех группах.",
    );
  const categoricalRoles: Record<string, number[]> = {
    frequency: [0], chisquare_gof: [0], chisquare: [0, 1], fisher: [0, 1], mcnemar: [0, 1],
    binomial: [0], phi_star: [0, 1], pointbiserial: [0], biserial: [0], eta: [0], factorial_anova: [1, 2, 3, 4], manova: [0], box_m: [0], discriminant: [0], discriminant_stepwise: [0], mixed_anova: [0], sample_size_proportion: [0],
  };
  groups.forEach((g, index) => {
    if (g.variable.categories && !categoricalRoles[methodId]?.includes(index))
      fail("В этой роли нужен числовой показатель. Коды категорий не являются количественными значениями.");
  });
  const seen = new Set<string>();
  const source = groups.map(({ sample, variable }, index) => {
    const included: {
      id: string;
      alias: string;
      value: number;
      manual: boolean;
    }[] = [];
    const excluded: { id: string; reason: string }[] = [];
    for (const id of sample.members) {
      const person = available.get(id);
      const override = manual[`${index}:${id}`];
      const value = override ?? rows[id]?.[variable.id];
      if (!person || !finite(value)) {
        excluded.push({
          id,
          reason: person
            ? "Нет числового значения показателя"
            : "Участник недоступен или удалён",
        });
        continue;
      }
      if (method.kind === "independent" || method.kind === "multiple") {
        if (seen.has(id))
          fail(
            "Независимые группы пересекаются. Уберите повторяющихся участников или выберите связанный метод.",
          );
        seen.add(id);
      }
      included.push({
        id,
        alias: person.alias,
        value,
        manual: override !== undefined,
      });
    }
    return {
      sampleId: sample.id,
      revision: sample.revision,
      label: `${sample.name} · ${variable.label}`,
      variable,
      included,
      excluded,
    };
  });
  if (["paired", "repeated", "multivariate"].includes(method.kind)) {
    if (groups.some(g => g.sample.id !== groups[0].sample.id || g.sample.revision !== groups[0].sample.revision))
      fail("Для связанного анализа выберите одну версию выборки и разные показатели.");
    if (new Set(groups.map(g => g.variable.id)).size !== groups.length)
      fail("Выберите разные показатели.");
    const paired = new Set(source[0].included.filter(row =>
      source.every(g => g.included.some(other => other.id === row.id))).map(row => row.id));
    for (const group of source) {
      group.excluded.push(...group.included.filter(row => !paired.has(row.id)).map(row => ({
        id: row.id, reason: "Нет полного набора связанных показателей",
      })));
      group.included = group.included.filter(row => paired.has(row.id)).sort((a, b) => a.id.localeCompare(b.id));
    }
  }
  if (method.kind === "paired_groups") {
    const first = new Set<string>();
    for (const [left, right] of [[0, 1], [2, 3]]) {
      if (groups[left].sample.id !== groups[right].sample.id || groups[left].sample.revision !== groups[right].sample.revision)
        fail("Каждая корреляция должна использовать одну версию своей выборки.");
      if (groups[left].variable.id === groups[right].variable.id) fail("В каждой паре нужны разные показатели.");
      const ids = new Set(source[left].included.filter(row => source[right].included.some(other => other.id === row.id)).map(row => row.id));
      if (left === 0) for (const id of ids) first.add(id);
      else if ([...ids].some(id => first.has(id))) fail("Для сравнения независимых корреляций выборки не должны пересекаться.");
      for (const index of [left, right]) {
        source[index].excluded.push(...source[index].included.filter(row => !ids.has(row.id)).map(row => ({ id: row.id, reason: "Нет полного набора связанных показателей" })));
        source[index].included = source[index].included.filter(row => ids.has(row.id)).sort((a, b) => a.id.localeCompare(b.id));
      }
    }
  }
  if (source.some((g) => g.included.length < 2))
    fail(
      "Нужно не менее двух пригодных наблюдений в каждой группе. Для корреляции — не менее трёх пар.",
    );
  if (source.reduce((n, g) => n + g.included.length, 0) > 20000)
    fail(
      "Пилот поддерживает до 20 000 значений за один расчёт. Уменьшите число групп.",
    );
  return source;
}
