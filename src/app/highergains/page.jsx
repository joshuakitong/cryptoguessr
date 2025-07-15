"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lives from "@/app/components/Lives";
import Score from "@/app/components/Score";
import GameOverModal from "@/app/components/GameOverModal";
import CryptoCompareBox from "./components/CryptoCompareBox";
import { fetchHigherGainsCoins } from "./utils/fetchHigherGainsCoins";
import { getLocalState, setLocalState } from "@/app/utils/saveLoadUtils";

const metrics = [
  { key: "current_price", label: "Current Price" },
  { key: "price_change_percentage_24h", label: "24H Gain" },
  { key: "price_change_percentage_7d", label: "7D Gain" },
  { key: "price_change_percentage_30d", label: "1M Gain" },
  { key: "price_change_percentage_1y", label: "1Y Gain" },
];

function getValidMetricsForPair(coin1, coin2) {
  return metrics.filter(({ key }) =>
    typeof coin1[key] === "number" &&
    typeof coin2[key] === "number" &&
    !isNaN(coin1[key]) &&
    !isNaN(coin2[key])
  );
}

function getRandomValidMetric(coin1, coin2) {
  const validMetrics = getValidMetricsForPair(coin1, coin2);
  if (validMetrics.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * validMetrics.length);
  return validMetrics[randomIndex];
}

export default function HigherGainsPage() {
  const [allFetchedCoins, setAllFetchedCoins] = useState([]);
  const [leftCoin, setLeftCoin] = useState(null);
  const [rightCoin, setRightCoin] = useState(null);
  const [usedCoinIds, setUsedCoinIds] = useState(new Set());
  const [lives, setLives] = useState(5);
  const [sessionScore, setSessionScore] = useState(0);
  const [totalScore, setTotalScore] = useState(() => getLocalState("score", 0));
  const [metric, setMetric] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const router = useRouter();

  const getNewUniqueCoin = (currentUsedCoinIds) => {
    const availableCoins = allFetchedCoins.filter(
      (coin) => !currentUsedCoinIds.has(coin.id)
    );
    if (availableCoins.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * availableCoins.length);
    return availableCoins[randomIndex];
  };

  useEffect(() => {
    fetchHigherGainsCoins().then((fetchedCoins) => {
      //console.log("Fetched coins:", fetchedCoins);
      setAllFetchedCoins(fetchedCoins);
      if (fetchedCoins.length >= 2) {
        const coin1 = fetchedCoins[0];
        const coin2 = fetchedCoins[1];
        setLeftCoin(coin1);
        setRightCoin(coin2);
        setUsedCoinIds(new Set([coin1.id, coin2.id]));
        const firstMetric = getRandomValidMetric(coin1, coin2);
        setMetric(firstMetric);
      }
    });
  }, []);

  const handleChoice = (choice) => {
    if (revealed || gameOver || !metric) return;

    const isLeftHigher = leftCoin[metric.key] > rightCoin[metric.key];
    const correct = (choice === "left" && isLeftHigher) || (choice === "right" && !isLeftHigher);

    setRevealed(true);

    setTimeout(() => {
      if (correct) {
        const newScore = sessionScore + 50;
        setSessionScore(newScore);

        let newUsedCoinIds = new Set(usedCoinIds);
        let nextLeftCoin = leftCoin;
        let nextRightCoin = rightCoin;

        if (choice === "left") {
          newUsedCoinIds.add(rightCoin.id);
          const newCoin = getNewUniqueCoin(newUsedCoinIds);
          if (newCoin) {
            nextRightCoin = newCoin;
            newUsedCoinIds.add(newCoin.id);
          }
        } else {
          newUsedCoinIds.add(leftCoin.id);
          const newCoin = getNewUniqueCoin(newUsedCoinIds);
          if (newCoin) {
            nextLeftCoin = newCoin;
            newUsedCoinIds.add(newCoin.id);
          }
        }

        setLeftCoin(nextLeftCoin);
        setRightCoin(nextRightCoin);
        setUsedCoinIds(newUsedCoinIds);

        const newMetric = getRandomValidMetric(nextLeftCoin, nextRightCoin);
        setMetric(newMetric);

        if (newScore >= 1000) {
          gameOverState(totalScore + newScore + lives * 100);
        }

      } else {
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
          gameOverState(totalScore + sessionScore);
        } else {
          let newUsedCoinIds = new Set(usedCoinIds);
          let nextLeftCoin = leftCoin;
          let nextRightCoin = rightCoin;

          const correctCoin = isLeftHigher ? leftCoin : rightCoin;
          const incorrectCoin = isLeftHigher ? rightCoin : leftCoin;

          if (newUsedCoinIds.has(incorrectCoin.id)) {
            newUsedCoinIds.delete(incorrectCoin.id);
          }
          
          const newCoin = getNewUniqueCoin(newUsedCoinIds);
          if (!newCoin) {
            gameOverState(totalScore + sessionScore);
            setRevealed(false);
            return;
          }
          newUsedCoinIds.add(newCoin.id);

          if (isLeftHigher) {
            nextLeftCoin = correctCoin;
            nextRightCoin = newCoin;
          } else {
            nextLeftCoin = newCoin;
            nextRightCoin = correctCoin;
          }

          setLeftCoin(nextLeftCoin);
          setRightCoin(nextRightCoin);
          setUsedCoinIds(newUsedCoinIds);

          const newMetric = getRandomValidMetric(nextLeftCoin, nextRightCoin);
          setMetric(newMetric);
        }
      }
      setRevealed(false);
    }, 2000);
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

  if (!leftCoin || !rightCoin || !metric) {
    return (
      <div className="flex justify-center pt-20">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Lives currentLives={lives} totalLives={5} />
      <Score score={sessionScore} />
      <p className="text-white text-md mb-2">
        Which coin has higher <strong>{metric.label}</strong>?
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <CryptoCompareBox
          coin={leftCoin}
          side="left"
          onClick={() => handleChoice("left")}
          revealed={revealed}
          metric={metric.key}
        />
        <CryptoCompareBox
          coin={rightCoin}
          side="right"
          onClick={() => handleChoice("right")}
          revealed={revealed}
          metric={metric.key}
        />
      </div>

      {showGameOverModal && <GameOverModal
        sessionScore={sessionScore}
        bonusScore={lives * 100}
        totalScore={totalScore}
        message={sessionScore >= 1000 ? "You won the game!" : "Game over!"}
        didWin={sessionScore >= 1000}
        onRestart={resetGame}
        onClose={() => setShowGameOverModal(false)}
      />}
    </div>
  );
}
