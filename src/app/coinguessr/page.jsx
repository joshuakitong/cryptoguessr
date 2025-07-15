"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CryptoNameDisplay from "./components/CryptoNameDisplay";
import Keyboard from "./components/Keyboard";
import Lives from "@/app/components/Lives";
import Score from "@/app/components/Score";
import GameOverModal from "@/app/components/GameOverModal";
import { fetchCoinGuessrCoins } from "./utils/fetchCoinGuessrCoins";
import { getLocalState, setLocalState } from "@/app/utils/saveLoadUtils";

export default function CoinGuessrPage() {
  const [coinNames, setCoinNames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(10);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [totalScore, setTotalScore] = useState(() => getLocalState("score", 0));
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCoinGuessrCoins().then((data) => {
      //console.log("Fetched coins:", data);
      setCoinNames(data);
    });
  }, []);

  const currentCoin = coinNames[currentIndex]?.toUpperCase() || "";

  const handleLetterClick = (letter) => {
    if (guessedLetters.includes(letter) || gameOver) return;
    const updatedGuesses = [...guessedLetters, letter];
    setGuessedLetters(updatedGuesses);

    if (currentCoin.includes(letter)) {
      const allLettersGuessed = currentCoin
        .split("")
        .every((char) => char === " " || updatedGuesses.includes(char));

      if (allLettersGuessed) {
        const newSessionScore = sessionScore + 100;
        const newLives = currentIndex === coinNames.length - 1 ? lives : Math.min(lives + 3, 10);

        setSessionScore(newSessionScore);
        setLives(newLives);
        setIsRevealed(true);

        setTimeout(() => {
          if (sessionScore >= 1000) {
            gameOverState(totalScore + newSessionScore + newLives * 100);
          } else {
            setCurrentIndex((i) => i + 1);
            setGuessedLetters([]);
            setIsRevealed(false);
          }
        }, 3000);
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        gameOverState(totalScore + sessionScore);
      }
    }
  };

  const gameOverState = (updatedTotal) => {
    setTotalScore(updatedTotal);
    setLocalState("score", updatedTotal);
    setGameOver(true);
    setShowGameOverModal(true);
  };

  const resetGame = () => {
    router.push("/");
  };

  if (!coinNames.length || !currentCoin) {
    return (
      <div className="flex justify-center">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Lives 
        currentLives={lives}
        totalLives={10}
      />
      <Score 
        score={sessionScore}
      />
      <CryptoNameDisplay 
        coinName={currentCoin}
        guessedLetters={guessedLetters}
        isRevealed={isRevealed}
      />
      <Keyboard 
        guessedLetters={guessedLetters}
        onGuess={handleLetterClick}
        disabled={gameOver || isRevealed}
        coinName={currentCoin}
      />
      {showGameOverModal && <GameOverModal
        sessionScore={sessionScore}
        bonusScore={lives * 100}
        totalScore={totalScore}
        message={sessionScore >= 1000 ? 'You won the game!' : `The answer is: ${currentCoin}`}
        didWin={sessionScore >= 1000}
        onRestart={resetGame}
        onClose={() => setShowGameOverModal(false)}
      />}
    </div>
  );
}
