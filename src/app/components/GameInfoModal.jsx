"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function GameInfoModal({ show, onClose, info }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-20 flex items-center justify-center transition-all duration-300
        ${show ? "opacity-100 backdrop-blur-sm bg-black/30" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0D1217] max-w-lg w-full p-6 rounded-lg shadow-md text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#f7931a] cursor-pointer transition"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        <p className="mb-2 whitespace-pre-line">{info}</p>
      </div>
    </div>
  );
}
