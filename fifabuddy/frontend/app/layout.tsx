import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FIFABuddy — World Cup 2026 AI Agent DApp",
  description: "World Cup 2026 prediction market and AI agent dashboard on X Layer",
};

const ClientProviders = dynamic(() => import("./providers").then((m) => m.Providers), {
  ssr: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, background: "var(--bg)", color: "var(--text)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
