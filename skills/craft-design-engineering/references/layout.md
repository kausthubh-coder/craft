# Layout

## Nested Border Radius

> Inner radius is outer minus padding.

- Section: Layout
- URL: https://craft.gustavofior.com/nested-border-radius
- Published: 2026-07-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/nested-border-radius.mdx

Rounded corners look best when one curve follows the other. If a box sits
inside another box, using the same radius on both usually makes the gap wider
near the corner.

This is one of those little things that makes an interface feel off.

> **Interactive demo: Nested Radius.** Open https://craft.gustavofior.com/nested-border-radius to try it.

The fix is a simple relationship:

> **outer radius = inner radius + inset**

The inset is the distance between the two edges. It is often the parent’s
padding. If the parent has a border, include its width too.

In the demo, the inner radius is `16px` and the inset is `12px`. That makes the
outer radius `28px`.

### Start from the outer radius

Design systems usually start with a radius on the outer component. In that
case, reverse the formula:

> **inner radius = outer radius − inset**

> **Interactive demo: Radius Calculator.** Open https://craft.gustavofior.com/nested-border-radius to try it.

The inner radius cannot go below zero. If the inset is larger than the outer
radius, use a square inner corner. In CSS, `max()` can handle that limit for
you.

### Real components

The difference is easier to see in a card or a menu than in an empty diagram.

> **Interactive demo: Nested Radius Examples.** Open https://craft.gustavofior.com/nested-border-radius to try it.

The card has a `16px` outer radius and an `8px` inset, so its media uses `8px`.
The menu has a `12px` outer radius and a `4px` inset, so its highlighted item
uses `8px`.

### When to adjust it

The formula is a strong starting point, not a rule for every shape. Tune the
result by eye when the inset changes around the component, the inner element
does not reach the corner, or the surfaces use different corner shapes.

The fancy name for this is **concentric corners**: nested corners whose curves
share the same center.

### Resources

