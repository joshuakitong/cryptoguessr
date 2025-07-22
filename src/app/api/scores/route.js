import { db } from "@/app/lib/firebaseClient";
import { getDoc, doc } from "firebase/firestore";

const games = ["cgScores", "bdScores", "goScores"];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return new Response(JSON.stringify({ error: "Missing UID" }), { status: 400 });
  }

  const result = {};

  for (const gameKey of games) {
    const docRef = doc(db, "users", uid, "scores", gameKey);
    const docSnap = await getDoc(docRef);
    result[gameKey] = docSnap.exists() ? docSnap.data() : {};
  }

  return Response.json(result);
}