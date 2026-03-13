import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages && {
    output: "export",
    basePath: "/00Claude",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
