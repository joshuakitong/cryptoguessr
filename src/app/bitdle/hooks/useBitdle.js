"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchBitdlePrice } from "../utils/fetchBitdlePrice";
import { getLocalState, setLocalState } from "@/app/utils/saveLoadUtils";

export default function useBitdle() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [vote, setVote] = useState(null);
  const [canVote, setCanVote] = useState(true);
  const [timer, setTimer] = useState(60);
  const [sessionScore, setSessionScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalScore, setTotalScore] = useState(() => getLocalState("score", 0));
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [roundOutcome, setRoundOutcome] = useState(null);
  const [displayStatusMessage, setDisplayStatusMessage] = useState("Waiting for initial price...");

  const intervalRef = useRef(null);
  const router = useRouter();

  const endGame = useCallback((finalScore) => {
    setTotalScore(finalScore);
    setLocalState("score", finalScore);
    setGameOver(true);
    setShowGameOverModal(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleRoundEnd = useCallback(async () => {
    setCanVote(false);

    const newPrice = await fetchBitdlePrice();
    if (newPrice === null) {
      console.error("Failed to fetch new Bitcoin price.");
      return;
    }

    let outcome = null;
    let updatedScore = sessionScore;
    let updatedLives = lives;

    if (currentPrice !== null) {
      console.log(newPrice + " : " + currentPrice)
      const priceIncreased = newPrice > currentPrice;
      const priceDecreased = newPrice < currentPrice;

      if (vote === null) {
        outcome = "no_vote";
        updatedLives -= 1;
      } else if (newPrice === currentPrice) {
        outcome = "unchanged";
      } else if (
        (vote === "up" && priceIncreased) ||
        (vote === "down" && priceDecreased)
      ) {
        outcome = "correct";
        updatedScore += 100;
      } else {
        outcome = "wrong";
        updatedLives -= 1;
      }
    }

    setRoundOutcome(outcome);
    setSessionScore(updatedScore);
    setLives(updatedLives);
    setPreviousPrice(currentPrice);
    setCurrentPrice(newPrice);

    if (updatedLives <= 0) {
      endGame(totalScore + updatedScore);
      return;
    }

    if (updatedScore >= 1000) {
      endGame(totalScore + updatedScore + updatedLives * 100);
      return;
    }

    setVote(null);
    setTimer(60);
    setCanVote(true);
  }, [vote, currentPrice, sessionScore, lives, endGame, totalScore]);

  useEffect(() => {
    const initializeGame = async () => {
      const initialPrice = await fetchBitdlePrice();
      if (initialPrice !== null) {
        setCurrentPrice(initialPrice);
        setPreviousPrice(initialPrice);
      }
    };
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameOver) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleRoundEnd();
          return 60;
        }
        if (prev === 5) {
          setCanVote(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [handleRoundEnd, gameOver]);

  useEffect(() => {
    if (!previousPrice && !currentPrice) {
      setDisplayStatusMessage("Waiting for initial price...");
      return;
    }

    if (timer > 5) {
      setDisplayStatusMessage(
        vote === "up"
          ? "You voted Up"
          : vote === "down"
          ? "You voted Down"
          : "Make your prediction!"
      );
    } else if (timer <= 5 && timer > 0) {
      setDisplayStatusMessage(
        vote === "up"
          ? "Vote locked: Up"
          : vote === "down"
          ? "Vote locked: Down"
          : "Can't vote now, waiting for the round to end."
      );
    } else if (timer === 60 && roundOutcome !== null) { //this part doesn't work properly yet...
      switch (roundOutcome) {
        case "correct":
          setDisplayStatusMessage("✅ Correct! +100 points");
          break;
        case "wrong":
          setDisplayStatusMessage("❌ Wrong! -1 life");
          break;
        case "unchanged":
          setDisplayStatusMessage("Price unchanged. No points or lives lost.");
          break;
        case "no_vote":
          setDisplayStatusMessage("No vote cast. -1 life");
          break;
        default:
          setDisplayStatusMessage("Evaluating round...");
      }
    } else {
      setDisplayStatusMessage("Loading next round...");
    }
  }, [timer, vote, roundOutcome, currentPrice, previousPrice]);

  const handleVote = useCallback((direction) => {
    if (canVote && !gameOver) {
      setVote(direction);
    }
  }, [canVote, gameOver]);

  const backToGameMenu = () => {
    router.push("/");
  };

  return {
    currentPrice,
    previousPrice,
    vote,
    canVote,
    timer,
    lives,
    sessionScore,
    totalScore,
    gameOver,
    handleVote,
    backToGameMenu,
    showGameOverModal,
    setShowGameOverModal,
    roundOutcome,
    displayStatusMessage,
  };
}
