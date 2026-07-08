const githubPagesBasePath = "/desmosauto-landing";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

export const siteBasePath = isGitHubPages ? githubPagesBasePath : "";
export const defaultSiteUrl = isGitHubPages
  ? `https://rombensonn.github.io${githubPagesBasePath}`
  : "http://localhost:3000";

export function assetPath(path: string) {
  if (isExternalPath(path) || !path.startsWith("/")) {
    return path;
  }

  if (siteBasePath && (path === siteBasePath || path.startsWith(`${siteBasePath}/`))) {
    return path;
  }

  return `${siteBasePath}${path}`;
}

function isExternalPath(path: string) {
  return path.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(path);
}
