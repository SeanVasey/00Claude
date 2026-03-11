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
      <body className="antialiased">{children}</body>
    </html>
  );
}
