/** Remove redundant numbering from legacy answer labels. */
export function formatOptionLabel(label: string | null | undefined, _value: string): string {
  const text = (label ?? "").trim();
  const cleaned = text.replace(/^\d+\s*[-–—:.)]\s*/u, "").trim();
  return cleaned || text || "Вариант ответа";
}
