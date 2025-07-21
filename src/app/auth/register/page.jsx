"use client";

import { useState } from "react";
import { auth, db } from "@/app/lib/firebaseClient";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkDisplayNameUnique = async (name) => {
    const q = query(collection(db, "users"), where("displayName", "==", name));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  };

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!(await checkDisplayNameUnique(displayName))) {
      setError("Display name is already taken");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const emailName = user.email.split("@")[0];

      let nameToUse = emailName;
      let counter = 1;
      while (!(await checkDisplayNameUnique(nameToUse))) {
        nameToUse = `${emailName}${counter}`;
        counter++;
      }

      await updateProfile(user, { displayName: nameToUse });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: nameToUse,
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)]">
      <h1 className="text-2xl font-bold">Register</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          disabled={loading}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          disabled={loading}
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="p-2 border rounded"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="p-2 pr-10 border rounded w-full"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            disabled={loading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="p-2 pr-10 border rounded w-full"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={`bg-[#f7931a] text-white py-2 rounded flex items-center justify-center transition cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e98209]"
          }`}
        >
          {loading ? <Loader className="animate-spin" size={20} /> : "Register"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleRegister}
          className={`bg-gray-500 py-2 px-4 rounded flex items-center justify-center transition cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
          }`}
        >
          {loading ? <Loader className="animate-spin" size={20} /> : "Continue with Google"}
        </button>

        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#f7931a] hover:underline font-semibold">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
