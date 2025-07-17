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

export function getHasPlayedToday(key) {
  const allScores = getLocalState(key, {});
  const today = getTodayGMT8DateString();
  return Object.hasOwn(allScores, today);
}

export function getTodayScore(key) {
  const allScores = getLocalState(key, {});
  const today = getTodayGMT8DateString();
  return allScores.hasOwnProperty(today) ? allScores[today] : null;
}

export function getTotalScore() {
  let total = 0;

  if (typeof window !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.endsWith("Scores")) {
        try {
          const scores = JSON.parse(localStorage.getItem(key));
          if (scores && typeof scores === "object") {
            total += Object.values(scores).reduce((sum, score) => sum + score, 0);
          }
        } catch (e) {
          console.warn(`Failed to parse scores from ${key}`, e);
        }
      }
    }
  }

  return total;
}

export function saveSessionScore(score, key) {
  const allScores = getLocalState(key, {});
  const today = getTodayGMT8DateString();
  allScores[today] = score;
  localStorage.setItem(key, JSON.stringify(allScores));
}