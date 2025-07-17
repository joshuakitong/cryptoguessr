"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchBitdlePrice } from "../utils/fetchBitdlePrice";
import { CheckCircle, XCircle } from "lucide-react";
import {
  getTotalScore,
  saveSessionScore,
} from "@/app/utils/saveLoadUtils";

function areMessagesEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function useBitdle() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [vote, setVote] = useState(null);
  const [canVote, setCanVote] = useState(true);
  const [timer, setTimer] = useState(60);
  const [sessionScore, setSessionScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [roundOutcome, setRoundOutcome] = useState(null);
  const [displayStatusMessage, setDisplayStatusMessage] = useState("Make your prediction...");
  const [gameOver, setGameOver] = useState(false);

  const router = useRouter();
  const intervalRef = useRef(null);

  const gameOverState = useCallback((finalScore) => {
    saveSessionScore(finalScore, "bdScores");
    setShowGameOverModal(true);
    setTotalScore(getTotalScore());
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleRoundEnd = useCallback(async () => {
    setCanVote(false);
    const newPrice = await fetchBitdlePrice();
    if (newPrice === null) return console.error("Failed to fetch Bitcoin price.");

    let outcome = null;
    let updatedScore = sessionScore;
    let updatedLives = lives;

    if (currentPrice !== null) {
      const priceIncreased = newPrice > currentPrice;
      const priceDecreased = newPrice < currentPrice;

      if (vote === null) {
        outcome = "no_vote";
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

    setTimeout(() => {
      setRoundOutcome(null);
      setVote(null);
      setTimer(60);
      setCanVote(true);
    }, 1000);

    if (updatedLives <= 0 || updatedScore >= 1000) {
      gameOverState(updatedScore + (updatedLives > 0 ? updatedLives * 100 : 0));
    }
  }, [vote, currentPrice, sessionScore, lives, gameOverState]);

  useEffect(() => {
    const initializePrice = async () => {
      const price = await fetchBitdlePrice();
      if (price !== null) {
        setCurrentPrice(price);
        setPreviousPrice(price);
      }
    };
    initializePrice();
  }, []);

  useEffect(() => {
    if (showGameOverModal) {
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
  }, [handleRoundEnd]);

  useEffect(() => {
    let newMessage = null;

    if (timer > 5 && timer < 57) {
      newMessage =
        vote === "up" ? (
          <span>
            You voted <span className="text-green-500 font-semibold">Up</span>.
          </span>
        ) : vote === "down" ? (
          <span>
            You voted <span className="text-red-500 font-semibold">Down</span>.
          </span>
        ) : (
          "Make your prediction..."
        );
    } else if (timer < 5 && timer >= 0) {
      newMessage =
        vote === "up" ? (
          <span>
            Vote locked: <span className="text-green-500 opacity-70 font-semibold">Up</span>.
          </span>
        ) : vote === "down" ? (
          <span>
            Vote locked: <span className="text-red-500 opacity-70 font-semibold">Down</span>.
          </span>
        ) : (
          "Can't vote now, waiting for the round to end."
        );
    } else if (timer === 60 && roundOutcome !== null) {
      switch (roundOutcome) {
        case "correct":
          newMessage = (
            <span className="flex items-center gap-2 text-green-500 font-semibold">
              <CheckCircle className="w-6 h-6" />
              +100 points
            </span>
          );
          break;
        case "wrong":
          newMessage = (
            <span className="flex items-center gap-2 text-red-500 font-semibold">
              <XCircle className="w-6 h-6" />
              -1 life
            </span>
          );
          break;
        case "unchanged":
          newMessage = "Price unchanged. No points or lives lost.";
          break;
        case "no_vote":
          newMessage = "No prediction made.";
          break;
        default:
          newMessage = "Evaluating round...";
      }
    }

    if (newMessage !== null && !areMessagesEqual(displayStatusMessage, newMessage)) {
      setDisplayStatusMessage(newMessage);
    }
  }, [timer, vote, roundOutcome]);

  const handleVote = useCallback(
    (direction) => canVote && setVote(direction),
    [canVote]
  );

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
    handleVote,
    backToGameMenu,
    showGameOverModal,
    roundOutcome,
    displayStatusMessage,
    gameOver,
    setGameOver,
  };
}
