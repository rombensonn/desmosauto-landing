import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/desmosauto-landing";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGitHubPages ? `${githubPagesBasePath}/` : undefined,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ["lucide-react"]
  }
};

export default nextConfig;
