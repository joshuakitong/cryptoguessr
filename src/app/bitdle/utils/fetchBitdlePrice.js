export async function fetchBitdlePrice() {
  try {
    const res = await fetch("/api/bits", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch Bitcoin price: Too many requests. Please try again in a minute.");

    const data = await res.json();
    return data.price;
  } catch (err) {
    alert(err.message);
  }
}
