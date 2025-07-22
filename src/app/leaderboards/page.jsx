"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { fetchLeaderboard } from "./utils/fetchLeaderboard";

const gameOptions = [
  { label: "All Games", value: "all" },
  { label: "CoinGuessr", value: "cg" },
  { label: "Bitdle", value: "bd" },
  { label: "Gain Over", value: "go" },
];

const timeOptions = [
  { label: "All Time", value: "allTime" },
  { label: "Monthly", value: "monthly" },
];

export default function LeaderboardPage() {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameKey, setGameKey] = useState("all");
  const [timeKey, setTimeKey] = useState("allTime");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetchLeaderboard(gameKey, timeKey)
      .then((data) => setLeaderboard(data))
      .catch((err) => alert("Failed to fetch leaderboard: " + err.message))
      .finally(() => setLoading(false));
  }, [gameKey, timeKey]);

  const top10 = leaderboard.slice(0, 10);
  const currentUser = user ? leaderboard.find((u) => u.uid === user.uid) : null;
  const showUserRow =
    currentUser && currentUser.rank > 10 && !top10.some((u) => u.uid === user?.uid);

  return (
    <div className="max-w-lg mx-auto px-4 justify-center items-center min-h-[calc(100vh-5.75rem)]">
      <div className="flex flex-wrap justify-center gap-4 mb-2">
        <div className="flex gap-1 bg-[#1c1f26] p-1 rounded-full">
          {gameOptions.map((opt) => (
            <button
              key={opt.value}
              disabled={loading}
              onClick={() => setGameKey(opt.value)}
              className={`px-3 py-1 rounded-full text-sm transition truncate ${
                gameKey === opt.value
                  ? "bg-[#f7931a] text-black"
                  : loading
                    ? "cursor-not-allowed"
                    : "hover:bg-[#2a2e38] cursor-pointer"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-[#1c1f26] p-1 rounded-full">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              disabled={loading}
              onClick={() => setTimeKey(opt.value)}
              className={`px-3 py-1 rounded-full text-sm transition truncate ${
                timeKey === opt.value
                  ? "bg-[#f7931a] text-black"
                  : loading
                    ? "cursor-not-allowed"
                    : "hover:bg-[#2a2e38] cursor-pointer"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>


      {loading ? (
        <div className="flex justify-center items-center">
          <div className="h-10 w-10 m-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="rounded overflow-hidden">
          <div className="grid grid-cols-[15%_65%_20%] font-semibold py-2 text-center">
            <div>Rank</div>
            <div>Name</div>
            <div>Score</div>
          </div>
          
          {top10.map((entry) => (
            <div
              key={entry.uid}
              className={`grid grid-cols-[15%_65%_20%] bg-[#1c1f26] py-4 my-2 rounded-full ${
                user?.uid === entry.uid
                  ? "border border-[#f7931a] font-bold"
                  : ""
              } ${
                entry.rank === 1 ? "font-bold bg-[#FFD700]/30 text-[#FFD700]" : ""
              } ${
                entry.rank === 2 ? "font-bold bg-[#C0C0C0]/30 text-[#C0C0C0]" : ""
              } ${
                entry.rank === 3 ? "font-bold bg-[#CD7F32]/30 text-[#CD7F32]" : ""
              }`}
            >
              <div className="text-center">#{entry.rank}</div>
              <div className="truncate">{entry.displayName}</div>
              <div className="text-center font-mono">{entry.total}</div>
            </div>
          ))}

          {showUserRow && (
            <div
              className={`grid grid-cols-[15%_65%_20%] py-4 my-2 rounded-full border border-[#f7931a] bg-[#1c1f26] font-bold`}
            >
              <div className="text-center">#{currentUser.rank}</div>
              <div className="truncate">{currentUser.displayName}</div>
              <div className="text-center font-mono">{currentUser.total}</div>
            </div>
          )}
        </div>
        )}
    </div>
  );
}
