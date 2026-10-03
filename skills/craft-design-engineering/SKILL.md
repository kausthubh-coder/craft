---
name: craft-design-engineering
description: 'Design engineering concepts from Craft (craft.gustavofior.com) for the small details that make interfaces feel right - typography, color, spacing and layout, interaction states, focus, forms, motion, sound, and data. Use when building, polishing or reviewing UI: buttons, hover/press/focus/disabled states, inputs and forms, menus, modals and drawers, empty and loading states, cards, borders, shadows, border radius, icons, numbers, tables, charts, animations, easings, transitions, or when the user says "make it feel better", "polish this", "something feels off", "review my UI", "add some craft", or asks about taste, whitespace, hierarchy, or design details.'
metadata:
  author: gustavo-fior
  source: https://craft.gustavofior.com
---

# Craft

A collection of design engineering concepts by Gustavo Fior. Each concept is a
short explainer with a rule you can apply directly, plus the CSS, Tailwind, or
React to do it. The live site pairs every concept with an interactive demo.

## How to use this skill

There are two modes. Pick the one that matches the request.

### Build mode: writing or changing UI

1. Find the concepts that match the work in the index below. A button needs
   interaction states, press, hover and hit areas; a form needs input details
   and focus rings; a table or timer needs tabular numbers; a modal needs
   overlays and scale entrances; anything with an image needs image outlines.
2. Read the matching section in `references/` before writing code. Each
   concept there has the full reasoning, the rule, and the code. Do not apply a
   concept from its one-line summary alone.
3. Apply the rule, and prefer the exact values from the reference (durations,
   easings, scales, radii, opacities, spacing steps) over inventing your own.
   Reuse the same few values everywhere instead of tuning each component.
4. Mention the concepts you applied in one line at the end, so the user can
   look them up.

### Review mode: "review", "audit", "polish" or "what feels off"

1. Read the code (and screenshots, if you can take them) with the index open.
   Check every state, not just the resting one: hover, pressed, focus,
   disabled, loading, empty, error, light and dark, narrow and wide. Read
   only the reference sections for concepts the code actually touches.
