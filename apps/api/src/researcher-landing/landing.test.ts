import { describe,it,expect } from "vitest";
import { researcherDocument } from "./landing.js";
import { injectDocument } from "./render.js";
import content from "../data/researcherLanding.json" with {type:"json"};
describe("researcher landing document",()=>{
 it("serves real capability text and source metadata without JavaScript",()=>{const doc=researcherDocument();expect(doc.head).toContain('https://mindresearch.pro/for-researchers');expect(doc.body.match(/<h1>/g)).toHaveLength(1);for(const feature of content.features)expect(doc.body).toContain(feature.title);for(const [question] of content.faq)expect(doc.body).toContain(question);expect(doc.head).not.toContain('AggregateRating');const html=injectDocument('<html><head><title>Old</title></head><body><div id="root"></div></body></html>',doc);expect(html).not.toContain('<title>Old</title>');expect(html).toContain(content.description);});
});
