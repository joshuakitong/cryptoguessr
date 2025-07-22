export async function fetchGainOverCoins() {
  try {
    const res = await fetch("/api/gains");
    if (!res.ok) throw new Error("Failed to fetch coins: Too many requests. Please try again in a minute.");
    
    return await res.json();
  } catch (err) {
    alert(err.message);
  }
}
