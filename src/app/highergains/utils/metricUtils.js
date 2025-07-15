import { metrics } from "./metricOptions";

export function getValidMetricsForPair(coin1, coin2) {
  return metrics.filter(({ key }) =>
    typeof coin1[key] === "number" &&
    typeof coin2[key] === "number" &&
    !isNaN(coin1[key]) &&
    !isNaN(coin2[key])
  );
}

export function getRandomValidMetric(coin1, coin2) {
  const valid = getValidMetricsForPair(coin1, coin2);
  if (!valid.length) return null;
  return valid[Math.floor(Math.random() * valid.length)];
}
