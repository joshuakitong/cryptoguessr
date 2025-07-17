"use client";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

export default function VoteButtons({ vote, canVote, handleVote }) {
  return (
    <div className="flex gap-8 mt-4 scale-90 sm:scale-100">
      <button
        onClick={() => handleVote("down")}
        disabled={!canVote}
        className={`w-26 h-26 hover:scale-110 flex items-center justify-center rounded-full transition ${
          vote === "down"
            ? "bg-red-700 scale-110 ring-4 ring-red-400"
            : "bg-red-600 hover:bg-red-700"
        } ${!canVote ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        title="Vote Down"
      >
        <ArrowBigDown className="w-13 h-13 text-red-300 transition-all" />
      </button>

      <button
        onClick={() => handleVote("up")}
        disabled={!canVote}
        className={`w-26 h-26 hover:scale-110 flex items-center justify-center rounded-full transition ${
          vote === "up"
            ? "bg-green-700 scale-110 ring-4 ring-green-400"
            : "bg-green-600 hover:bg-green-700"
        } ${!canVote ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        title="Vote Up"
      >
        <ArrowBigUp className="w-13 h-13 text-green-300 transition-all" />
      </button>
    </div>
  );
}