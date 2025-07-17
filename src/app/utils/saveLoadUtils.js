export function getTodayGMT8DateString() {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 8);
  return now.toISOString().split("T")[0];
}

export function getLocalState(key, fallback = null) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  }
  return fallback;
}

export function saveSessionScore(score, key) {
  const allScores = getLocalState(key, {});
  const today = getTodayGMT8DateString();
  allScores[today] = score;
  localStorage.setItem(key, JSON.stringify(allScores));
}

export function getTotalScore(key) {
  const allScores = getLocalState(key, {});
  return Object.values(allScores).reduce((sum, score) => sum + score, 0);
}

export function hasPlayedToday(key) {
  const allScores = getLocalState(key, {});
  const today = getTodayGMT8DateString();
  return Object.hasOwn(allScores, today);
}
