export default function CryptoNameDisplay({ coinName, guessedLetters, isRevealed = false }) {
  if (!coinName) return null;

  return (
    <div className="flex justify-center items-center h-[calc(100vh/2.5)] px-4">
      <div className="flex flex-wrap justify-center items-center max-w-5xl w-full gap-6 sm:gap-8 md:gap-10 text-black dark:text-white text-4xl font-bold">
        {coinName.split(" ").map((word, wordIndex) => (
          <div key={wordIndex} className="flex gap-1 sm:gap-2 md:gap-3">
            {word.split("").map((char, charIndex) => {
              const upperChar = char.toUpperCase();
              const showChar = guessedLetters.includes(upperChar) || isRevealed;
              return (
                <span
                  key={`${wordIndex}-${charIndex}`}
                  className={`border-b-4 h-12 w-8 sm:w-10 md:w-12 text-center ${
                    char === " " ? "border-none" :
                    isRevealed
                    ? "bg-green-600 border-green-400 text-white transition-all duration-500"
                    : "border-black dark:border-white"
                  }`}
                >
                  {char === " " ? "" : showChar ? upperChar : ""}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
