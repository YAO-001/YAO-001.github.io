import type { NextConfig } from "next";

const [githubOwner = "", githubRepository = ""] =
  process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isGithubUserSite =
  githubRepository.toLowerCase() === `${githubOwner.toLowerCase()}.github.io`;
const githubBasePath =
  process.env.GITHUB_ACTIONS === "true" && githubRepository && !isGithubUserSite
    ? `/${githubRepository}`
    : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: githubBasePath,
  assetPrefix: githubBasePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubBasePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
