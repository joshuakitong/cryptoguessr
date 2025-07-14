export function setLocalState(key, value) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getLocalState(key, fallback = null) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  }
  return fallback;
}

export function clearLocalState(key) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}