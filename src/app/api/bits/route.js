export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&precision=2",
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch price" }), {
      status: 500,
    });
  }

  const data = await res.json();
  const price = data?.bitcoin?.usd;

  return new Response(JSON.stringify({ price, timestamp: Date.now() }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}