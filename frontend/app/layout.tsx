import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIFABuddy | X Layer Mainnet AI Copilot",
  description: "World Cup 2026 AI prediction market, agent, and copy-trading dashboard on X Layer mainnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-bootstrap" strategy="beforeInteractive">{`
          (() => {
            try {
              const key = "fifabuddy-theme";
              const saved = window.localStorage.getItem(key);
              const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
              const theme = saved === "light" || saved === "dark" ? saved : prefersLight ? "light" : "dark";
              document.documentElement.dataset.theme = theme;
              document.documentElement.style.colorScheme = theme;
            } catch (error) {
              document.documentElement.dataset.theme = "dark";
              document.documentElement.style.colorScheme = "dark";
            }
          })();
        `}</Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
