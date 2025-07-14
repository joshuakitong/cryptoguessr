import React, { useEffect, useRef } from "react";
import { Heart } from "lucide-react";

export default function Lives({ currentLives, totalLives }) {
  const prevLivesRef = useRef(currentLives);

  useEffect(() => {
    prevLivesRef.current = currentLives;
  }, [currentLives]);

  const prevLives = prevLivesRef.current;

  return (
    <div className="flex items-center gap-1 relative">

      <style>
        {`
          @keyframes zoom-in {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          .animate-zoom-in {
            animation: zoom-in 1s ease-in-out;
          }
        `}
      </style>

      {Array.from({ length: totalLives }).map((_, index) => {
        const isActive = index < currentLives;
        const wasActive = index < prevLives;
        const gainedLife = isActive && !wasActive;

        return (
          <Heart
            key={index}
            className={`w-6 h-6 transition-colors duration-300 ${
              isActive ? "text-red-500" : "text-gray-600"
            } ${gainedLife ? "animate-zoom-in" : ""}`}
            fill={isActive ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
}
