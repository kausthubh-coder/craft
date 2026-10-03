const LAUNCH_CONCEPT_SLUGS = new Set([
  "how-to-get-references",
  "novelty-budget",
  "performance-is-design",
  "taste-is-trained",
  "timelessness",
  "font-smoothing",
  "icons",
  "letter-spacing",
  "line-length",
  "optical-alignment",
  "tabular-numbers",
  "text-wrapping",
  "visual-hierarchy",
  "image-outlines",
  "noise",
  "oklch",
  "shadows-not-borders",
  "clip-path",
  "hit-areas",
  "html-background",
  "nested-border-radius",
  "scroll-fades",
  "spacing-scale",
  "squircles",
  "whitespace",
  "command-menu",
  "empty-states",
  "focus-rings",
  "input-details",
  "interaction-states",
  "overlays",
  "button-press",
  "easings",
  "exit-animations",
  "hover-restraint",
  "icon-morph",
  "interruptibility",
  "reduced-motion",
  "scale-entrances",
  "shared-layout",
  "stagger",
  "interface-sfx",
  "layering-sounds",
  "curve-smoothing",
  "living-charts",
]);

/** True only for concepts that are live in production. */
export function isConceptLaunched(slug: string) {
  return LAUNCH_CONCEPT_SLUGS.has(slug);
}

// Unlaunched concepts are enabled everywhere (sidebar, command menu, pages,
// sitemap, llms.txt, OG images) during local development only.
export function isConceptAvailable(slug: string) {
  if (process.env.NODE_ENV === "development") return true;
  return isConceptLaunched(slug);
}
