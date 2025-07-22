export async function fetchMyScores(uid) {
  if (!uid) {
    const games = ["cgScores", "bdScores", "goScores"];
    const localScores = {};

    for (const gameKey of games) {
      try {
        const raw = localStorage.getItem(gameKey);
        localScores[gameKey] = raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.warn(`Failed to parse localStorage for ${gameKey}:`, e);
        localScores[gameKey] = {};
      }
    }

    return localScores;
  }

  const res = await fetch(`/api/scores?uid=${uid}`);
  if (!res.ok) throw new Error("Failed to fetch scores");

  const data = await res.json();

  return data;
}