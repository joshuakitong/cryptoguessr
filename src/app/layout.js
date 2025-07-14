import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/NavBar.jsx";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "CryptoGuessr",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#0D1217] min-h-screen max-w-7xl mx-auto`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