- [The math behind nesting rounded corners](https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/): Cloud Four’s explanation of the radius formula with practical CSS examples.
- [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-radius): MDN’s reference for the CSS border-radius property.
- [CSS corner shaping](https://www.w3.org/TR/css-backgrounds-3/#corners): The specification for outer, padding, and content edge radii.


## Hit Areas

> Make the target bigger than the icon.

- Section: Layout
- URL: https://craft.gustavofior.com/hit-areas
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/hit-areas.mdx

A **hit area** is the part of an element that responds to a click or tap. It
does not have to match what you can see. A 16px icon can sit in a 32px
button, and nobody notices the extra space until it is missing.

> **Interactive demo: Hit Areas Toolbar.** Open https://craft.gustavofior.com/hit-areas to try it.

The two toolbars look the same. Hover across them, then show the hit areas.
The left one asks you to land on the icon itself.

**Make the hit area bigger than the thing you can see.**

### How big

The numbers most guidance agrees on:

- **24 × 24px:** the WCAG 2.2 minimum (2.5.8, level AA). A smaller target
  only passes if it has enough empty space around it.
- **44 × 44px:** the enhanced level (2.5.5, AAA). Apple uses the same 44 by
  44 points as the default size for iOS controls.
- **48 × 48dp:** what Android and Material ask for on touch.

I treat 24px as the floor for anything clickable and 32px as a comfortable
size for icon buttons on desktop. On touch, aim for 44px.

### Extend the target, not the icon

Sometimes a bigger button would look wrong, like the close button on a chip.
Keep the visible circle small and stretch an invisible pseudo-element over
it. Drag the slider and try to hit the close buttons.

> **Interactive demo: Hit Areas Expand.** Open https://craft.gustavofior.com/hit-areas to try it.

The button is 14px. An `::after` with `inset: -8px` turns it into a 30px
target, and the chip looks exactly the same.

### Gaps are dead zones

The space between two targets belongs to neither. Move slowly down the left
menu and the highlight drops out between items. A click there does nothing.

> **Interactive demo: Hit Areas Gap.** Open https://craft.gustavofior.com/hit-areas to try it.

On the right the items touch. The breathing room comes from padding inside
each item, so every pixel of the menu does something.

### Usage

**Tailwind**

```html
<!-- A 16px icon in a 32px button -->
<button class="grid size-8 place-items-center" aria-label="Bold">
  <svg class="size-4">...</svg>
</button>

<!-- A 14px button with a 30px target -->
<button class="relative size-3.5 after:absolute after:-inset-2" aria-label="Remove">
  <svg class="size-2.5">...</svg>
</button>
```

**CSS**

```css
.close {
  position: relative;
  width: 14px;
  height: 14px;
}

/* Invisible, but it takes the click */
.close::after {
  content: "";
  position: absolute;
  inset: -8px;
}
```

Don't let an extended area spill onto a neighbor. Where two hit areas
overlap, the one painted on top wins, and a click meant for one lands on the
other.

### Resources

- [Understanding 2.5.8: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): The WCAG 2.2 AA rule of 24 by 24 CSS pixels, and how the spacing exception works.
- [Understanding 2.5.5: Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html): The stricter AAA level of 44 by 44 CSS pixels.
- [Apple Human Interface Guidelines on control sizes](https://developer.apple.com/design/human-interface-guidelines/accessibility#Mobility): Default and minimum control sizes for every Apple platform, from 44 by 44 points on iOS up.
- [Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps): Android's guidance that every touch target should be at least 48 by 48dp.
- [Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design): Rauno Freiberg on Fitts's law and why big, close targets are faster to hit.


## HTML Background

> Paint the canvas behind your page.

- Section: Layout
- URL: https://craft.gustavofior.com/html-background
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/html-background.mdx

Pull past the top of a dark page in Safari and a white strip can appear behind
it. The app is dark, but the document canvas is still white.

The canvas is the surface the browser paints behind the page.

> **Interactive demo: Html Background.** Open https://craft.gustavofior.com/html-background to try it.

### The document canvas

A wrapper only paints its own box. When it moves during overscroll, the canvas
shows through. Set the background on the root element to paint that surface
too.

Browsers normally use the `body` background when `html` is transparent.
Setting it on `html` directly makes the intended canvas color clear and does
not rely on that behavior.

### Other edges

- **Theme color:** The `theme-color` meta tag can tint supported browser UI to
  match the page. Keep it in sync when the theme changes.
- **Overscroll:** `overscroll-behavior: none` can remove the bounce and stop
  scroll chaining. Use it carefully. The bounce is a familiar part of the
  platform.
- **Both themes:** The root background must follow the active theme, or the
  white flash can return in one mode.

### Usage

**Tailwind**

```html
<html class="bg-background">
```

**CSS**

```css
html {
  background-color: var(--background);
}
```

Use the same background token for the root and the app. If the theme changes,
that token should change with it.

### Resources

- [HTML vs Body in CSS](https://css-tricks.com/html-vs-body-in-css/): A practical look at how the root and body elements behave.
- [Canvas backgrounds](https://www.w3.org/TR/css-backgrounds-3/#special-backgrounds): How browsers paint the document canvas from the root or body.
- [overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior): Control what happens when scrolling reaches a boundary.
- [theme-color](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color): Match supported browser chrome to the page background.


## Clip-Path

> Reveal by clipping, not resizing.

- Section: Layout
- URL: https://craft.gustavofior.com/clip-path
- Published: 2026-07-16
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/clip-path.mdx

`clip-path` hides part of an element without touching its layout. The box
keeps its size and the text keeps its wrapping. Only the visible window
changes.

> **Interactive demo: Clip Path Reveal.** Open https://craft.gustavofior.com/clip-path to try it.

The left card animates its width, so its text gets squeezed into an ellipsis
on every frame. The right card is clipped, so it wipes away in one piece.

**Animate the window, not the box.** A width change makes the browser
recalculate layout on every frame. A clip change only repaints.

### Tabs

A segmented control has a pill that slides between options, and the label
under it changes color. If you transition each label's `color`, one label
fades out while the next fades in, and for a moment both are half gray.

Instead, render the tabs twice. The copy on top has inverted colors and is
clipped down to the pill. Then animate the clip.

> **Interactive demo: Clip Path Tabs.** Open https://craft.gustavofior.com/clip-path to try it.

The text on the right switches color exactly at the pill's edge. The
segmented controls on this site work the same way.

### Hold to delete

A destructive action can ask for a short hold. Render the red state on top,
clipped to zero width, and reveal it while the button is held.

> **Interactive demo: Clip Path Hold.** Open https://craft.gustavofior.com/clip-path to try it.

The reveal runs for `1.5s` with a linear curve, so the progress reads as
time. Letting go snaps it back in `200ms` with an ease-out. Nobody wants to
wait for a cancel.

### Comparison slider

Stack two images of the same size and clip the top one. Moving the clip edge
gives you a before and after slider. Neither image moves or stretches.

> **Interactive demo: Clip Path Compare.** Open https://craft.gustavofior.com/clip-path to try it.

### Usage

**Tailwind**

```html
<div
  class="transition-[clip-path] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] [clip-path:inset(0_0_0_0)] data-hidden:[clip-path:inset(0_100%_0_0)]"
>
  ...
</div>
```

**CSS**

```css
.card {
  /* top right bottom left */
  clip-path: inset(0 0 0 0);
  transition: clip-path 500ms cubic-bezier(0.23, 1, 0.32, 1);
}

.card[data-hidden] {
  clip-path: inset(0 100% 0 0);
}
```

`clip-path` cuts off everything outside the box, including shadows and focus
rings. Negative values give them room. The card in the first demo goes from
`inset(-16px)` to `inset(-16px calc(100% + 16px) -16px -16px)`.

### Resources

- [The Magic of Clip Path](https://emilkowal.ski/ui/the-magic-of-clip-path): Emil Kowalski walks through tabs, hold-to-delete buttons, and comparison sliders built with a single property.
- [clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path): MDN's reference for every shape clip-path accepts, and how they animate.
- [inset()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/basic-shape/inset): The shape you will use most, including the round keyword for rounded corners.
- [How to create high-performance CSS animations](https://web.dev/articles/animations-guide): Why animating width and height is expensive, and which properties are cheaper.


## Scroll Fades

> Fade the edge that has more to scroll.

- Section: Layout
- URL: https://craft.gustavofior.com/scroll-fades
- Published: 2026-07-16
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/scroll-fades.mdx

A list cut off by a hard edge looks like it ends there. A **scroll fade**
dissolves the last visible row into the background, so the reader knows there
is more without looking for a scrollbar.

> **Interactive demo: Scroll Fades.** Open https://craft.gustavofior.com/scroll-fades to try it.

The fade is a `mask-image` gradient. Where the gradient is transparent the
content is hidden, and where it is black the content shows. Because it is a
mask and not an overlay, it works on any background and never blocks a click.

### Follow the scroll

A static mask fades the first row while you are at the top, and the last row
when there is nothing below it. That last one lies. The final item looks like
something is still hiding under it.

**Fade an edge only when there is more to scroll past it.**

> **Interactive demo: Scroll Fades Edge.** Open https://craft.gustavofior.com/scroll-fades to try it.

Scroll both lists to the top and the bottom. The right list grows each fade
over the first `40px` of scroll in that direction, so it follows the scroll
instead of popping in.

### With scroll-driven animations

This needs no JavaScript. `animation-timeline: scroll(self)` ties an animation
to the element's own scroll position, and `animation-range` limits it to the
first and last `40px`. The two fade sizes are custom properties registered
with `@property`, so they can animate.

The same rule works sideways with `scroll(self x)`.

> **Interactive demo: Scroll Fades Horizontal.** Open https://craft.gustavofior.com/scroll-fades to try it.

### Usage

**Tailwind**

```html
<!-- Static fade, 40px at both ends -->
<div
  class="h-44 overflow-y-auto mask-[linear-gradient(to_bottom,transparent,black_40px,black_calc(100%-40px),transparent)]"
>
  ...
</div>
```

**CSS**

```css
@property --fade-start {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}

@property --fade-end {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}

@keyframes fade-start {
  from { --fade-start: 0px; }
  to { --fade-start: 40px; }
}

@keyframes fade-end {
  from { --fade-end: 40px; }
  to { --fade-end: 0px; }
}

.list {
  overflow-y: auto;
  --fade-start: 40px;
  --fade-end: 40px;
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black var(--fade-start),
    black calc(100% - var(--fade-end)),
    transparent
  );
}

@supports (animation-timeline: scroll()) {
  .list {
    --fade-start: 0px;
    --fade-end: 0px;
    animation: fade-start linear both, fade-end linear both;
    animation-timeline: scroll(self);
    animation-range: 0 40px, calc(100% - 40px) 100%;
  }
}
```

Scroll-driven animations work in Chrome and Edge 115+ and Safari 26+. As of
October 2026, Firefox only has them in Nightly, so the `@supports` block keeps
the static fade there. If you need the scroll-linked fade in Firefox too, set
the two properties from a `scroll` listener, as the demos on this page do.

### Resources

- [mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image): MDN's reference for the property that does the fading.
- [scroll()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/scroll): The function that ties an animation to a scroll container's position.
- [Animate elements on scroll with scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations): The Chrome team's guide to scroll and view timelines, with live demos.
- [Detect if an element can scroll or not](https://www.bram.us/2023/09/16/solved-by-css-scroll-driven-animations-detect-if-an-element-can-scroll-or-not/): Bramus Van Damme on using a scroll timeline to style a container only when it overflows.
- [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property): How to register a custom property so it can animate.


## Squircles

> Corners that ease into the edge.

- Section: Layout
- URL: https://craft.gustavofior.com/squircles
- Published: 2026-09-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/squircles.mdx

A normal rounded corner is a quarter circle. The straight edge runs along,
then the arc starts, and there is a point where one turns into the other. You
can feel that point even when you cannot see it.

A squircle removes it. The curve starts earlier and eases into the edge, so
the corner has no clear beginning or end. It is the shape of an iOS app icon,
and it is why those icons look softer than a box with the same radius.

> **Interactive demo: Squircle Compare.** Open https://craft.gustavofior.com/squircles to try it.

Both tiles use the same `28px` radius. Only the corner shape changes.

**Keep the radius, change the shape.** `border-radius` still sets how big the
corner is, and `corner-shape` sets the curve that fills it. Because the shape
belongs to the box, the background, border, outline, shadow and
`overflow: hidden` all follow it.

### How much curve

The keywords are named points on one scale, `superellipse()`. Drag the slider
to move along it. The dashed line is a plain round corner with the same
radius.

> **Interactive demo: Squircle Curvature.** Open https://craft.gustavofior.com/squircles to try it.

`1` is `round`, `2` is `squircle` and `0` is a flat `bevel`. Negative values
scoop inwards. Past `2` the curve hugs the corner more and more, until it
looks square again.

Notice that at the same radius a squircle covers more of the corner than a
round one does. If you swap the shape on an existing component and the
corner suddenly looks smaller, raise the radius until it feels as soft.

### Where it shows

The effect scales with the radius. A big radius on a small box, like an
avatar or an app icon, changes character completely. A small radius on a
button barely moves, and that is fine.

> **Interactive demo: Squircle Examples.** Open https://craft.gustavofior.com/squircles to try it.

The shape is not inherited, so set it on nested boxes too, and keep the outer
radius equal to the inner radius plus the inset. The card above uses `24px`
outside, `16px` inside and an `8px` inset.

### Usage

**Tailwind**

```html
<div class="rounded-[28px] corner-squircle">
```

**CSS**

```css
.icon {
  border-radius: 28px;
  corner-shape: squircle;
}
```

The Tailwind utility comes from the
[corner-shape plugin](https://github.com/toolwind/corner-shape). As of October
2026, `corner-shape` ships in Chrome and Edge 139+. Firefox and Safari only
have it in preview builds. Everywhere else the property is ignored and you get
the plain round corner from `border-radius`, which is fine for most UI. If the
shape is part of the brand, like an app icon, generate the path with
`figma-squircle` and apply it as a mask inside
`@supports not (corner-shape: squircle)`.

### Resources

- [corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape): MDN's reference for the property, its keywords and the superellipse() function.
- [CSS Borders 4, corner shaping](https://www.w3.org/TR/css-borders-4/#corner-shaping): The specification for corner-shape and how the curve is defined.
- [The corner cases of implementing CSS corner-shape in Blink](https://developer.chrome.com/blog/implementing-corner-shape): How Chrome draws borders and shadows that follow a superellipse.
- [Desperately seeking squircles](https://www.figma.com/blog/desperately-seeking-squircles/): Figma's story of reverse-engineering Apple's icon curve, and why it feels smoother.
- [figma-squircle](https://github.com/phamfoo/figma-squircle): Generates squircle SVG paths for browsers without corner-shape.


## Whitespace

> Space is how things group.

- Section: Layout
- URL: https://craft.gustavofior.com/whitespace
- Published: 2026-10-02
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/whitespace.mdx

Before borders, cards or dividers, space is how you group things. We read
elements that sit close together as one unit and elements that sit apart as
separate ones. When every gap is the same, nothing belongs to anything.

**Gaps inside a group should be about half the gaps between groups, or less.**

> **Interactive demo: Whitespace.** Open https://craft.gustavofior.com/whitespace to try it.

With equal spacing, each label is 16px from its own field and 16px from the
field above it, so it belongs to neither. The grouped version uses three
gaps: 8px from label to field, 16px between fields and 32px between sections.
Each level doubles the last, and that is enough for the eye to read the
structure without a single line.

### Headings belong below

A heading names what comes after it, so it should sit closer to that content.
Give it about twice as much space above as below. In the demo, Notifications
has 32px above it and 16px below.

### Space before lines

Dividers and cards are the usual fix for a layout that reads as one long list.
They work, but often they are doing a job the spacing should have done.
Remove the lines and see what is left.

> **Interactive demo: Whitespace Dividers.** Open https://craft.gustavofior.com/whitespace to try it.

On the left, every row is 12px apart and the dividers carry all the grouping.
Without them it is five equal rows. On the right, the lines are optional. Get
the spacing right first, then add a line or a [shadow](https://craft.gustavofior.com/shadows-not-borders)
only where it still helps.

### Squint

Blur a layout, or squint at it, and the text turns into blocks. Good spacing
leaves a few clear clusters. Equal spacing leaves a ladder of stripes.

> **Interactive demo: Whitespace Squint.** Open https://craft.gustavofior.com/whitespace to try it.

It is the same blur test as in [optical alignment](https://craft.gustavofior.com/optical-alignment),
applied to a whole screen.

### Usage

Put the spacing on the parent with `gap`, one container per group. The
nesting in the markup then matches the grouping on screen.

**Tailwind**

```html
<form class="flex flex-col gap-8">
  <section class="flex flex-col gap-4">
    <h2>Profile</h2>
    <label class="flex flex-col gap-2">
      Name
      <input />
    </label>
    <label class="flex flex-col gap-2">
      Email
      <input />
    </label>
  </section>
  <section class="flex flex-col gap-4">...</section>
</form>
```

**CSS**

```css
form,
section,
label {
  display: flex;
  flex-direction: column;
}

form {
  gap: 32px;
}

section {
  gap: 16px;
}

label {
  gap: 8px;
}
```

Padding counts as space too. A 32px menu item with a 16px line of text
already has 8px of padding above and below it, so a 4px gap between groups
barely shows. Compare
the space between the text, not between the boxes. The values themselves come
from a [spacing scale](https://craft.gustavofior.com/spacing-scale).

### Resources

- [Proximity Principle in Visual Design](https://www.nngroup.com/articles/gestalt-proximity/): Nielsen Norman Group on why things that sit close together read as one group.
- [Form Design Quick Fix](https://www.nngroup.com/articles/form-design-white-space/): How grouping a long form into sections with white space makes it feel shorter.
- [Law of Proximity](https://lawsofux.com/law-of-proximity/): A one-page summary of the principle with its origins and takeaways.
- [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/gap): The property that puts spacing on the group instead of on each child.


## Spacing Scale

> A few spaces, used everywhere.

- Section: Layout
- URL: https://craft.gustavofior.com/spacing-scale
- Published: 2026-10-02
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/spacing-scale.mdx

Spacing drifts. One card gets 14px of padding, the next one 16px, a third
18px because it looked tight that day. Nobody sees the 2px, but people feel
that the page is slightly off, and every new screen adds another value.

**Pick every space from a small scale, and let the steps grow as the gaps do.**

> **Interactive demo: Spacing Scale.** Open https://craft.gustavofior.com/spacing-scale to try it.

The two cards look almost the same. The one-off version uses seven values,
each picked by eye, and the check marks sit at three different distances from
their text. The scale version uses four: 4, 8, 16 and 24. Things that should
line up now do, and the next person to build a card has four answers instead
of seven guesses.

### Steps that grow

Start from 4px: 4, 8, 12, 16, 24, 32, 48, 64. The steps are 4px apart at the
bottom, then 8, then 16.

> **Interactive demo: Spacing Steps.** Open https://craft.gustavofior.com/spacing-scale to try it.

We notice spacing in proportion. Going from 8px to 12px adds 50% and is easy
to see. Going from 48px to 52px adds 8% and nobody would notice, so it should
not be a separate choice. Each step here is between 1.33x and 2x the one below.

The 8-point grid allows only multiples of 8. I find that too coarse for dense
interfaces: 4px and 12px come up constantly for icon gaps and compact rows.
Atlassian builds on 8px too, but adds half steps like 4, 6 and 12 for the same
reason. A 4px base covers them and still lands on every multiple of 8.

### In Tailwind

Tailwind v4 derives every spacing utility from one variable,
`--spacing: 0.25rem`, so `gap-3` is 12px and `p-6` is 24px. That is a 4px
base, but not a scale: `gap-5`, `p-13` and `mt-4.5` all work too. Reset the
namespace and name only the steps you allow.

### Usage

**Tailwind**

```css
@import "tailwindcss";

@theme {
  --spacing-*: initial;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
}
```

**CSS**

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}

.card {
  padding: var(--space-6);
  gap: var(--space-2);
}
```

Sizing utilities like `w-64` and `size-10` read the same namespace, so the
reset removes them too, and arbitrary values like `gap-[13px]` still compile.
If that is too strict for your codebase, keep the defaults and treat 1, 2, 3,
4, 6, 8, 12 and 16 as the only numbers you type. The scale decides which
values exist. [Whitespace](https://craft.gustavofior.com/whitespace) decides where the big ones go.

### Resources

- [Atlassian spacing](https://atlassian.design/foundations/spacing): A production spacing scale with guidance on which range to use for what.
- [The 8-Point Grid](https://spec.fm/specifics/8-pt-grid): The case for multiples of 8, paired with a 4pt baseline grid for text.
- [Tailwind theme variables](https://tailwindcss.com/docs/theme): How the spacing namespace works and how to replace the default values.
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4): Why every spacing utility in v4 is derived from a single variable.
