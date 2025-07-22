"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";

const GAME_OPTIONS = [
  { label: "All Games", value: "all" },
  { label: "CoinGuessr", value: "cg" },
  { label: "Bitdle", value: "bd" },
  { label: "Gain Over", value: "go" },
];

const TIME_OPTIONS = [
  { label: "All Time", value: "allTime" },
  { label: "Monthly", value: "monthly" },
];

export default function LeaderboardPage() {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameKey, setGameKey] = useState("all");
  const [timeKey, setTimeKey] = useState("allTime");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/leaders?gameKey=${gameKey}&timeKey=${timeKey}`
        );
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        alert("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gameKey, timeKey]);

  const top10 = leaderboard.slice(0, 10);
  const currentUser = user ? leaderboard.find((u) => u.uid === user.uid) : null;
  const showUserRow =
    currentUser && currentUser.rank > 10 && !top10.some((u) => u.uid === user?.uid);

  return (
    <div className="max-w-lg mx-auto px-4 justify-center items-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)]">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select
          value={gameKey}
          onChange={(e) => setGameKey(e.target.value)}
          className="p-2 border rounded"
        >
          {GAME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={timeKey}
          onChange={(e) => setTimeKey(e.target.value)}
          className="p-2 border rounded"
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-[15%_65%_20%] bg-gray-800 text-white font-semibold py-2">
          <div className="text-center">Rank</div>
          <div>Name</div>
          <div className="text-center">Score</div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="h-10 w-10 m-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {top10.map((entry) => (
              <div
                key={entry.uid}
                className={`grid grid-cols-[15%_65%_20%] py-2 border-t ${
                  user?.uid === entry.uid
                    ? "bg-[#f7931a]/20 border-[#f7931a] text-[#f7931a] font-semibold"
                    : "border-gray-300"
                }`}
              >
                <div className="text-center">#{entry.rank}</div>
                <div className="truncate">{entry.displayName}</div>
                <div className="text-center">{entry.total}</div>
              </div>
            ))}

            {showUserRow && (
              <div
                className={`grid grid-cols-[15%_65%_20%] py-2 border-t bg-[#f7931a]/20 border-[#f7931a] text-[#f7931a] font-semibold`}
              >
                <div className="text-center">#{currentUser.rank}</div>
                <div>{currentUser.displayName}</div>
                <div className="text-center">{currentUser.total}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
