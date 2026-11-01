import styled from "styled-components";
import { Button } from "../ui";
import { setAnalyticsConsent, useAnalyticsConsent } from "../analyticsConsent";

const Surface = styled.aside`
  position: fixed; z-index: 1200; bottom: 20px; left: 50%; transform: translateX(-50%);
  width: min(720px, calc(100% - 32px)); padding: 24px; border-radius: 16px;
  color: var(--color-ink); background: var(--color-surface);
  box-shadow: 0 8px 36px var(--color-brand-alpha-200);
  h2 { margin: 0 0 12px; font-size: 20px; font-weight: 650; }
  p { margin: 0 0 16px; font-size: 14px; line-height: 1.65; }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; }
  @media(max-width: 480px) { bottom: 12px; padding: 20px; max-height: calc(100dvh - 24px); overflow-y: auto; .actions { flex-direction: column; } }
`;
export function CookieConsent() {
  const consent = useAnalyticsConsent();
  if (consent !== null) return null;
  return (
    <Surface aria-labelledby="cookie-consent-title" data-analytics-private>
      <h2 id="cookie-consent-title">Мы используем cookies</h2>
      <p>Cookies помогают платформе работать лучше.</p>
      <div className="actions">
        <Button type="primary" onClick={() => setAnalyticsConsent("allow")}>Разрешить</Button>
        <Button onClick={() => setAnalyticsConsent("deny")}>Отказаться</Button>
      </div>
    </Surface>
  );
}
