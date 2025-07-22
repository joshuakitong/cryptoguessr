"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Info } from "lucide-react";
import GameInfoModal from "@/app/components/GameInfoModal";
import DarkModeToggle from "@/app/components/DarkModeToggle";
import { coinGuessrGameInfo, bitdleGameInfo, gainOverGameInfo } from "@/app/data/gameInfo";
import { useUser } from "@/app/context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebaseClient";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSideDropdown, setShowSideDropdown] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, userLoading } = useUser();

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
      case "/auth/login":
        return "Login";
      case "/auth/register":
        return "Register";
      case "/auth/edit-account":
        return "Edit Account Details";
      case "/my-scores":
        return "My Scores";
      case "/leaderboards":
        return "Leaderboards";
      default:
        return "";
    }
  }

  const navGames = [
    { 
      title: "CoinGuessr", 
      href: "/coinguessr", 
      image: "/images/nav/coinguessr.png",
      alt: "CoinGuessr logo"
    },
    { 
      title: "Bitdle", 
      href: "/bitdle", 
      image: "/images/nav/bitdle.png", 
      alt: "Bitdle logo"
    },
    { 
      title: "Gain Over", 
      href: "/gainover", 
      image: "/images/nav/gainover.png", 
      alt: "Gain Over logo"
    },
  ];

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

  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setShowDropdown(false);
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    if (!showSideDropdown) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest(".side-user-dropdown")) {
        setShowSideDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSideDropdown]);

  return (
    <>
      <div className="top-0 left-0 w-full">
        <div className="w-full mx-auto flex items-center justify-between px-4 py-6">
          <button
            onClick={() => setOpen(true)}
            className="p-2 cursor-pointer hover:text-[#f7931a] transition-colors"
          >
            <Menu size={28} />
          </button>

          <h1 className={`text-4xl text-center font-bold mx-auto`}>
            {title}
          </h1>

          {showLoginButton ? (
            <div className="flex gap-2 items-center relative">
              {userLoading ? (
                <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="bg-[#f7931a] max-w-42 truncate hover:bg-[#e98209] text-white font-bold px-6 py-2 rounded-md cursor-pointer transition"
                  >
                    {user.firestoreDisplayName || "User"}
                  </button>

                  {showDropdown && (
                    <div className="user-dropdown absolute right-0 mt-2 bg-[#0d1217] dark:bg-[#dfe5ec] text-white dark:text-black shadow-lg rounded-md overflow-hidden w-48 z-50">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-300 cursor-pointer"
                        onClick={() => {
                          setShowDropdown(false);
                          router.push("/auth/edit-account");
                        }}
                      >
                        Edit Account Details
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-300 cursor-pointer"
                        onClick={() => {
                          setShowDropdown(false);
                          signOut(auth);
                          router.push("/auth/login");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className="bg-[#f7931a] hover:bg-[#e98209] text-white font-bold px-6 py-2 rounded-md cursor-pointer transition"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </button>
              )}
            </div>
          ) : (
            <>
              {isGamePage ? (
                <button
                  className="flex items-center justify-center w-[44px] h-[44px] hover:text-[#f7931a] cursor-pointer transition"
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
        className={`fixed top-0 left-0 h-full w-64 bg-[#dfe5ec] dark:bg-[#0d1217] z-30 transform transition-transform duration-500 ${
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
              className="cursor-pointer hover:text-[#f7931a] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col p-4 space-y-2">
            {navGames.map((game) => (
              <Link
                key={game.title}
                href={game.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 font-semibold text-2xl p-4 border-2 rounded-md hover:text-[#f7931a] hover:border-[#f7931a] 
                hover:scale-105 transition-all border-gray-800 dark:border-gray-300"
              >
                <Image
                  src={game.image}
                  alt={game.alt}
                  width={35}
                  height={35}
                />
                <span className="ml-2">{game.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="py-6 px-4">
          <nav className="flex flex-col space-y-4 pb-6">
            <DarkModeToggle />
            <Link
              className="font-semibold text-lg hover:text-[#f7931a] transition-colors"
              href="/my-scores"
              onClick={() => setOpen(false)}
            >
              My Scores
            </Link>
            <Link
              className="font-semibold text-lg hover:text-[#f7931a] transition-colors"
              href="/leaderboards"
              onClick={() => setOpen(false)}
            >
              Leaderboards
            </Link>
          </nav>
          {userLoading ? (
            <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => {
                  if (showSideDropdown) {
                    setShowSideDropdown(false);
                  } else {
                    setShowSideDropdown(true);
                  }
                }}
                className="w-full bg-[#f7931a] hover:bg-[#e98209] text-white font-bold px-6 py-2 rounded-md cursor-pointer transition"
              >
                {user.firestoreDisplayName || "User"}
              </button>

              {showSideDropdown && (
                <div className="side-user-dropdown absolute bottom-12 w-full bg-[#0d1217] dark:bg-[#dfe5ec] text-white dark:text-black shadow-lg rounded-md overflow-hidden z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-300 cursor-pointer"
                    onClick={() => {
                      setShowSideDropdown(false);
                      setOpen(false);
                      router.push("/auth/edit-account");
                    }}
                  >
                    Edit Account Details
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-300 cursor-pointer"
                    onClick={() => {
                      setShowSideDropdown(false);
                      setOpen(false);
                      signOut(auth);
                      router.push("/auth/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="w-full truncate bg-[#f7931a] hover:bg-[#e98209] text-white font-bold px-6 py-2 rounded-md cursor-pointer transition"
              onClick={() => {
                router.push("/auth/login");
                setOpen(false);
              }}
            >
              Login
            </button>
          )}
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
