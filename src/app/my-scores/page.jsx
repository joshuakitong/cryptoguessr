"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { fetchMyScores } from "./utils/fetchMyScores";

const games = ["cgScores", "bdScores", "goScores"];
const gameLabels = {
  cgScores: "CoinGuessr",
  bdScores: "Bitdle",
  goScores: "Gain Over",
};

export default function MyScores() {
  const { user, userLoading } = useUser();
  const [scoreData, setScoreData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    const run = async () => {
      setLoading(true);

      const data = await fetchMyScores(user?.uid, scoreData);
      setScoreData(data);

      setLoading(false);
    };

    run();
  }, [user, userLoading]);

  const allDates = Array.from(
    new Set(Object.values(scoreData).flatMap((s) => Object.keys(s)))
  ).sort((a, b) => (a > b ? -1 : 1));

  const getScore = (gameKey, date) => scoreData[gameKey]?.[date] ?? "-";
  const getDateTotal = (date) =>
    games.reduce((sum, key) => sum + (scoreData[key]?.[date] ?? 0), 0);
  const gameTotals = games.reduce((acc, key) => {
    acc[key] = Object.values(scoreData[key] || {}).reduce((sum, v) => sum + v, 0);
    return acc;
  }, {});
  const allGamesTotal = Object.values(gameTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 justify-center items-center min-h-[calc(100vh-5.75rem)]">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="h-10 w-10 m-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#1c1f26]">
              <th className="p-2 text-center w-24 rounded-tl-xl border-b border-[#dfe5ec]">Date</th>
              {games.map((key) => (
                <th key={key} className="p-2 w-32 text-center border-b border-[#dfe5ec]">
                  {gameLabels[key]}
                </th>
              ))}
              <th className="p-2 text-center w-24 rounded-tr-xl border-b border-[#dfe5ec]">Total</th>
            </tr>
          </thead>
          <tbody>
            {allDates.map((date) => (
              <tr className="hover:bg-[#2a2d34]" key={date}>
                <td className="p-2 text-center">
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                {games.map((key) => (
                  <td key={key} className="p-2 text-center font-mono">
                    {getScore(key, date)}
                  </td>
                ))}
                <td className="p-2 font-semibold text-center font-mono">
                  {getDateTotal(date)}
                </td>
              </tr>
            ))}
            <tr className="bg-[#f7931a]/10 text-[#f7931a] font-bold">
              <td className="p-2 rounded-bl-xl border-t border-[#f7931a]"></td>
              {games.map((key) => (
                <td key={key} className="p-2 border-t border-[#f7931a] text-center font-mono">
                  {gameTotals[key]}
                </td>
              ))}
              <td className="p-2 border-t border-[#f7931a] text-center font-mono rounded-br-xl">{allGamesTotal}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
