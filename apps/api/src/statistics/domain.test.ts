import { describe, it, expect } from "vitest";
import {
  analyticalData,
  matches,
  prepareInput,
  type Person,
} from "./domain.js";
const person = (
  id: string,
  age: number | null,
  status = "completed",
): Person => ({ id, alias: id, age, gender: null, status, groups: [] });
const variable = {
  id: "age",
  label: "Возраст",
  source: "Анкета",
  version: null,
};
const sample = (id: string, members: string[]) => ({
  id,
  name: id,
  revision: 1,
  members,
});

describe("Statistical inputs", () => {
  it("aligns a complete multivariate block across every column and rejects arbitrary category arithmetic", () => {
    const people = [person("a", 20), person("b", 30), person("c", 40)];
    const columns = ["x", "y", "z"].map(id => ({ sample: sample("s", ["c", "b", "a"]), variable: { ...variable, id } }));
    const output = prepareInput("partial", columns, people, { a: { x: 0, y: 4, z: 5 }, b: { x: 2, y: 5 }, c: { x: 3, y: 6, z: 7 } }, {});
    expect(output.map(g => g.included.map(row => row.id))).toEqual([["a", "c"], ["a", "c"], ["a", "c"]]);
    expect(() => prepareInput("partial", [{ ...columns[0], variable: { ...columns[0].variable, categories: [{ code: 0, label: "Category" }] } }, ...columns.slice(1)], people, {}, {})).toThrow("числовой показатель");
  });
  it("creates a consistent categorical codebook without changing respondent answers", () => {
    const people = [{ ...person("a", 20), gender: "Женский" }, { ...person("b", 30), gender: "Мужской" }];
    const output = analyticalData(people);
    const gender = output.variables.find(v => v.id === "gender")!;
    expect(gender.categories).toHaveLength(2);
    for (const p of people) expect(gender.categories?.find(c => c.code === output.rows[p.id].gender)?.label).toBe(p.gender);
    expect(people[0].gender).toBe("Женский");
  });
  it("pairs independent correlations within samples, then rejects overlap between samples", () => {
    const people = [person("a", 20), person("b", 30), person("c", 40), person("d", 50)];
    const rows = Object.fromEntries(people.map((p, i) => [p.id, { x: i, y: i + 2 }]));
    const columns = ["s", "s", "s2", "s2"].map((id, i) => ({ sample: sample(id, i < 2 ? ["b", "a"] : ["d", "c"]), variable: { ...variable, id: i % 2 ? "y" : "x" } }));
    const output = prepareInput("compare_independent_correlations", columns, people, rows, {});
    expect(output.map(g => g.included.map(row => row.id))).toEqual([["a", "b"], ["a", "b"], ["c", "d"], ["c", "d"]]);
    columns[2].sample.members = columns[3].sample.members = ["a", "b"];
    expect(() => prepareInput("compare_independent_correlations", columns, people, rows, {})).toThrow("не должны пересекаться");
  });
  it("keeps selection conditions and completion status independent of pagination", () => {
    const conditions = [
      { question: "__age", title: "Возраст", min: 20, max: 40 },
    ];
    expect(
      [
        person("a", 19),
        person("b", 20),
        person("c", 40),
        person("d", 41),
        person("e", 25, "in_progress"),
        person("f", null),
      ]
        .filter((p) => matches(p, conditions, true))
        .map((p) => p.id),
    ).toEqual(["b", "c"]);
  });
  it("matches raw multiple-choice codes, not a changed display label", () => {
    const p = person("a", 20);
    p.groups = [
      {
        answers: [
          { questionId: "q", value: ["one", "two"], displayValue: "changed" },
        ],
      },
    ];
    expect(
      matches(
        p,
        [{ question: "q", title: "Old label", values: ["two"] }],
        true,
      ),
    ).toBe(true);
  });
  it("separates repeated sections and scoring versions and excludes incomplete scores/metadata", () => {
    const p = person("a", 20);
    p.groups = [
      {
        id: "first",
        title: "Method",
        answers: [],
        result: {
          formulaVersion: "v1",
          values: {
            complete: true,
            answered: 10,
            max: 20,
            overall: { score: 5 },
            domains: { x: { label: "Domain", average: 2 } },
          },
        },
      },
      {
        id: "second",
        title: "Method",
        answers: [],
        result: { formulaVersion: "v2", values: { score: 7 } },
      },
      {
        id: "third",
        answers: [],
        result: { values: { complete: false, score: 99 } },
      },
    ];
    const data = analyticalData([p]);
    expect(data.rows.a).toEqual({
      age: 20,
      "score:first:overall.score:v1": 5,
      "score:first:domains.x.average:v1": 2,
      "score:second:score:v2": 7,
    });
  });
  it("blocks overlap between independent groups and mismatched paired group versions", () => {
    const people = [person("a", 20), person("b", 30)];
    const rows = analyticalData(people).rows;
    expect(() =>
      prepareInput(
        "welch",
        [
          { sample: sample("s", ["a", "b"]), variable },
          { sample: sample("s2", ["a", "b"]), variable },
        ],
        people,
        rows,
        {},
      ),
    ).toThrow("пересекаются");
    expect(() =>
      prepareInput(
        "t_paired",
        [
          { sample: sample("s", ["a", "b"]), variable },
          {
            sample: sample("s2", ["a", "b"]),
            variable: { ...variable, id: "other" },
          },
        ],
        people,
        rows,
        {},
      ),
    ).toThrow("одну версию");
  });
  it("aligns full pairs by ID, never by position; preserves zeros and explains missing data", () => {
    const people = [
      person("c", null),
      person("a", 20),
      person("b", 30),
      person("d", 40),
    ];
    const a = { ...variable, id: "x" },
      b = { ...variable, id: "y" };
    const output = prepareInput(
      "pearson",
      [
        { sample: sample("s", ["c", "b", "a", "d"]), variable: a },
        { sample: sample("s", ["c", "b", "a", "d"]), variable: b },
      ],
      people,
      { a: { x: 0, y: 4 }, b: { x: 2, y: 5 }, c: { x: 3 }, d: { y: 7 } },
      {},
    );
    expect(output.map((g) => g.included.map((p) => p.id))).toEqual([
      ["a", "b"],
      ["a", "b"],
    ]);
    expect(output[0].included[0].value).toBe(0);
    expect(output.every((g) => g.excluded.length === 2)).toBe(true);
  });
  it("records manual missing-value additions without mutating the source", () => {
    const people = [person("a", 20), person("b", null)];
    const rows = analyticalData(people).rows;
    const output = prepareInput(
      "descriptive",
      [{ sample: sample("s", ["a", "b"]), variable }],
      people,
      rows,
      { "0:b": 0 },
    );
    expect(output[0].included[1]).toMatchObject({
      id: "b",
      value: 0,
      manual: true,
    });
    expect(rows.b.age).toBeUndefined();
  });
});
