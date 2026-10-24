import { useEffect } from "react";
import content from "../../../../api/src/data/researcherLanding.json";
export function LandingMetadata() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = content.title;
    const restore: (() => void)[] = [];
    for (const [attribute, key, value] of [
      ["name", "description", content.description],
      ["property", "og:title", content.title],
      ["property", "og:description", content.description],
      ["property", "og:url", "https://mindresearch.pro/for-researchers"],
      ["property", "og:type", "website"],
    ]) {
      const existing = document.head.querySelector<HTMLMetaElement>(
          `meta[${attribute}="${key}"]`,
        ),
        node = existing ?? document.createElement("meta"),
        previous = node.getAttribute("content");
      node.setAttribute(attribute, key);
      node.content = value;
      if (!existing) document.head.append(node);
      restore.push(() => {
        if (!existing) node.remove();
        else if (previous !== null) node.content = previous;
        else node.removeAttribute("content");
      });
    }
    return () => {
      document.title = previousTitle;
      restore.forEach((fn) => fn());
    };
  }, []);
  return null;
}
