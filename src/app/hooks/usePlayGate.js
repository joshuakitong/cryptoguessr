import { useState, useEffect } from "react";
import { getHasPlayedToday } from "@/app/utils/saveLoadUtils";

export default function usePlayGate(storageKey) {
  const [playedToday, setPlayedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const result = getHasPlayedToday(storageKey);
    setPlayedToday(result);
    setIsLoading(false);
  }, [storageKey]);

  return { playedToday, isLoading };
}