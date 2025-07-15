import { useEffect, useRef, useState } from "react";

export default function Score({ score }) {
  const [displayedScore, setDisplayedScore] = useState(score);
  const rafRef = useRef();

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    const initial = displayedScore;
    const diff = score - initial;

    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(initial + diff * progress);
      setDisplayedScore(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  return (
    <div className="text-lg sm:text-xl font-semibold text-[#f7931a]">
      Score: {displayedScore}
    </div>
  );
}
