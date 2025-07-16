"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchBitdlePrice } from "../utils/fetchBitdlePrice";
import { getLocalState, setLocalState } from "@/app/utils/saveLoadUtils";
import { CheckCircle, XCircle } from "lucide-react";

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
  const [totalScore, setTotalScore] = useState(() => getLocalState("score", 0));
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [roundOutcome, setRoundOutcome] = useState(null);
  const [displayStatusMessage, setDisplayStatusMessage] = useState("Make your prediction...");

  const intervalRef = useRef(null);
  const router = useRouter();

  const gameOverState = useCallback((finalScore) => {
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

    if (updatedLives <= 0) {
      gameOverState(totalScore + updatedScore);
      return;
    }

    if (updatedScore >= 1000) {
      gameOverState(totalScore + updatedScore + updatedLives * 100);
      return;
    }

    setVote(null);
    setTimer(60);
    setCanVote(true);
  }, [vote, currentPrice, sessionScore, lives, gameOverState, totalScore]);

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
            <span className="flex items-center justify-center gap-2 text-green-500 font-semibold">
              <CheckCircle className="w-6 h-6" />
              +100 points
            </span>
          );
          break;
        case "wrong":
          newMessage = (
            <span className="flex items-center justify-center gap-2 text-red-500 font-semibold">
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
