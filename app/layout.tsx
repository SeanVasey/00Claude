import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "00CLAUDE — The Not-so Secret Agent",
  description:
    "A library and IDE for Agent Skills, AGENTS.md, and CLAUDE.md. Discover, curate, version, test, and deploy agent capabilities.",
  manifest: "/manifest.json",
  applicationName: "00CLAUDE",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "00CLAUDE",
  },
  icons: {
    icon: [
      { url: "/icons/00Claude-refined.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: "/icons/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/apple-touch-icon-167.png", sizes: "167x167", type: "image/png" },
      { url: "/icons/apple-touch-icon-152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/apple-touch-icon-120.png", sizes: "120x120", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#2A2A2F",
  width: "device-width",
  initialScale: 1,
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
