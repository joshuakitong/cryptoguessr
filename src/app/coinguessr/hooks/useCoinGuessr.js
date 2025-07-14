import { useState, useEffect } from "react";
import { fetchRandomCoins } from "../utils/fetchRandomCoins";
import { getRandomCoinName } from "../utils/getRandomCoinName";
import { loadGameState, saveGameState, clearGameState } from "@/utils/saveLoadUtils";

export default function useCoinGuessr() {
  const [coins, setCoins] = useState([]);
  const [currentCoin, setCurrentCoin] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const stored = loadGameState("coinGuessr");
    if (stored) {
      setCoins(stored.coins);
      setCurrentCoin(stored.currentCoin);
      setGuessedLetters(stored.guessedLetters);
      setLives(stored.lives);
      setScore(stored.score);
      setGameOver(stored.gameOver);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    saveGameState("coinGuessr", {
      coins,
      currentCoin,
      guessedLetters,
      lives,
      score,
      gameOver,
    });
  }, [coins, currentCoin, guessedLetters, lives, score, gameOver]);

  const initializeGame = async () => {
    const fetched = await fetchRandomCoins();
    setCoins(fetched);
    setCurrentCoin(getRandomCoinName(fetched));
    setGuessedLetters([]);
    setLives(5);
    setScore(0);
    setGameOver(false);
  };

  const guessLetter = (letter) => {
    const upper = letter.toUpperCase();
    setGuessedLetters((prev) => [...prev, upper]);
    if (!currentCoin.includes(upper)) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) setGameOver(true);
    }
  };

  const isCorrectGuess = (letter) => currentCoin.includes(letter.toUpperCase());
  const allLettersGuessed = () => {
    return currentCoin.split("").every((l) => guessedLetters.includes(l.toUpperCase()));
  };

  useEffect(() => {
    if (!gameOver && currentCoin && allLettersGuessed()) {
      const newScore = score + 100;
      const newLives = Math.min(lives + 1, 5);
      setScore(newScore);
      setLives(newLives);
      setGuessedLetters([]);
      const next = getRandomCoinName(coins);
      setCurrentCoin(next);
    }
  }, [guessedLetters]);

  const resetGame = () => {
    clearGameState("coinGuessr");
    initializeGame();
  };

  return {
    currentCoin,
    guessedLetters,
    lives,
    score,
    gameOver,
    guessLetter,
    isCorrectGuess,
    resetGame,
  };
}