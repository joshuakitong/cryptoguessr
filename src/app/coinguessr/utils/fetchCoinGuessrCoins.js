export async function fetchCoinGuessrCoins() {
  const res = await fetch('/api/coins');
  if (!res.ok) throw new Error("Failed to fetch coins");

  return await res.json();
}