import Link from "next/link";

const games = [
  { title: "CoinGuessr", href: "/coinguessr" },
  { title: "Bitcoin Predict", href: "/bitcoinpredict" },
  { title: "Gain Over", href: "/gainover" },
];

export default function Home() {
  return (
    <main className="min-h-screen/2 px-4 md:mt-42 sm:mt-0">
      <div className="w-full mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-12 sm:mb-6">CryptoGuessr</h1>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {games.map((game) => (
              <Link
                key={game.title}
                href={game.href}
                className="border-2 border-white hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all duration-300 p-6 rounded-lg text-center text-2xl font-semibold shadow-md h-56 flex flex-col justify-center"
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
