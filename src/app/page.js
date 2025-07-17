import Link from "next/link";
import Image from "next/image";

const games = [
  { title: "CoinGuessr", href: "/coinguessr", image: "/images/main/coinguessr.png" },
  { title: "Bitdle", href: "/bitdle", image: "/images/main/bitdle.png" },
  { title: "Gain Over", href: "/gainover", image: "/images/main/gainover.png" },
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
                className="border-4 border-gray-300 hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all duration-300 py-6 px-2 rounded-lg text-center text-4xl font-bold shadow-md h-56 flex flex-col justify-center items-center"
              >
                {game.title}
                <div className="mt-3">
                  <Image
                    src={game.image}
                    alt={`${game.title} logo`}
                    width={300}
                    height={150}
                    className="mx-auto"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
