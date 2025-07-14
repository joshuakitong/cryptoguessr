"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function GameOverModal({
  sessionScore,
  bonusScore,
  totalScore,
  message,
  didWin,
  onRestart,
  onClose,
}) {
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="relative bg-[#0D1217] p-8 rounded-lg text-center shadow-lg max-w-sm w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-[#f7931a] cursor-pointer transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-4">
          {didWin ? "Congratulations" : "Game Over"}
        </h2>

        <p className="mb-2">{message}</p>

        <p className="mb-2">
          Session Score:{" "}
          <span className="text-[#f7931a] font-bold">
            {didWin ? `${sessionScore} + ${bonusScore}` : sessionScore}
          </span>
        </p>

        <p className="mb-6">
          Total Score: <span className="text-[#f7931a] font-bold">{totalScore}</span>
        </p>

        <button
          onClick={onRestart}
          className="bg-[#f7931a] hover:bg-[#e98209] px-6 py-2 rounded-md font-bold transition shadow-md cursor-pointer"
        >
          Back to Game Menu
        </button>
      </div>
    </div>
  );
}
