import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { AnswerGroup } from "../../types";
import { MethodologyInterpretation } from "./index";
import { MethodScoreSummary } from "../MethodScoreSummary";

function makeGroup(code: string, values: Record<string, unknown>): AnswerGroup {
  return {
    id: code,
    code,
    title: code,
    position: 0,
    result: { formulaVersion: "test", values, interpretation: null },
    answers: [],
  };
}

describe("methodology result presentation", () => {
  it("renders compact MSPSS total and level", () => {
    const group = makeGroup("test_1", {
      overall: {
        label: "Поддержка",
        score: 5.25,
        levelLabel: "Умеренная поддержка",
      },
      scales: {},
    });
    const markup = renderToStaticMarkup(<MethodScoreSummary group={group} />);

    expect(markup).toContain("5.25 / 7");
    expect(markup).toContain("Умеренная поддержка");
  });

  it("renders the detailed MSPSS scale profile", () => {
    const group = makeGroup("test_1", {
      overall: {
        label: "Поддержка",
        score: 5.25,
        levelLabel: "Умеренная поддержка",
      },
      scales: {
        family: { label: "Семья", score: 5.5, max: 7, levelLabel: "Высокая" },
      },
    });
    const markup = renderToStaticMarkup(
      <MethodologyInterpretation group={group} />,
    );

    expect(markup).toContain("5.25 из 7");
    expect(markup).toContain("Семья");
    expect(markup).toContain("5.50");
  });

  it("explains the SCCS reference score direction", () => {
    const group = makeGroup("test_3", {
      average: 3.8,
      sum: 45.6,
      reference: { zScore: 1.25, mean: 3.4, sampleSize: 280 },
    });
    const markup = renderToStaticMarkup(
      <MethodologyInterpretation group={group} />,
    );

    expect(markup).toContain("на 1.25 SD выше среднего");
    expect(markup).toContain("N=280");
  });
});
