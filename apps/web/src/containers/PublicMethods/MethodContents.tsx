import { useEffect, useState, type MouseEvent } from "react";

const sections = [
  ["about-test", "Что он измеряет"],
  ["before-test", "Как отвечать"],
  ["test-details", "Подсчёт и объяснение"],
  ["test-limits", "Границы результата"],
  ["sources", "Источники и версия"],
] as const;

export function scrollToMethodSection(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(event.currentTarget.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  // Keep a shareable fragment without routing or adding a history entry per section.
  window.history.replaceState(window.history.state, "", event.currentTarget.hash);
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function MethodContents({ slug }: { slug: string }) {
  const [active, setActive] = useState<string>(sections[0][0]);
  useEffect(() => {
    let frame = 0;
    let disposed = false;
    const elements = sections.map(([id]) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const update = () => {
      frame = 0;
      const threshold = Math.min(128, window.innerHeight * 0.22);
      const last = elements.at(-1);
      const atEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const current = atEnd && last && last.getBoundingClientRect().top < window.innerHeight
        ? last
        : elements.filter(element => element.getBoundingClientRect().top <= threshold).at(-1) ?? elements[0];
      if (current) setActive(previous => previous === current.id ? previous : current.id);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    elements.forEach(element => resize.observe(element));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Sections mount after the asynchronous API response; native initial anchor scrolling is too early.
    void document.fonts.ready.then(() => {
      if (disposed) return;
      const target = elements.find(element => `#${element.id}` === window.location.hash);
      target?.scrollIntoView({ behavior: "instant", block: "start" });
      schedule();
    });
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [slug]);

  return <nav className="td-contents" aria-label="На этой странице">
    <span>О тесте</span>
    {sections.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={scrollToMethodSection}>{label}</a>)}
  </nav>;
}
