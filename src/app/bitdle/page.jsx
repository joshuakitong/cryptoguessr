"use client";
import useBitdle from "./hooks/useBitdle";
import Lives from "@/app/components/Lives";
import Score from "@/app/components/Score";
import GameOverModal from "@/app/components/GameOverModal";
import { formatBitcoinPrice } from "./utils/formatPrice";

export default function BitdlePage() {
  const {
    currentPrice,
    vote,
    canVote,
    timer,
    lives,
    sessionScore,
    totalScore,
    handleVote,
    backToGameMenu,
    showGameOverModal,
    setShowGameOverModal,
    displayStatusMessage,
  } = useBitdle();

  if (currentPrice === null) {
    return (
      <div className="flex justify-center pt-64">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-[calc(100vh-5.75rem)]">
      <Lives currentLives={lives} totalLives={3} />
      <Score score={sessionScore} />

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-3xl sm:text-4xl font-semibold mt-24">
          Current price:
        </div>
        <div className="text-5xl sm:text-6xl font-bold">
          {currentPrice !== null ? formatBitcoinPrice(currentPrice) : "Loading..."}
        </div>
        <p className="text-lg sm:text-xl">Predict price action of <span className="text-[#f7931a] font-semibold">Bitcoin</span> in <span className="font-mono text-xl font-bold">{timer}s</span></p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleVote("down")}
            disabled={!canVote}
            className={`px-6 py-2 text-xl w-32 rounded bg-red-600 hover:bg-red-700 cursor-pointer transition ${
              vote === "down" ? "ring-4 ring-red-400" : ""
            }`}
          >
            DOWN
          </button>
          <button
            onClick={() => handleVote("up")}
            disabled={!canVote}
            className={`px-6 py-2 text-xl w-32 rounded bg-green-600 hover:bg-green-700 cursor-pointer transition ${
              vote === "up" ? "ring-4 ring-green-400" : ""
            }`}
          >
            UP
          </button>
        </div>

        <div className="mt-4 text-lg sm:text-xl text-center">
          {displayStatusMessage}
        </div>
      </div>

      {showGameOverModal && (
        <GameOverModal
          sessionScore={sessionScore}
          bonusScore={lives * 100}
          totalScore={totalScore}
          message={sessionScore >= 1000 ? "You won the game!" : "Game over!"}
          didWin={sessionScore >= 1000}
          onRestart={backToGameMenu}
          onClose={() => setShowGameOverModal(false)}
        />
      )}
    </div>
  );
}
