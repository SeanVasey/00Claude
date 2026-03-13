import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "00CLAUDE — The Not-so Secret Agent",
  description:
    "A library and IDE for Agent Skills, AGENTS.md, and CLAUDE.md. Discover, curate, version, test, and deploy agent capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Reddit+Sans:ital,wght@0,200..900;1,200..900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