2. For each problem, confirm it against the reference before reporting it.
3. Report one table, most important first:

   | Severity | Where | Before | After | Concept |
   | --- | --- | --- | --- | --- |
   | High | `button.tsx:14` | `transition: all 300ms` on hover | Instant hover, `transition: transform 100ms ease-out` for press only | [Hover Restraint](https://craft.gustavofior.com/hover-restraint) |

   - **Severity**: High means people will notice it or it breaks access
     (focus, hit areas, contrast, layout shift). Medium means it reads as
     unpolished. Low is a refinement.
   - **Where** is `file:line` or the component name.
   - **Before / After** are concrete: values or code, not adjectives.
   - **Concept** links one concept, or two when they fix the same row
     together (Whitespace and Spacing Scale, Easings and Scale Entrances).
   - A review of one component or file is quick: at most 5 rows. A page, a
     flow, or "review my UI" is full: at most 15. Merge repeats of the same
     issue into one row, and drop Low rows first when you hit the cap.
4. If something matters but no concept covers it, add it after the table
   under **Outside Craft**, one line each, with no concept link.
5. End with one line offering to apply the fixes. Don't apply them unless
   asked.

The code samples in the references use Tailwind v4 (`outline-hidden`,
`shadow-(--var)`, `@theme`). Check the project's Tailwind version, and
translate to plain CSS or v3 syntax when it differs. Only cite a concept that
is in the index.

## Principles

- Details that nobody notices still compound. Correct defaults on radius,
  spacing, easing, and contrast are what make an interface feel finished.
- Consistency beats novelty. Reuse the same two or three easings, one spacing
  scale, the same radius ratios, and one shadow recipe across the product.
- Space and tone before decoration. Group with whitespace before borders, and
  quiet secondary content before making the primary thing louder.
- Motion has to earn its place. Frequent, intentional interactions should be
  instant; rare or spatial ones can animate. Reduce motion, don't remove meaning.
- Every control has more than one face. Design hover, pressed, focus,
  disabled, loading and empty states, not just the resting one.
- Respect physical intuition. Nothing appears from nothing, nested corners
  share a center, and light comes from above.

## Concept index

<!-- concepts:start -->
### Craft

- **Performance Is Design**: How fast it feels is a design choice. ([reference](references/craft.md#performance-is-design), [demo](https://craft.gustavofior.com/performance-is-design))
- **How to Get References**: Great work starts with great inputs. ([reference](references/craft.md#how-to-get-references), [demo](https://craft.gustavofior.com/how-to-get-references))
- **Novelty Budget**: Save delight for the rare moments. ([reference](references/craft.md#novelty-budget), [demo](https://craft.gustavofior.com/novelty-budget))
- **Taste Is Trained**: Taste is a skill, and it takes reps. ([reference](references/craft.md#taste-is-trained), [demo](https://craft.gustavofior.com/taste-is-trained))
- **Timelessness**: Surface ages fast. Structure doesn't. ([reference](references/craft.md#timelessness), [demo](https://craft.gustavofior.com/timelessness))

### Typography

- **Letter Spacing**: Tighten big text, loosen small text. ([reference](references/typography.md#letter-spacing), [demo](https://craft.gustavofior.com/letter-spacing))
- **Text Wrapping**: Balanced headings, no lonely last words. ([reference](references/typography.md#text-wrapping), [demo](https://craft.gustavofior.com/text-wrapping))
- **Tabular Numbers**: Steady digits for values that change. ([reference](references/typography.md#tabular-numbers), [demo](https://craft.gustavofior.com/tabular-numbers))
- **Optical Alignment**: Center for the eye, not the math. ([reference](references/typography.md#optical-alignment), [demo](https://craft.gustavofior.com/optical-alignment))
- **Icons**: One set, one weight, sized to the text. ([reference](references/typography.md#icons), [demo](https://craft.gustavofior.com/icons))
- **Font Smoothing**: Light text on dark renders heavier. ([reference](references/typography.md#font-smoothing), [demo](https://craft.gustavofior.com/font-smoothing))
- **Visual Hierarchy**: Quiet the rest so one thing leads. ([reference](references/typography.md#visual-hierarchy), [demo](https://craft.gustavofior.com/visual-hierarchy))
- **Line Length**: Lines short enough to find the next one. ([reference](references/typography.md#line-length), [demo](https://craft.gustavofior.com/line-length))

### Color

- **OKLCH**: Lightness values that look equal. ([reference](references/color.md#oklch), [demo](https://craft.gustavofior.com/oklch))
- **Noise**: Grain hides banding and adds texture. ([reference](references/color.md#noise), [demo](https://craft.gustavofior.com/noise))
- **Shadows, Not Borders**: Layered shadows give edge and depth. ([reference](references/color.md#shadows-not-borders), [demo](https://craft.gustavofior.com/shadows-not-borders))
- **Image Outlines**: A faint inner edge that frames images. ([reference](references/color.md#image-outlines), [demo](https://craft.gustavofior.com/image-outlines))

### Layout

- **Nested Border Radius**: Inner radius is outer minus padding. ([reference](references/layout.md#nested-border-radius), [demo](https://craft.gustavofior.com/nested-border-radius))
- **Hit Areas**: Make the target bigger than the icon. ([reference](references/layout.md#hit-areas), [demo](https://craft.gustavofior.com/hit-areas))
- **HTML Background**: Paint the canvas behind your page. ([reference](references/layout.md#html-background), [demo](https://craft.gustavofior.com/html-background))
- **Clip-Path**: Reveal by clipping, not resizing. ([reference](references/layout.md#clip-path), [demo](https://craft.gustavofior.com/clip-path))
- **Scroll Fades**: Fade the edge that has more to scroll. ([reference](references/layout.md#scroll-fades), [demo](https://craft.gustavofior.com/scroll-fades))
- **Squircles**: Corners that ease into the edge. ([reference](references/layout.md#squircles), [demo](https://craft.gustavofior.com/squircles))
- **Whitespace**: Space is how things group. ([reference](references/layout.md#whitespace), [demo](https://craft.gustavofior.com/whitespace))
- **Spacing Scale**: A few spaces, used everywhere. ([reference](references/layout.md#spacing-scale), [demo](https://craft.gustavofior.com/spacing-scale))

### Interaction

- **Interaction States**: Every control has more than one face. ([reference](references/interaction.md#interaction-states), [demo](https://craft.gustavofior.com/interaction-states))
- **Focus Rings**: Show keyboard users where they are. ([reference](references/interaction.md#focus-rings), [demo](https://craft.gustavofior.com/focus-rings))
- **Input Details**: Small attributes that make typing easy. ([reference](references/interaction.md#input-details), [demo](https://craft.gustavofior.com/input-details))
- **Empty States**: Say why it's empty and what to do next. ([reference](references/interaction.md#empty-states), [demo](https://craft.gustavofior.com/empty-states))
- **Command Menu**: One shortcut to reach everything. ([reference](references/interaction.md#command-menu), [demo](https://craft.gustavofior.com/command-menu))
- **Overlays**: Keep scroll and focus inside the layer. ([reference](references/interaction.md#overlays), [demo](https://craft.gustavofior.com/overlays))

### Motion

- **Icon Morph**: Blur, scale and fade between icons. ([reference](references/motion.md#icon-morph), [demo](https://craft.gustavofior.com/icon-morph))
- **Button Press**: Scale down on press so it feels real. ([reference](references/motion.md#button-press), [demo](https://craft.gustavofior.com/button-press))
- **Easings**: Ease-out for anything the user triggers. ([reference](references/motion.md#easings), [demo](https://craft.gustavofior.com/easings))
- **Stagger**: Turn one block into a sequence. ([reference](references/motion.md#stagger), [demo](https://craft.gustavofior.com/stagger))
- **Interruptibility**: Animation that can change its mind. ([reference](references/motion.md#interruptibility), [demo](https://craft.gustavofior.com/interruptibility))
- **Hover Restraint**: Frequent interactions should be instant. ([reference](references/motion.md#hover-restraint), [demo](https://craft.gustavofior.com/hover-restraint))
- **Shared Layout**: One element moving beats two swapping. ([reference](references/motion.md#shared-layout), [demo](https://craft.gustavofior.com/shared-layout))
- **Exit Animations**: Leave faster and quieter than you came. ([reference](references/motion.md#exit-animations), [demo](https://craft.gustavofior.com/exit-animations))
- **Scale Entrances**: Grow from the trigger, not from zero. ([reference](references/motion.md#scale-entrances), [demo](https://craft.gustavofior.com/scale-entrances))
- **Reduced Motion**: Reduce motion, keep meaning. ([reference](references/motion.md#reduced-motion), [demo](https://craft.gustavofior.com/reduced-motion))

### Sound

- **Interface SFX**: Quiet sounds that confirm actions. ([reference](references/sound.md#interface-sfx), [demo](https://craft.gustavofior.com/interface-sfx))
- **Layering Sounds**: Stack short sources into one full cue. ([reference](references/sound.md#layering-sounds), [demo](https://craft.gustavofior.com/layering-sounds))

### Data

- **Living Charts**: Charts that flow instead of jump. ([reference](references/data.md#living-charts), [demo](https://craft.gustavofior.com/living-charts))
- **Curve Smoothing**: Smooth lines that don't invent data. ([reference](references/data.md#curve-smoothing), [demo](https://craft.gustavofior.com/curve-smoothing))
<!-- concepts:end -->

## Keeping this skill current

This file's concept index and `references/` are generated from the site's
content with `bun run build:skill` in the Craft repository. Edit the
articles, not the references.
