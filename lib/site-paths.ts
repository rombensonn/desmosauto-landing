const githubPagesBasePath = "/desmosauto-landing";
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const publicAssetVersion = process.env.NEXT_PUBLIC_ASSET_VERSION?.trim();

export const siteBasePath = isGitHubPages ? githubPagesBasePath : "";
export const defaultSiteUrl = isGitHubPages
  ? `https://rombensonn.github.io${githubPagesBasePath}`
  : "http://localhost:3000";

export function assetPath(path: string) {
  if (isExternalPath(path) || !path.startsWith("/")) {
    return path;
  }

  if (siteBasePath && (path === siteBasePath || path.startsWith(`${siteBasePath}/`))) {
    return withPublicAssetVersion(path);
  }

  return withPublicAssetVersion(`${siteBasePath}${path}`);
}

function isExternalPath(path: string) {
  return path.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(path);
}

function withPublicAssetVersion(path: string) {
  if (!publicAssetVersion || !isVersionedPublicImage(path)) {
    return path;
  }

  return `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(publicAssetVersion)}`;
}

function isVersionedPublicImage(path: string) {
  const publicPath = siteBasePath && path.startsWith(`${siteBasePath}/`)
    ? path.slice(siteBasePath.length)
    : path;

  return publicPath.startsWith("/images/") || publicPath.startsWith("/project-previews/");
}
