export async function GET() {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd' +
    '&order=market_cap_desc&per_page=1000&page=1&sparkline=false' +
    '&price_change_percentage=24h,7d,30d,1y'
  ); 
  const allCoins = await res.json();

  const shuffled = allCoins.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 26);

  const transformed = selected.map((coin) => ({
    id: coin.id,
    name: coin.name,
    image: coin.image,
    current_price: coin.current_price,
    price_change_percentage_24h: coin.price_change_percentage_24h_in_currency,
    price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
    price_change_percentage_30d: coin.price_change_percentage_30d_in_currency,
    price_change_percentage_1y: coin.price_change_percentage_1y_in_currency,
  }));

  return Response.json(transformed.filter((coin) =>
    coin.name && coin.image && typeof coin.current_price === "number"
  ));
}