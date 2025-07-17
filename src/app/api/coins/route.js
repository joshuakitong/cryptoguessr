export async function GET() {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd' +
    '&order=market_cap_desc&per_page=2000&page=1&sparkline=false'
  );
  const data = await res.json();

  const filtered = data.filter(
    coin => /^[A-Za-z\s]+$/.test(coin.name) && coin.name.length < 24
  );

  const shuffled = filtered.sort(() => 0.5 - Math.random());
  const limited = shuffled.slice(0, 10).map(c => c.name.toUpperCase());

  return Response.json(limited);
}