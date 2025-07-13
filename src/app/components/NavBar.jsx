"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isGamePage = ["/coinguessr", "/bitpredict", "/higherlower"].includes(pathname);
  const showLoginButton = isHomePage;
  function getPageTitle(pathname) {
    switch (pathname) {
      case "/":
        return "";
      case "/coinguessr":
        return "CoinGuessr";
      case "/bitpredict":
        return "BitPredict";
      case "/higherlower":
        return "Higher/Lower";
      default:
        return "";
    }
  }

  const title = getPageTitle(pathname);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <div className="top-0 left-0 w-full">
        <div className="w-full mx-auto flex items-center justify-between px-4 py-6">
          <button
            onClick={() => setOpen(true)}
            className="text-white p-2 cursor-pointer hover:text-[#f7931a] transition-colors"
          >
            <Menu size={28} />
          </button>

          <h1 className={`text-4xl font-bold ${isGamePage ? "mx-auto" : ""}`}>
            {title}
          </h1>

          {showLoginButton ? (
            <div className="w-[44px]">
              <button 
                className="bg-[#f7931a] hover:bg-[#e98209] text-white font-bold px-6 py-2 -ml-[44px] rounded-md cursor-pointer transition"
                onClick={() => alert("This feature is coming soon!")}
              >
                Login
              </button>
            </div>
          ) : (
            <div className="w-[44px]" />
          )}
        </div>
      </div>

      <div
        ref={navRef}
        className={`fixed top-0 left-0 h-full w-64 bg-[#0D1217] z-30 transform transition-transform duration-500 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center p-4 text-2xl">
            <Link
              className="font-bold hover:text-[#f7931a] hover:underline transition-colors"
              href="/"
              onClick={() => setOpen(false)}
            >
              CryptoGuessr
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="text-white cursor-pointer hover:text-[#f7931a] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col p-4 space-y-4">
            <Link
              className="text-semibold text-lg p-2 border-1 border-white rounded-md hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all"
              href="/coinguessr"
              onClick={() => setOpen(false)}
            >
              CoinGuessr
            </Link>
            <Link
              className="text-semibold text-lg p-2 border-1 border-white rounded-md hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all"
              href="/bitpredict"
              onClick={() => setOpen(false)}
            >
              BitPredict
            </Link>
            <Link
              className="text-semibold text-lg p-2 border-1 border-white rounded-md hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all"
              href="/higherlower"
              onClick={() => setOpen(false)}
            >
              Higher/Lower
            </Link>
          </nav>
        </div>

        <div className="p-6">
          <nav className="flex flex-col space-y-4 pb-6">
            <Link
              className="text-semibold text-lg hover:text-[#f7931a] transition-colors"
              href="/"
              onClick={() => alert("This feature is coming soon!")}
            >
              Settings
            </Link>
            <Link
              className="text-semibold text-lg hover:text-[#f7931a] transition-colors"
              href="/"
              onClick={() => alert("This feature is coming soon!")}
            >
              Leaderboards
            </Link>
          </nav>
          <button
            className="w-full bg-[#f7931a] hover:bg-[#e98209] text-white font-bold px-6 py-2 rounded-md cursor-pointer transition"
            onClick={() => alert("This feature is coming soon!")}
          >
            Login
          </button>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px] transition-opacity"
        ></div>
      )}
    </>
  );
}
