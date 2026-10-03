// Forks can point the site, skill and llms.txt links at their own deployment
// and repo without touching code. Unset, they fall back to the original.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://craft.gustavofior.com";
export const SITE_NAME = "Craft";
export const SITE_DESCRIPTION = "A collection of design engineering concepts.";
export const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? "gustavo-fior/craft";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

export function githubSourceUrl(sourcePath?: string) {
  if (!sourcePath) return GITHUB_URL;
  return `${GITHUB_URL}/blob/main/content/${sourcePath}`;
}
