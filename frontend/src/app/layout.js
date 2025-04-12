import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "MarketMind AI",
  description: "Your AI-powered marketing assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-gray-50 min-h-screen`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
