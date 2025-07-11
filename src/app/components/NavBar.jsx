"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

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
        <div className="w-full max-w-full flex items-center justify-between px-4 sm:px-8 lg:px-52 py-6">
          <button
            onClick={() => setOpen(true)}
            className="text-white p-2 cursor-pointer hover:text-[#f7931a] transition-colors"
          >
            <Menu size={28} />
          </button>
          <button className="bg-[#f7931a] hover:bg-[#e98209] text-white font-bold px-6 py-2 rounded-md cursor-pointer transition duration-150">
            Login
          </button>
        </div>
      </div>

      <div
        ref={navRef}
        className={`fixed top-0 left-0 h-full w-64 bg-[#0D1217] z-30 transform transition-transform duration-500 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 text-2xl">
          <Link className="font-bold hover:text-[#f7931a] hover:underline transition-colors" href="/" onClick={() => setOpen(false)}>CryptoGuessr</Link>
          <button
            onClick={() => setOpen(false)}
            className="text-white cursor-pointer hover:text-[#f7931a] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-6 space-y-4">
          <Link className="text-semibold text-lg hover:text-[#f7931a] transition-colors" href="/coin-guessr" onClick={() => setOpen(false)}>CoinGuessr</Link>
          <Link className="text-semibold text-lg hover:text-[#f7931a] transition-colors" href="/price-prediction" onClick={() => setOpen(false)}>Price Prediction</Link>
          <Link className="text-semibold text-lg hover:text-[#f7931a] transition-colors" href="/higher-or-lower" onClick={() => setOpen(false)}>Higher/Lower</Link>
        </nav>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px]"
        ></div>
      )}
    </>
  );
}