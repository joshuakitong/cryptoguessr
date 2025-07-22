"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || (!theme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark, mounted]);

  if (!mounted) return null;

  return (
    <div className="bottom-4 right-4 z-50">
      <button
        onClick={() => setIsDark(!isDark)}
        className="relative flex items-center w-20 h-10 rounded-full cursor-pointer 
        bg-gray-300 dark:bg-gray-800 shadow-inner transition-colors duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <Moon size={20} className="text-gray-400 dark:text-yellow-300 transition-colors duration-300" />
          <Sun size={20} className="text-yellow-500 dark:text-gray-400 transition-colors duration-300" />
        </div>

        <div
          className={`absolute w-8 h-8 rounded-full bg-[#dfe5ec] dark:bg-[#0d1217]
                      shadow-md transform transition-transform duration-300
                      ${isDark ? 'translate-x-1' : 'translate-x-11'}`}
        >
          <div className="flex items-center justify-center w-full h-full">
            {isDark ? (
              <Moon size={20} className="text-[#f7931a]" />
            ) : (
              <Sun size={20} className="text-[#f7931a]" />
            )}
          </div>
        </div>
      </button>
    </div>
  );
}