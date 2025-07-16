import { useEffect, useState } from "react";
import AnimatedNumber from "@/app/components/AnimatedNumber";

export default function CryptoCompareBox({ coin, onClick, revealed, metric, isCorrect }) {
  const [showResultColor, setShowResultColor] = useState(false);
  const value = coin?.[metric];

  useEffect(() => {
    if (revealed) {
      const timer = setTimeout(() => setShowResultColor(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowResultColor(false);
    }
  }, [revealed]);

  const resultColorClass = showResultColor
    ? isCorrect
      ? "border-green-500"
      : "border-red-500"
    : "border-white";

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={`${resultColorClass} bg-[#1c1f26] text-white border-2 rounded-lg overflow-hidden h-68 sm:h-98 w-42 sm:w-72 flex flex-col items-center transition duration-300 ease-in-out
        ${revealed ? 'cursor-default' : 'hover:bg-[#2a2d34] cursor-pointer'}
      `}
    >
      <img src={coin.image} alt={coin.name} className="w-full min-w-42 h-42 sm:h-72 object-cover" />
      <h3 
        title={coin.name}
        className={`font-semibold truncate px-2 w-full text-center transition-all
          ${revealed ? 'text-lg mt-4 cursor-default' : 'text-3xl mt-6 hover:bg-[#2a2d34] cursor-pointer'}
        `}>
        {coin.name}
      </h3>

      <p className="mt-2 text-[#f7931a] font-bold text-xl min-h-[1.5rem]">
        {revealed && typeof value === "number" ? (
          <AnimatedNumber
            value={value}
            suffix={metric.includes("price_change") ? "%" : "$"}
            dynamicDecimals
          />
        ) : ""}
      </p>
    </button>
  );
}
