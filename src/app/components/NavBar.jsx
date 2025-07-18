"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Info } from "lucide-react";
import GameInfoModal from "@/app/components/GameInfoModal";
import { coinGuessrGameInfo, bitdleGameInfo, gainOverGameInfo } from "@/app/data/gameInfo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isGamePage = ["/coinguessr", "/bitdle", "/gainover"].includes(pathname);
  const showLoginButton = isHomePage;

  function getPageTitle(pathname) {
    switch (pathname) {
      case "/":
        return "";
      case "/coinguessr":
        return "CoinGuessr";
      case "/bitdle":
        return "Bitdle";
      case "/gainover":
        return "Gain Over";
      default:
        return "";
    }
  }

  function getGameInfo(pathname) {
  switch (pathname) {
    case "/coinguessr":
      return coinGuessrGameInfo;
    case "/bitdle":
      return bitdleGameInfo;
    case "/gainover":
      return gainOverGameInfo;
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

          <h1 className={`text-4xl text-center font-bold ${isGamePage ? "mx-auto" : ""}`}>
            {title}
          </h1>

          {showLoginButton ? (
            <div className="flex gap-2 items-center">
              <button 
                className="bg-[#f7931a] hover:bg-[#e98209] text-white font-bold px-6 py-2 rounded-md cursor-pointer transition"
                onClick={() => alert("This feature is coming soon!")}
              >
                Login
              </button>
            </div>
          ) : (
            <>
              {isGamePage ? (
                <button
                  className="flex items-center justify-center w-[44px] h-[44px] text-white hover:text-[#f7931a] cursor-pointer transition"
                  onClick={() => setShowInfo(true)}
                >
                  <Info size={24} />
                </button>
              ) : (
                <div className="w-[44px]" />
              )}
            </>
          )}

          
        </div>

        <GameInfoModal
          show={showInfo}
          onClose={() => setShowInfo(false)}
          info={getGameInfo(pathname)}
          title={title}
        />
      </div>

      <div
        ref={navRef}
        className={`fixed top-0 left-0 h-full w-64 bg-[#0D1217] z-30 transform transition-transform duration-500 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center p-4">
            <Link
              className="font-bold text-2xl hover:text-[#f7931a] hover:underline transition-colors"
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

          <nav className="flex flex-col p-4 space-y-2">
            <Link
              className="flex items-center gap-2 text-semibold text-2xl p-4 border-2 border-gray-300 rounded-md hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all"
              href="/coinguessr"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/images/nav/coinguessr.png"
                alt="CoinGuessr logo"
                width={35}
                height={35}
              />
              <span className="ml-2">CoinGuessr</span>
            </Link>
            <Link
              className="flex items-center gap-2 text-semibold text-2xl p-4 border-2 border-gray-300 rounded-md hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all"
              href="/bitdle"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/images/nav/bitdle.png"
                alt="Bitdle logo"
                width={35}
                height={35}
              />
              <span className="ml-2">Bitdle</span>
            </Link>
            <Link
              className="flex items-center gap-2 text-semibold text-2xl p-4 border-2 border-gray-300 rounded-md hover:text-[#f7931a] hover:border-[#f7931a] hover:scale-105 transition-all"
              href="/gainover"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/images/nav/gainover.png"
                alt="Gain Over logo"
                width={35}
                height={35}
              />
              <span className="ml-2">Gain Over</span>
            </Link>
          </nav>
        </div>

        <div className="py-6 px-4">
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

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-20 transition-all duration-300 ${
          open ? "bg-black/30 backdrop-blur-[2px] opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
    </>
  );
}
