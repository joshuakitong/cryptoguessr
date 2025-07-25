"use client";
import useBitdle from "./hooks/useBitdle";
import Lives from "@/app/components/Lives";
import Score from "@/app/components/Score";
import BitcoinPriceDisplay from "./components/BitcoinPriceDisplay";
import VoteButtons from "./components/VoteButtons";
import GameOverModal from "@/app/components/GameOverModal";
import StatusMessage from "./components/AnimatedStatusMessage";
import PlayGate from "@/app/components/PlayGate";

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
    displayStatusMessage,
    gameOver,
    setGameOver,
    isSavingGame,
  } = useBitdle();

  if (currentPrice === null) {
    return (
      <div className="flex justify-center items-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)]">
        <div className="h-10 w-10 border-4 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <PlayGate storageKey="bdScores" gameOver={gameOver}>
      <div className="flex flex-col items-center gap-4 p-4 min-h-[calc(100vh-5.75rem)]">
        <Lives currentLives={lives} totalLives={3} />
        <Score score={sessionScore} />

        <div className="flex flex-col items-center gap-4 text-center">
          <BitcoinPriceDisplay
            currentPrice={currentPrice}
            previousPrice={previousPrice}
            timer={timer}
          />

          <VoteButtons vote={vote} canVote={canVote} handleVote={handleVote} />

          <StatusMessage displayStatusMessage={displayStatusMessage} />
        </div>
        {isSavingGame && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="font-semibold">Saving score...</p>
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
