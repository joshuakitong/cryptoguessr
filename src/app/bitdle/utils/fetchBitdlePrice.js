export async function fetchBitdlePrice() {
  try {
    const res = await fetch("/api/bits", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch Bitdle price");
    const data = await res.json();
    return data.price;
  } catch (err) {
    console.error("fetchBitdlePrice error:", err);
    return null;
  }
}