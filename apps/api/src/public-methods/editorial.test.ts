import { describe, expect, it } from "vitest";
import { calculate, contentSchema, definition, initialCatalog } from "./model.js";

const reviewed = initialCatalog.filter(method => method.resultCopy);
const answerSet = (method: typeof initialCatalog[number]) => {
  const def = definition(method);
  return Object.fromEntries(def.questions.map((question, index) => [
    question.code, Number(question.options![index % question.options!.length].value),
  ]));
};

describe("reviewed public-method explanations", () => {
  it("attaches reviewed copy to every actual scale without changing scoring", () => {
    expect(reviewed).toHaveLength(25);
    for (const method of reviewed) {
      const answers = answerSet(method);
      const current = calculate(definition(method), answers);
      // Absence of resultCopy represents an assessment snapshot created before the editorial update.
      const {resultCopy, ...legacyMethod} = method;
      const legacy = calculate(definition(legacyMethod), answers);
      expect(current.scales.map(({label,value,min,max})=>({label,value,min,max})))
        .toEqual(legacy.scales.map(({label,value,min,max})=>({label,value,min,max})));
      expect(current.explanation).toBe(resultCopy!.summary);
      expect(current.scales.map(scale=>scale.explanation)).toEqual(resultCopy!.scales.map(scale=>scale.explanation));
      expect(current.scales.map(scale=>scale.cardExplanation)).toEqual(resultCopy!.scales.map(scale=>scale.cardExplanation));
      expect(legacy.scales.every(scale=>scale.cardExplanation===undefined)).toBe(true);
      expect(legacy.cardNote).toBeUndefined();
      expect(new Set(current.scales.map(scale=>scale.explanation)).size).toBe(current.scales.length);
      expect(current.method.instruction).toBe(legacy.method.instruction);
    }
  });

  it("rejects missing, reordered or mislabelled scale copy before publication", () => {
    const method = reviewed.find(method=>method.slug==="self-compassion")!;
    const copy = method.resultCopy!;
    expect(()=>definition({...method,resultCopy:{...copy,scales:copy.scales.slice(1)}})).toThrow("Пояснения");
    expect(()=>definition({...method,resultCopy:{...copy,scales:[...copy.scales].reverse()}})).toThrow("Пояснения");
    expect(()=>contentSchema.parse({...method,resultCopy:{...copy,scales:[]}})).toThrow();
    expect(()=>contentSchema.parse({...method,resultCopy:{...copy,cardNote:"a".repeat(241)}})).toThrow();
  });

  it("keeps population and direction caveats in the result snapshot", () => {
    const copy = (slug:string)=>reviewed.find(method=>method.slug===slug)!.resultCopy!;
    expect(copy("career-adaptability").summary).toContain("старше 19");
    expect(copy("social-media-use").summary).toContain("13–18");
    expect(copy("acceptance-action").summary).toContain("validation needed");
    expect(copy("stress-mindset").scales[1].explanation).toContain("меньшее согласие");
    for (const i of [2,4,6]) expect(copy("self-compassion").scales[i].explanation).toContain("без инверсии");
  });
});
