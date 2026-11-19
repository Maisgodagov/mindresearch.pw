// Only published article/catalog data is embedded. Never put assessment data here.
export function publicBootstrap<T>(path: string, queryKey = ""): T | null {
  try {
    const text = document.getElementById("public-methods-data")?.textContent;
    if (!text) return null;
    const snapshot = JSON.parse(text);
    return snapshot.path === path && snapshot.queryKey === queryKey ? snapshot.data as T : null;
  } catch { return null; }
}
