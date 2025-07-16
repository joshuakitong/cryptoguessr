"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchGainOverCoins } from "../utils/fetchGainOverCoins";
import { getLocalState, setLocalState } from "@/app/utils/saveLoadUtils";
import { getRandomValidMetric } from "../utils/metricUtils";

export default function useGainOver() {
  const [allCoins, setAllCoins] = useState([]);
  const [leftCoin, setLeftCoin] = useState(null);
  const [rightCoin, setRightCoin] = useState(null);
  const [usedCoinIds, setUsedCoinIds] = useState(new Set());
  const [correctCoin, setCorrectCoin] = useState(null);
  const [metric, setMetric] = useState(null);
  const [lives, setLives] = useState(5);
  const [sessionScore, setSessionScore] = useState(0);
  const [totalScore, setTotalScore] = useState(() => getLocalState("score", 0));
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGainOverCoins().then((coins) => {
      //console.log("Fetched coins:", fetchedCoins);
      setAllCoins(coins);
      if (coins.length >= 2) {
        const [c1, c2] = coins;
        setLeftCoin(c1);
        setRightCoin(c2);
        setUsedCoinIds(new Set([c1.id, c2.id]));
        setMetric(getRandomValidMetric(c1, c2));
      }
    });
  }, []);

  const getNewUniqueCoin = (excludeIds) => {
    const available = allCoins.filter((c) => !excludeIds.has(c.id));
    if (!available.length) return null;
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleChoice = (choice) => {
    if (revealed || gameOver || !metric) return;

    const isLeftHigher = leftCoin[metric.key] > rightCoin[metric.key];
    const correct = (choice === "left" && isLeftHigher) || (choice === "right" && !isLeftHigher);
    const correctCoin = isLeftHigher ? leftCoin : rightCoin;
    
    setCorrectCoin(correctCoin);
    setRevealed(true);

    setTimeout(() => {
      if (correct) {
        const newScore = sessionScore + 50;
        setSessionScore(newScore);

        const newUsed = new Set(usedCoinIds);
        let nextLeft = leftCoin;
        let nextRight = rightCoin;

        if (correctCoin.id === leftCoin.id) {
          newUsed.add(rightCoin.id);
          const newCoin = getNewUniqueCoin(newUsed);
          if (newCoin) {
            nextRight = newCoin;
            newUsed.add(newCoin.id);
          }
        } else {
          newUsed.add(leftCoin.id);
          const newCoin = getNewUniqueCoin(newUsed);
          if (newCoin) {
            nextLeft = newCoin;
            newUsed.add(newCoin.id);
          }
        }

        setLeftCoin(nextLeft);
        setRightCoin(nextRight);
        setUsedCoinIds(newUsed);
        setMetric(getRandomValidMetric(nextLeft, nextRight));

        if (newScore >= 1000) {
          gameOverState(totalScore + newScore + lives * 100);
        }
      } else {
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
          gameOverState(totalScore + sessionScore);
        } else {
          const newUsed = new Set(usedCoinIds);
          let newCoin = getNewUniqueCoin(newUsed);
          if (!newCoin) {
            gameOverState(totalScore + sessionScore);
            return;
          }

          const nextLeft = isLeftHigher ? leftCoin : newCoin;
          const nextRight = isLeftHigher ? newCoin : rightCoin;

          newUsed.add(newCoin.id);

          setLeftCoin(nextLeft);
          setRightCoin(nextRight);
          setUsedCoinIds(newUsed);
          setMetric(getRandomValidMetric(nextLeft, nextRight));
        }
      }

      setCorrectCoin(null);
      setRevealed(false);
    }, 3000);
  };

  const gameOverState = (finalScore) => {
    setTotalScore(finalScore);
    setLocalState("score", finalScore);
    setGameOver(true);
    setShowGameOverModal(true);
  };

  const backToGameMenu = () => {
    router.push("/");
  };

  return {
    leftCoin,
    rightCoin,
    correctCoin,
    metric,
    lives,
    sessionScore,
    totalScore,
    revealed,
    handleChoice,
    backToGameMenu,
    setShowGameOverModal,
    showGameOverModal,
  };
}