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

const themeScript = `
(function () {
  try {
    var storageKey = "quran-reader-settings";
    var stored = window.localStorage.getItem(storageKey);
    var theme = "light";

    if (stored) {
      var parsed = JSON.parse(stored);
      if (
        parsed &&
        (parsed.theme === "light" ||
          parsed.theme === "dark" ||
          parsed.theme === "sepia" ||
          parsed.theme === "system")
      ) {
        theme = parsed.theme;
      }
    }

    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.documentElement.dataset.readerTheme = theme;
    document.documentElement.style.colorScheme =
      theme === "dark" ? "dark" : "light";
  } catch {
    document.documentElement.dataset.readerTheme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body
        className={`${inter.variable} ${amiri.variable} ${scheherazade.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}