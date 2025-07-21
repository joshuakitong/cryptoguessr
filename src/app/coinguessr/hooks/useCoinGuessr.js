import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCoinGuessrCoins } from "../utils/fetchCoinGuessrCoins";
import {
  getTotalScore,
  saveSessionScore,
} from "@/app/utils/saveLoadUtils";
import { useUser } from "@/app/context/UserContext";

export default function useCoinGuessr() {
  const { user } = useUser();
  const [coinNames, setCoinNames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(10);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchCoinGuessrCoins().then((data) => {
      setCoinNames(data);
    });
  }, []);

  const currentCoin = coinNames[currentIndex]?.toUpperCase() || "";

  const gameOverState = (finalScore) => {
    saveSessionScore(user?.uid, finalScore, "cgScores");
    setTotalScore(getTotalScore(user?.uid));
    setShowGameOverModal(true);
  };

  const handleLetterClick = (letter) => {
    if (guessedLetters.includes(letter)) return;
    const updatedGuesses = [...guessedLetters, letter];
    setGuessedLetters(updatedGuesses);

    if (currentCoin.includes(letter)) {
      const allLettersGuessed = currentCoin
        .split("")
        .every((char) => char === " " || updatedGuesses.includes(char));

      if (allLettersGuessed) {
        const newSessionScore = sessionScore + 100;
        const newLives =
          currentIndex === coinNames.length - 1 ? lives : Math.min(lives + 3, 10);

        setSessionScore(newSessionScore);
        setLives(newLives);
        setIsRevealed(true);

        setTimeout(() => {
          if (newSessionScore >= 1000) {
            gameOverState(newSessionScore + newLives * 100);
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
        gameOverState(sessionScore);
      }
    }
  };

  const backToGameMenu = () => {
    router.push("/");
  };

  return {
    currentCoin,
    guessedLetters,
    lives,
    sessionScore,
    totalScore,
    isRevealed,
    showGameOverModal,
    handleLetterClick,
    backToGameMenu,
    gameOver,
    setGameOver,
  };
}
