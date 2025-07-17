"use client";
import useCoinGuessr from "./hooks/useCoinGuessr";
import CryptoNameDisplay from "./components/CryptoNameDisplay";
import Keyboard from "./components/Keyboard";
import Lives from "@/app/components/Lives";
import Score from "@/app/components/Score";
import GameOverModal from "@/app/components/GameOverModal";
import PlayGate from "@/app/components/PlayGate";

export default function CoinGuessrPage() {
  const {
    currentCoin,
    guessedLetters,
    lives,
    isRevealed,
    handleLetterClick,
    sessionScore,
    totalScore,
    backToGameMenu,
    showGameOverModal,
    gameOver,
    setGameOver,
  } = useCoinGuessr();

  if (!currentCoin) {
    return (
      <div className="flex justify-center items-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)]">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <PlayGate storageKey="cgScores" gameOver={gameOver} sessionScore={sessionScore + lives * 100}>
      <div className="flex flex-col items-center gap-4 p-4 min-h-[calc(100vh-5.75rem)]">
        <Lives currentLives={lives} totalLives={10} />
        <Score score={sessionScore} />
        <CryptoNameDisplay
          coinName={currentCoin}
          guessedLetters={guessedLetters}
          isRevealed={isRevealed}
        />
        <Keyboard
          guessedLetters={guessedLetters}
          onGuess={handleLetterClick}
          disabled={isRevealed}
          coinName={currentCoin}
        />
        {showGameOverModal && (
          <GameOverModal
            sessionScore={sessionScore}
            bonusScore={lives * 100}
            totalScore={totalScore}
            message={sessionScore >= 1000 ? "You won the game!" : `The answer is: ${currentCoin}`}
            didWin={sessionScore >= 1000}
            onRestart={backToGameMenu}
            onClose={() => setGameOver(true)}
          />
        )}
      </div>
    </PlayGate>
  );
}
