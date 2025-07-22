"use client";
import useGainOver from "./hooks/useGainOver";
import Lives from "@/app/components/Lives";
import Score from "@/app/components/Score";
import GameOverModal from "@/app/components/GameOverModal";
import CryptoCompareBox from "./components/CryptoCompareBox";
import PlayGate from "@/app/components/PlayGate";

export default function GainOverPage() {
  const {
    leftCoin,
    rightCoin,
    correctCoin,
    selectedSide,
    metric,
    lives,
    sessionScore,
    totalScore,
    revealed,
    handleChoice,
    backToGameMenu,
    showGameOverModal,
    gameOver,
    setGameOver,
    isSavingGame,
  } = useGainOver();

  if (!leftCoin || !rightCoin || !metric) {
    return (
      <div className="flex justify-center items-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)]">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <PlayGate storageKey="goScores" gameOver={gameOver}>
      <div className="flex flex-col items-center gap-4 p-4 min-h-[calc(100vh-5.75rem)]">
        <Lives currentLives={lives} totalLives={5} />
        <Score score={sessionScore} />
        <p className="text-center text-lg sm:text-2xl mb-2">
          Which coin has a higher <span className="text-[#f7931a] font-bold">{metric.label}</span>?
        </p>
        <div className="w-full overflow-x-visible">
          <div className="flex justify-center gap-4 py-4">
            <CryptoCompareBox
              coin={leftCoin}
              side="left"
              onClick={() => handleChoice("left")}
              revealed={revealed}
              metric={metric.key}
              isCorrect={correctCoin?.id === leftCoin.id}
              selected={selectedSide === "left"}
            />
            <CryptoCompareBox
              coin={rightCoin}
              side="right"
              onClick={() => handleChoice("right")}
              revealed={revealed}
              metric={metric.key}
              isCorrect={correctCoin?.id === rightCoin.id}
              selected={selectedSide === "right"}
            />
          </div>
        </div>
        {isSavingGame && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-white font-semibold">Saving score...</p>
            </div>
          </div>
        )}
        {showGameOverModal && (
          <GameOverModal
            sessionScore={sessionScore}
            bonusScore={lives * 100}
            totalScore={totalScore}
            message={sessionScore >= 1000 ? "You won the game!" : "Nice try!"}
            didWin={sessionScore >= 1000}
            onRestart={backToGameMenu}
            onClose={() => setGameOver(true)}
          />
        )}
      </div>
    </PlayGate>
  );
}
