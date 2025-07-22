"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/app/lib/firebaseClient";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff, Loader } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) {
        const emailName = user.email.split("@")[0];

        await setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
          displayName: emailName,
          createdAt: serverTimestamp(),
        });
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)] px-4">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          disabled={loading}
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="p-2 border rounded w-full"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            disabled={loading}
            name="password"
            value={form.password}
            onChange={handleChange}
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
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#f7931a] text-white py-2 rounded flex items-center justify-center transition cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e98209]"
          }`}
        >
          {loading ? <Loader className="animate-spin" size={20} /> : "Login"}
        </button>
      

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className={`bg-gray-500 py-2 px-4 rounded flex items-center justify-center transition cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
          }`}
        >
          {loading ? <Loader className="animate-spin" size={20} /> : "Continue with Google"}
        </button>
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-[#f7931a] hover:underline font-semibold">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}