export function getLocalJSON(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const trimmed = String(raw).trim();
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return fallback;
    return JSON.parse(trimmed);
  } catch (err) {
    return fallback;
  }
}
