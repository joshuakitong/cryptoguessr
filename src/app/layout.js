import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/NavBar.jsx";
import { UserProvider } from "@/app/context/UserContext";

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
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0d1217] min-h-screen max-w-7xl mx-auto`}>
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
