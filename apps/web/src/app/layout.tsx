import type { Metadata } from "next";
import { Amiri, Inter, Scheherazade_New } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
});

export const metadata: Metadata = {
  title: "Quran Web App",
  description:
    "Quran reader web application built with Next.js SSG, TypeScript, Tailwind CSS, and Hono-Bun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${amiri.variable} ${scheherazade.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}