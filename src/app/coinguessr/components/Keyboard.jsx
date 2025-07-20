import { useEffect } from "react";

const KEYS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];

export default function Keyboard({ onGuess, guessedLetters, disabled, coinName }) {
  if (!guessedLetters || !coinName) return null;

  const handleClick = (letter) => {
    if (!guessedLetters.includes(letter) && !disabled) {
      onGuess(letter);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.altKey) return;

      const letter = e.key.toUpperCase();
      if (letter.length === 1 && /[A-Z]/.test(letter)) {
        handleClick(letter);
      }
    };

    if (!disabled) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guessedLetters, disabled]);

  return (
    <div className="fixed bottom-[4rem] sm:bottom-0 w-full z-10">
      <div className="flex justify-center items-center w-full h-[150px] sm:h-[150px] md:h-[300px] lg:h-[350px]">
        <div className="scale-[0.85] sm:scale-100 transition-transform space-y-2">
          {KEYS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((letter) => {
                const isGuessed = guessedLetters.includes(letter);
                const isCorrect = isGuessed && coinName.includes(letter);
                const isIncorrect = isGuessed && !isCorrect;

                let bgClass = "bg-[#f7931a] hover:bg-[#e98209] cursor-pointer";
                if (isCorrect) bgClass = "bg-green-600";
                else if (isIncorrect) bgClass = "bg-gray-700 cursor-not-allowed";

                return (
                  <button
                    key={letter}
                    onClick={() => handleClick(letter)}
                    className={`w-10 h-16 sm:w-12 sm:h-16 md:w-14 md:h-18 rounded-md font-bold text-xl text-white ${bgClass} transition`}
                    disabled={isGuessed || disabled}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
