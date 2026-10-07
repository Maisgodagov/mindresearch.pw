import { useEffect, useRef } from "react";

export function useQuestionTiming(token: string, questionId: string | undefined, enabled: boolean) {
  const sequence = useRef(0);
  const clock = useRef<{ visitId: string; visitSequence: number; activeMs: number; since: number | null; key: string; stopped: boolean; finished: boolean } | null>(null);
  const accumulate = () => {
    const value = clock.current;
    if (!value) return;
    if (value.since !== null) value.activeMs += Math.max(0, performance.now() - value.since);
    value.since = !value.stopped && document.visibilityState === "visible" ? performance.now() : null;
    if (!value.finished) try { sessionStorage.setItem(value.key, JSON.stringify({ visitId: value.visitId, visitSequence: value.visitSequence, activeMs: value.activeMs })); } catch { /* Timing remains available in memory. */ }
  };
  useEffect(() => {
    if (!enabled || !token || !questionId) { clock.current = null; return; }
    const key = `question_timing_${token}_${questionId}`;
    let restored: { visitId: string; visitSequence?: number; activeMs: number } | null = null;
    try { restored = JSON.parse(sessionStorage.getItem(key) ?? "null"); } catch { /* Start a new measurement. */ }
    let visitSequence = restored?.visitSequence;
    if (visitSequence === undefined) {
      const sequenceKey = `question_sequence_${token}`;
      try { visitSequence = Number(sessionStorage.getItem(sequenceKey) ?? 0); sessionStorage.setItem(sequenceKey, String(visitSequence + 1)); }
      catch { visitSequence = sequence.current++; }
    }
    sequence.current = Math.max(sequence.current, visitSequence + 1);
    clock.current = {
      visitSequence,
      key, visitId: restored?.visitId ?? crypto.randomUUID(),
      activeMs: Number.isFinite(restored?.activeMs) ? Math.max(0, restored!.activeMs) : 0,
      since: document.visibilityState === "visible" ? performance.now() : null, stopped: false, finished: false,
    };
    const interval = window.setInterval(accumulate, 1000);
    document.addEventListener("visibilitychange", accumulate);
    window.addEventListener("pagehide", accumulate);
    return () => {
      accumulate(); window.clearInterval(interval);
      document.removeEventListener("visibilitychange", accumulate);
      window.removeEventListener("pagehide", accumulate);
    };
  }, [token, questionId, enabled]);
  return {
    stop() {
      accumulate();
      const value = clock.current;
      if (!value) return undefined;
      value.stopped = true; value.since = null;
      return { visitId: value.visitId, visitSequence: value.visitSequence, activeMs: Math.min(86400000, Math.round(value.activeMs)) };
    },
    resume() {
      const value = clock.current;
      if (value) { value.stopped = false; value.since = document.visibilityState === "visible" ? performance.now() : null; }
    },
    finish() {
      const value = clock.current;
      if (value) { value.finished = true; try { sessionStorage.removeItem(value.key); } catch { /* No stored measurement. */ } }
    },
  };
}
