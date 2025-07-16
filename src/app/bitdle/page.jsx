"use client";
import useBitdle from "./hooks/useBitdle";
import Lives from "@/app/components/Lives";
import Score from "@/app/components/Score";
import GameOverModal from "@/app/components/GameOverModal";
import { ArrowUp, ArrowDown, ArrowBigUp, ArrowBigDown } from "lucide-react";
import AnimatedNumber from "@/app/components/AnimatedNumber";
import StatusMessage from "./components/AnimatedStatusMessage";

export default function BitdlePage() {
  const {
    currentPrice,
    previousPrice,
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
        <div className="flex flex-col items-center justify-center gap-2 text-center relative">
          <div className="relative inline-block">
            <div className="text-5xl sm:text-6xl font-bold text-white">
              {currentPrice !== null ? (
                <AnimatedNumber
                  value={currentPrice}
                  prefix="$"
                  minDecimals={2}
                />
              ) : (
                "Loading..."
              )}
            </div>

            {currentPrice !== null &&
              previousPrice !== null &&
              currentPrice !== previousPrice && (
                <div
                  className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 text-xs sm:text-sm font-semibold ${
                    currentPrice > previousPrice ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {currentPrice > previousPrice ? (
                    <ArrowUp size={16} className="inline" />
                  ) : (
                    <ArrowDown size={16} className="inline" />
                  )}
                  {((Math.abs(currentPrice - previousPrice) / previousPrice) * 100).toFixed(3)}%
                </div>
              )}
          </div>
        </div>
        <p className="text-lg sm:text-xl">Predict price action of <span className="text-[#f7931a] font-semibold">Bitcoin</span> in <span className="font-mono text-xl font-bold">{timer}s</span></p>
        <div className="flex gap-8 mt-4 scale-90 sm:scale-100">
          <button
            onClick={() => handleVote("down")}
            disabled={!canVote}
            className={`w-26 h-26 flex items-center justify-center rounded-full transition ${
              vote === "down"
                ? "bg-red-700 ring-4 ring-red-400"
                : "bg-red-600 hover:bg-red-700"
            } ${!canVote ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            title="Vote Down"
          >
            <ArrowBigDown className="w-13 h-13 text-red-300 transition-all" />
          </button>

          <button
            onClick={() => handleVote("up")}
            disabled={!canVote}
            className={`w-26 h-26 flex items-center justify-center rounded-full transition ${
              vote === "up"
                ? "bg-green-700 ring-4 ring-green-400"
                : "bg-green-600 hover:bg-green-700"
            } ${!canVote ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            title="Vote Up"
          >
            <ArrowBigUp className="w-13 h-13 text-green-300 transition-all"/>
          </button>
        </div>

        <StatusMessage displayStatusMessage={displayStatusMessage} />
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
