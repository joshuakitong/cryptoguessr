"use client";
import useHigherGains from "./hooks/useHigherGains";
import Lives from "@/app/components/Lives";
import Score from "@/app/components/Score";
import GameOverModal from "@/app/components/GameOverModal";
import CryptoCompareBox from "./components/CryptoCompareBox";

export default function HigherGainsPage() {
  const {
    leftCoin,
    rightCoin,
    metric,
    lives,
    sessionScore,
    totalScore,
    revealed,
    handleChoice,
    resetGame,
    setShowGameOverModal,
    showGameOverModal,
  } = useHigherGains();

  if (!leftCoin || !rightCoin || !metric) {
    return (
      <div className="flex justify-center pt-20">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Lives currentLives={lives} totalLives={5} />
      <Score score={sessionScore} />
      <p className="text-white text-md mb-2">
        Which coin has higher <strong>{metric.label}</strong>?
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <CryptoCompareBox
          coin={leftCoin}
          side="left"
          onClick={() => handleChoice("left")}
          revealed={revealed}
          metric={metric.key}
        />
        <CryptoCompareBox
          coin={rightCoin}
          side="right"
          onClick={() => handleChoice("right")}
          revealed={revealed}
          metric={metric.key}
        />
      </div>
      {showGameOverModal && (
        <GameOverModal
          sessionScore={sessionScore}
          bonusScore={lives * 100}
          totalScore={totalScore}
          message={sessionScore >= 1000 ? "You won the game!" : "Game over!"}
          didWin={sessionScore >= 1000}
          onRestart={resetGame}
          onClose={() => setShowGameOverModal(false)}
        />
      )}
    </div>
  );
}
