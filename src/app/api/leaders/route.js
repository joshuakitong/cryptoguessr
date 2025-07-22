import { db } from "@/app/lib/firebaseClient";
import { getDocs, collection, doc } from "firebase/firestore";
import { getCurrentMonthKey } from "@/app/utils/dateUtils";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const gameKey = searchParams.get("gameKey") || "all";
  const timeKey = searchParams.get("timeKey") || "allTime";

  const userDocs = await getDocs(collection(db, "users"));
  const results = [];

  for (const userDoc of userDocs.docs) {
    const uid = userDoc.id;
    const displayName = userDoc.data().displayName || "Anonymous";
    const gameKeys = gameKey === "all" ? ["cgScores", "bdScores", "goScores"] : [`${gameKey}Scores`];

    let total = 0;

    for (const gk of gameKeys) {
      const scoreDoc = await getDocs(collection(db, "users", uid, "scores"));
      const gameScoreDoc = scoreDoc.docs.find((d) => d.id === gk);
      if (!gameScoreDoc) continue;

      const scores = gameScoreDoc.data();
      for (const [date, score] of Object.entries(scores)) {
        if (typeof score !== "number") continue;
        if (timeKey === "monthly" && !date.startsWith(getCurrentMonthKey())) continue;
        total += score;
      }
    }

    results.push({ uid, displayName, total });
  }

  results.sort((a, b) => b.total - a.total);
  results.forEach((entry, i) => (entry.rank = i + 1));

  return Response.json(results);
}
