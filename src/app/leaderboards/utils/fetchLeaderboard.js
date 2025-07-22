export async function fetchLeaderboard(gameKey, timeKey) {
  const res = await fetch(`/api/leaders?gameKey=${gameKey}&timeKey=${timeKey}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return await res.json();
}