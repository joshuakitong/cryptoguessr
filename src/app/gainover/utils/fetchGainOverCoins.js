export async function fetchGainOverCoins() {
  const res = await fetch("/api/gains");
  if (!res.ok) throw new Error("Failed to fetch coins");
  
  return await res.json();
}
