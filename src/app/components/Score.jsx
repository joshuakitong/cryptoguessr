import AnimatedNumber from "./AnimatedNumber";

export default function Score({ score }) {
  return (
    <div className="text-lg sm:text-xl font-semibold text-[#f7931a]">
      Score: <AnimatedNumber value={score} duration={2000} minDecimals={0} />
    </div>
  );
}
