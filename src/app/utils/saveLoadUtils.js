import { db } from "@/app/lib/firebaseClient";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// === Shared ===
export function getTodayGMT8DateString() {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 8);
  return now.toISOString().split("T")[0];
}

function getLocalState(key, fallback = {}) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  }
  return fallback;
}

function setLocalState(key, value) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export async function getHasPlayedToday(uid, gameKey) {
  const today = getTodayGMT8DateString();

  if (!uid) {
    const local = getLocalState(gameKey);
    return Object.hasOwn(local, today);
  }

  const docRef = doc(db, "users", uid, "scores", gameKey);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return Object.hasOwn(docSnap.data(), today);
  }

  return false;
}

export async function getTodayScore(uid, gameKey) {
  const today = getTodayGMT8DateString();

  if (!uid) {
    const local = getLocalState(gameKey);
    return local[today] ?? null;
  }

  const docRef = doc(db, "users", uid, "scores", gameKey);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data()[today] ?? null;
  }

  return null;
}

export async function saveSessionScore(uid, score, gameKey) {
  const today = getTodayGMT8DateString();

  if (!uid) {
    const local = getLocalState(gameKey);
    local[today] = score;
    setLocalState(gameKey, local);
    return;
  }

  const docRef = doc(db, "users", uid, "scores", gameKey);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, { [today]: score });
  } else {
    await setDoc(docRef, { [today]: score });
  }
}

export async function getTotalScore(uid) {
  let total = 0;

  const gameKeys = ["cgScores", "bdScores", "goScores"];

  if (!uid) {
    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith("Scores")) {
          try {
            const scores = JSON.parse(localStorage.getItem(key));
            if (scores && typeof scores === "object") {
              total += Object.values(scores).reduce(
                (sum, score) => sum + (typeof score === "number" ? score : 0),
                0
              );
            }
          } catch (e) {
            console.warn(`Failed to parse local scores from ${key}`, e);
          }
        }
      }
    }
    return total;
  }

  for (const gameKey of gameKeys) {
    const docRef = doc(db, "users", uid, "scores", gameKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const scores = docSnap.data();
      total += Object.values(scores).reduce(
        (sum, score) => sum + (typeof score === "number" ? score : 0),
        0
      );
    }
  }

  return total;
}
