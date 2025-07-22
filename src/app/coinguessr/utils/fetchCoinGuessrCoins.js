export async function fetchCoinGuessrCoins() {
  try {
    const res = await fetch("/api/coins");
    if (!res.ok) throw new Error("Failed to fetch coins: Too many requests. Please try again in a minute.");

    return await res.json();
  } catch (err) {
    alert(err.message);
  }
}