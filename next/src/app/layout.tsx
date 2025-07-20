import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MDP Creator",
  description: "Create and solve Markov Decision Processes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4 flex space-x-4 text-white">
          <Link href="/" className="hover:underline">🏠 Home</Link>
          <Link href="/mdp/demo/states" className="hover:underline">🧩 States</Link>
          <Link href="/mdp/demo/actions" className="hover:underline">🎯 Actions</Link>
          <Link href="/mdp/demo/rewards" className="hover:underline">💰 Rewards</Link>
          <Link href="/mdp/demo/solve" className="hover:underline">📈 Solve</Link>
          <Link href="/mdp/demo/mdp" className="hover:underline">🗂 View MDP</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
