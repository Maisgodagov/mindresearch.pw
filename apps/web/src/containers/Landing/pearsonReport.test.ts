import { describe,it,expect } from "vitest";
import fixture from "./pearsonReport.json";
import {correlation,descriptive} from "./demoData";
describe("landing Pearson report",()=>{
 it("shows actual engine output matching its disclosed synthetic observations",()=>{const [a,b]=fixture.request.groups;expect(fixture.request.method).toBe("pearson");expect(a.values).toHaveLength(12);expect(b.values).toHaveLength(12);expect(fixture.result.statistic).toBeCloseTo(correlation(a.values,b.values)!,12);expect(fixture.result.p).toBeCloseTo(.000992779074537107,12);expect(fixture.result.ci[0]).toBeLessThan(fixture.result.statistic);expect(fixture.result.ci[1]).toBeGreaterThan(fixture.result.statistic);for(const [i,g]of fixture.request.groups.entries()){expect(fixture.result.summary[i].mean).toBeCloseTo(descriptive(g.values)!.mean,12);}expect(fixture.result.formula).toContain("Σ");});
});
