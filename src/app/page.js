import Link from "next/link";

const games = [
  { title: "CoinGuessr", href: "/coin-guessr" },
  { title: "Price Prediction", href: "/price-prediction" },
  { title: "Higher/Lower", href: "/higher-or-lower" },
];

export default function Home() {
  return (
    <main className="min-h-screen/2 px-4 sm:px-8 md:px-8 lg:px-52 pb-4 text-white sm:mt-42">
      <div className="w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-12 sm:mb-6">CryptoGuessr</h1>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl w-full">
            {games.map((game) => (
              <Link
                key={game.title}
                href={game.href}
                className="border-2 border-white hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all duration-300 p-6 rounded-lg text-center text-2xl font-semibold shadow-md h-48 flex flex-col justify-center"
              >
                {game.title}
                <div className="text-sm text-gray-400 mt-2">[Image Placeholder]</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
