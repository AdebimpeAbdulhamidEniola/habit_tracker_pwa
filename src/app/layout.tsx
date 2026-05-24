import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits. Own your data.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#6366f1" />
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}