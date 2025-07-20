"use client";
import { ArrowUp, ArrowDown } from "lucide-react";
import AnimatedNumber from "@/app/components/AnimatedNumber";

export default function BitcoinPriceDisplay({ currentPrice, previousPrice, timer }) {
  const priceChanged =
    currentPrice !== null &&
    previousPrice !== null &&
    currentPrice !== previousPrice;

  const priceDiffPercent =
    priceChanged &&
    ((Math.abs(currentPrice - previousPrice) / previousPrice) * 100);

  return (
    <>
      <div className="text-2xl sm:text-4xl font-semibold mt-24">
        Current price:
      </div>
      <div className="flex flex-col items-center justify-center gap-2 text-center relative">
        <div className="relative inline-block">
          <div className="text-4xl sm:text-6xl font-bold text-white">
            {currentPrice !== null ? (
              <AnimatedNumber
                value={currentPrice}
                prefix="$"
                minDecimals={2}
              />
            ) : (
              "Loading..."
            )}
          </div>

          {priceChanged && (
            <div
              className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 text-xs sm:text-sm font-semibold ${
                currentPrice > previousPrice ? "text-green-500" : "text-red-500"
              }`}
            >
              {currentPrice > previousPrice ? (
                <ArrowUp size={16} className="inline -mb-0.5" />
              ) : (
                <ArrowDown size={16} className="inline -mb-0.5" />
              )}
              <AnimatedNumber
                value={priceDiffPercent}
                suffix="%"
                minDecimals={3}
              />
            </div>
          )}
        </div>
      </div>
      <p className="text-md sm:text-xl">
        Predict <span className="text-[#f7931a] font-semibold">Bitcoin</span>'s price action in the next{" "}
        <span className="font-mono text-md sm:text-xl font-bold">{timer}s</span>
      </p>
    </>
  );
}