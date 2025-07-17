import { useEffect, useState, useRef } from "react";

function getNextResetTime() {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 8);

  const gmt8Year = now.getUTCFullYear();
  const gmt8Month = now.getUTCMonth();
  const gmt8Date = now.getUTCDate() + 1;

  const resetTimeGMT8 = new Date(Date.UTC(gmt8Year, gmt8Month, gmt8Date, 0, 0, 0));
  resetTimeGMT8.setUTCHours(resetTimeGMT8.getUTCHours() - 8);

  return resetTimeGMT8;
}

function getTimeRemaining(toDate) {
  const total = toDate - new Date();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / 1000 / 60 / 60));

  return { total, hours, minutes, seconds };
}

export default function CountdownToMidnight({ onReset }) {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeRemaining(getNextResetTime())
  );
  const hasResetFired = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(getNextResetTime());
      setTimeLeft(remaining);

      if (remaining.total <= 0 && onReset && !hasResetFired.current) {
        hasResetFired.current = true;
        clearInterval(interval);
        onReset();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onReset]);

  const { hours, minutes, seconds } = timeLeft;

  return (
    <span className="font-mono text-xl sm:text-2xl text-[#f7931a]">
      {`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
    </span>
  );
}
