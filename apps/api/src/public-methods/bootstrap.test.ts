import { describe, expect, it } from "vitest";
import { publicDocument } from "./render.js";
import { initialCatalog, definition } from "./model.js";
import { catalogQueryKey, discoverMethods } from "./discovery.js";

const bootstrap = (head: string) => JSON.parse(head.match(/<script id="public-methods-data" type="application\/json">(.*?)<\/script>/s)![1]);
describe("public content bootstrap", () => {
  it("embeds the published article and question count without assessment data", () => {
    const method = initialCatalog[0];
    const value = bootstrap(publicDocument(initialCatalog, method).head);
    expect(value).toEqual({path:`/methods/${method.slug}/`,queryKey:"",data:{method,questionCount:definition(method).questions.length}});
    expect(value.data).not.toHaveProperty("answers");
    expect(value.data).not.toHaveProperty("questions");
  });
  it("keeps filter counts and facets from the full catalogue in the initial snapshot", () => {
    const result = discoverMethods(initialCatalog, {q:"GAD-7"});
    const value = bootstrap(publicDocument(result.items, undefined, {queryKey:"q=GAD-7",data:result}).head);
    expect(value.queryKey).toBe("q=GAD-7");
    expect(value.data.total).toBe(1);
    expect(value.data.catalogTotal).toBe(initialCatalog.length);
    expect(value.data.topics).toEqual(result.topics);
    expect(value.data.items[0].questionCount).toBe(7);
  });
  it("escapes script terminators in publication content", () => {
    const method={...initialCatalog[0],intro:'</script><img src=x onerror=alert(1)>'};
    const head=publicDocument([method],method).head;
    expect(head).not.toContain('</script><img');
    expect(bootstrap(head).data.method.intro).toBe(method.intro);
  });
  it("uses one query key for server and browser, independent of trackers", () => {
    expect(catalogQueryKey(new URLSearchParams('utm_source=x&topic=A&q=hello&topic=A&page=1&section=B'))).toBe('q=hello&section=B&topic=A');
    expect(catalogQueryKey(new URLSearchParams('page=2&topic=A&topic=B'))).toBe('topic=A&topic=B&page=2');
  });
});
