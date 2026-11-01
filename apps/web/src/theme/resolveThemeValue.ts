/** Canvas and Ant Design need concrete colors; regular UI styles use CSS variables directly. */
export function resolveThemeValue(value: string): string {
  const style = getComputedStyle(document.documentElement);
  let resolved = value;
  for (let depth = 0; depth < 8 && resolved.includes("var(--"); depth++) {
    resolved = resolved.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
      const color = style.getPropertyValue(name).trim();
      if (!color) throw new Error(`Unknown theme color: ${name}`);
      return color;
    });
  }
  return resolved;
}
