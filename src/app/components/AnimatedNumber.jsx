import { useEffect, useState, useRef } from "react";

export default function AnimatedNumber({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  dynamicDecimals = false,
  minDecimals = 2,
  maxDecimals = 6,
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    let start = performance.now();
    const initial = animatedValue;
    const diff = value - initial;

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = initial + diff * progress;
      setAnimatedValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const getFormatted = (val) => {
    if (!dynamicDecimals) {
      return val.toLocaleString(undefined, {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: minDecimals,
      });
    }

    if (val === 0) return "0.00";

    const abs = Math.abs(val);
    let decimals = minDecimals;
    while (
      decimals < maxDecimals &&
      parseFloat(abs.toFixed(decimals)) === 0
    ) {
      decimals++;
    }

    return val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <span className="font-mono">
      {prefix}
      {getFormatted(animatedValue)}
      {suffix}
    </span>
  );
}
