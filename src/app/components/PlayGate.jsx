import React, { useState, useEffect } from "react";
import { getHasPlayedToday, getTodayScore } from "@/app/utils/saveLoadUtils";
import CountdownToMidnight from "./DailyResetCountdown";
import { useUser } from "@/app/context/UserContext";

export default function PlayGate({ storageKey, children, gameOver }) {
  const { user, userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [playedToday, setPlayedToday] = useState(false);
  const [todayScore, setTodayScore] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (userLoading) return;

      const uid = user?.uid ?? null;
      const result = await getHasPlayedToday(uid, storageKey);
      const score = await getTodayScore(uid, storageKey);

      setPlayedToday(result);
      setTodayScore(score);
      setIsLoading(false);
    };

    load();
  }, [user, userLoading, storageKey, gameOver]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)]">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (playedToday || gameOver) {
    return (
      <div className="flex justify-center items-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)]">
        <span className="text-xl sm:text-2xl text-center">
          You've scored <span className="font-mono text-[#f7931a] font-semibold">{todayScore}</span> today
          <br />
          Play again in <CountdownToMidnight onReset={() => setPlayedToday(false)} />
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
