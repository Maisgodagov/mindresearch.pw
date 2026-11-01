import { useEffect } from "react";
import { researcherMetaTags, researcherSeo, researcherStructuredData } from "../../../../api/src/public-methods/landing-seo";
export function LandingMetadata() {
  useEffect(() => {
    const seo = researcherSeo();
    const previousTitle = document.title;
    document.title = seo.title;
    const restore: (() => void)[] = [];
    for (const [attribute, key, value] of researcherMetaTags()) {
      const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      const node = existing ?? document.createElement("meta");
      const previous = node.getAttribute("content");
      node.setAttribute(attribute, key); node.content = value;
      if (!existing) document.head.append(node);
      restore.push(() => { if (!existing) node.remove(); else if(previous !== null) node.content=previous; });
    }
    const existing = document.getElementById("researcher-schema");
    const node = existing ?? document.createElement("script");
    const previous = node.textContent;
    node.id="researcher-schema"; node.setAttribute("type","application/ld+json");
    node.textContent=JSON.stringify(researcherStructuredData());
    if(!existing) document.head.append(node);
    restore.push(()=>{if(!existing)node.remove();else node.textContent=previous;});
    return () => { document.title=previousTitle;restore.forEach(fn=>fn()); };
  }, []);
  return null;
}
