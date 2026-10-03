# Color

## OKLCH

> Lightness values that look equal.

- Section: Color
- URL: https://craft.gustavofior.com/oklch
- Published: 2026-07-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/color/oklch.mdx

In HSL, lightness is a number the math likes and your eyes don't. A yellow at
65% looks bright and a blue at 65% looks far darker. **OKLCH** defines lightness the
way people see it, so one value looks about as light on every hue.

**Pick colors in OKLCH, so equal lightness numbers actually look equally
light.**

> **Interactive demo: Oklch.** Open https://craft.gustavofior.com/oklch to try it.

Switch to lightness only and the HSL row turns into uneven grays, while the
OKLCH row stays flat. That unevenness is why text passes contrast on one hue
and fails on the next, and why some badges look louder than others.

### The three numbers

`oklch(L C H)` is lightness, chroma and hue. Lightness runs from `0` (black)
to `1` (white). Chroma is how colorful it is, from `0` (gray) up to about
`0.32` in sRGB and `0.36` on a P3 screen. Hue is an angle: around `25` is
red, `145` green and `250` blue.

Change one number and only that thing changes. Set chroma to `0` and any hue
becomes a gray at the same lightness.

### Gradients

The color space also decides what happens between two colors. In sRGB, a
gradient between opposite hues runs straight through gray. In OKLCH it keeps
its chroma and turns through the hues in between.

> **Interactive demo: Oklch Gradient.** Open https://craft.gustavofior.com/oklch to try it.

You get this with one keyword: `linear-gradient(in oklch, ...)`.

### Palettes

Because lightness is reliable, a tonal scale is just a list of lightness
values on one hue. Drag the hue and the ramp keeps its shape.

> **Interactive demo: Oklch Palette.** Open https://craft.gustavofior.com/oklch to try it.

White text on the 700 step stays between 6.1:1 and 7.1:1 contrast on every
hue. White on `hsl(h 70% 50%)` swings from 1.5:1 to 8.9:1.

Hues can't all hold the same chroma, though. At lightness `0.93`, sRGB fits
a green with almost four times the chroma of a blue. The demo caps every step
at what sRGB can show, which is why some hues come out softer.

### Usage

Tailwind v4 already defines its palette in OKLCH, and the color tokens on
this site are all OKLCH too.

**Tailwind**

```html
<button class="bg-[oklch(0.48_0.13_250)] text-white hover:bg-[oklch(0.38_0.1_250)]">
  Continue
</button>

<span class="bg-[oklch(0.93_0.05_145)] text-[oklch(0.48_0.12_145)]">
  Shipped
</span>
```

**CSS**

```css
:root {
  --brand-200: oklch(0.93 0.03 250);
  --brand-700: oklch(0.48 0.13 250);
  --brand-800: oklch(0.38 0.1 250);
}

.button {
  background: var(--brand-700);
}

.button:hover {
  background: var(--brand-800);
}

.hero {
  background: linear-gradient(in oklch, oklch(0.6 0.16 260), oklch(0.75 0.16 70));
}
```

`oklch()` has worked in every major browser since 2023, so it needs no
fallback. The catch is gamut. A value the screen can't show gets mapped back
in, and its lightness can shift on the way, so check new colors at
[oklch.com](https://oklch.com/) before you ship them.

### Resources

- [OKLCH in CSS, why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl): The case for OKLCH, with side by side palettes that make the HSL problem obvious.
- [OKLCH color picker](https://oklch.com/): Pick colors by lightness, chroma and hue, and see where the sRGB and P3 gamuts end.
- [oklch()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch): Syntax, ranges and browser support for the CSS function.
- [A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/): Björn Ottosson's post that introduced Oklab, the space OKLCH is built on.


## Noise

> Grain hides banding and adds texture.

- Section: Color
- URL: https://craft.gustavofior.com/noise
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/color/noise.mdx

When the UI feels too flat, sometimes I like to add noise to some components to give them some texture.

**Noise** is a layer of random light and dark pixels laid over the surface. It breaks the steps up and gives the color some texture.

> **Interactive demo: Noise.** Open https://craft.gustavofior.com/noise to try it.

### Grain size

The `baseFrequency` attribute controls how fine the noise is. Low values give big soft blobs, whle high values give the tight speckle of film grain.

> **Interactive demo: Noise Frequency.** Open https://craft.gustavofior.com/noise to try it.

### Usage

Put the filter in one SVG anywhere on the page, then reference it from an overlay. The overlay is an empty element, so it costs nothing in markup and can be dropped onto any positioned container.

**Tailwind**

```html
<svg class="absolute size-0" aria-hidden="true">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
</svg>

<div class="relative isolate overflow-hidden rounded-2xl bg-violet-600">
  <div class="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay filter-[url(#grain)]" aria-hidden="true"></div>
  <!-- content -->
</div>
```

**CSS**

```css
.surface {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.surface::after {
  content: "";
  position: absolute;
  inset: 0;
  filter: url(#grain);
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

The `isolate` on the container matters. Without it, `mix-blend-mode` blends the grain with everything behind the card, including the page background, and the effect changes depending on where the card sits. With it, the grain only ever blends with the surface it belongs to.

### Performance

The filter is not free. `feTurbulence` is generated per pixel and re-rendered whenever the element repaints. On a card that is a few hundred pixels wide you will never notice. Stretched across a full-screen hero, especially one that scrolls or animates, it can drop a page to a handful of frames per second on a phone or a low-end laptop.

The fix is to render the noise once and tile it. With `stitchTiles="stitch"` and the filter region pinned to the tile, a small tile repeats seamlessly, and a tiled image costs the browser almost nothing after the first paint. The result looks the same for static grain. The only thing you give up is tuning `baseFrequency` live, since the frequency is baked into the tile.

You do not even need an image file. Put the filter inside an SVG data URI and let the browser rasterize it once per tile:

**Tailwind**

```html
<div class="relative isolate min-h-screen overflow-hidden bg-violet-600">
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-size-[200px_200px] bg-repeat"
    style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E&quot;)"
    aria-hidden="true"
  ></div>
  <!-- content -->
</div>
```

**CSS**

```css
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  background-repeat: repeat;
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

A 200px tile is small enough to be cheap and large enough that the repeat is invisible under the blend. If you can see the seams, export the tile as a PNG at 2x instead and use that as the `background-image`.

As a rule: use the live filter on small surfaces and in demos where you want to tweak the grain. Use a tiled image anywhere the overlay is large or the page is expected to move.

### Resources

- [feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence): The SVG filter primitive that generates the noise. Everything here is built on it.
- [Grainy Gradients](https://css-tricks.com/grainy-gradients/): A thorough walkthrough of noise on gradients, with the color matrix tricks explained.
- [mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode): How the grain layer combines with the color underneath it.


## Shadows, Not Borders

> Layered shadows give edge and depth.

- Section: Color
- URL: https://craft.gustavofior.com/shadows-not-borders
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/color/shadows-not-borders.mdx

A 1px border is the default way to give a card an edge. It works, but every
border is a line, and a screen full of lines starts to look like a
spreadsheet. A **layered shadow** draws the same edge with a faint ring, then
adds a hint of depth below it.

**Give surfaces their edge with a faint shadow, not a border.**

> **Interactive demo: Shadows Not Borders.** Open https://craft.gustavofior.com/shadows-not-borders to try it.

The shadow is just as sharp at the edge. The difference is that the card now
sits slightly above the page instead of being drawn on it, so you can stack a
card inside a panel inside a page without the lines piling up.

### Three layers

The recipe this site uses has three layers, and each does one job. Step
through them.

> **Interactive demo: Shadow Layers.** Open https://craft.gustavofior.com/shadows-not-borders to try it.

- The **ring** is a `0 0 0 1px` shadow at 6% black. It is the edge, and
  unlike a border it takes up no space.
- The **contact** layer sits 1px down with a 2px blur at 6%. It darkens the
  pixels right under the bottom edge, where the card touches the page.
- The **ambient** layer sits 2px down with a 4px blur at 4%. It suggests light
  from above without becoming a smudge.

In light mode no layer goes above 6%. If you can consciously see the shadow,
it is too strong.

### Elevation

Elevation is adding layers on top of the same base. Hover adds a mid blur,
and a popover adds a long, soft one on top of that.

> **Interactive demo: Shadow Elevation.** Open https://craft.gustavofior.com/shadows-not-borders to try it.

All three levels start from the same token. That is what makes them read as
the same material at different heights, instead of three different styles.

### Dark mode

A dark shadow on a dark background is invisible. Here is the light mode
shadow on a dark surface, next to the version this site uses in dark mode.

> **Interactive demo: Shadow Dark Mode.** Open https://craft.gustavofior.com/shadows-not-borders to try it.

In dark mode the edge comes from light. A 1px inset ring at 3% white draws
the outline from the inside, and a 1px inset highlight along the top suggests
light hitting the surface. The black shadows below, at 10% each, only
separate the card from what is behind it.

### Usage

These are the `--custom-shadow` values from this site's `globals.css`.

**Tailwind**

```html
<div class="rounded-xl bg-card shadow-(--custom-shadow)">
  <!-- content -->
</div>
```

**CSS**

```css
:root {
  --custom-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 1px 2px -1px rgba(0, 0, 0, 0.06),
    0 2px 4px 0 rgba(0, 0, 0, 0.04);
}

.dark {
  --custom-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.03),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 2px 2px 0 rgba(0, 0, 0, 0.1),
    0 4px 4px 0 rgba(0, 0, 0, 0.1),
    0 8px 8px 0 rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 0.75rem;
  box-shadow: var(--custom-shadow);
}
```

Borders still have a place. Inputs, table rows and dividers want a plain
line, because they are not surfaces and should not look raised. Save the
shadow for things that hold other things.

### Resources

- [Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/): Josh Comeau on layered shadows and why one big blur looks wrong.
- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): Jakub Krehel's list of small fixes, including the three-layer shadow this site uses.
- [Smoother and sharper shadows with layered box-shadows](https://tobiasahlin.com/blog/layered-smooth-box-shadows/): Tobias Ahlin shows how stacking several soft shadows beats a single one.
- [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow): The syntax on MDN, including the inset and spread values the recipe relies on.


## Image Outlines

> A faint inner edge that frames images.

- Section: Color
- URL: https://craft.gustavofior.com/image-outlines
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/color/image-outlines.mdx

Images do not know what is behind them. A pale sky on a white card has no
edge at all, and a photo with a bright corner blends into the page.

An **inset outline** fixes that with one line, drawn just inside the image at
around 10% opacity.

The outline's visibility can vary based on light or dark mode and the image content.

> **Interactive demo: Image Outline.** Open https://craft.gustavofior.com/image-outlines to try it.

The line is too faint to read as a border. What you notice instead is that
every image suddenly has a shape.

I basically learned this trick from
[Jakub](https://jakub.kr/writing/details-that-make-interfaces-feel-better).
It is one of those details you cannot unsee once someone points it out.

### Why not a border

A `border` sits between the padding and the margin, so it takes up space.
Adding one pushes content around and changes the size of the box.

**Paint the line over the image, not around it.** An `outline` with a
negative `outline-offset`, or an inset `box-shadow`, sits on top of the
outermost pixels.

### How strong

Ten percent is a good default, but I like to tune it differently for light and dark mode sometimes.

> **Interactive demo: Image Outline Strength.** Open https://craft.gustavofior.com/image-outlines to try it.

Below about 5% the line disappears against the pale sky. Above about 20%
it starts to look like a frame, and the eye reads it as a design element
instead of a fix. Stay in between.

### Avatars

Avatars are where this matters most. They are small, round, and often mostly
white: an initial on a light background, a pale logo, a photo of someone
against a wall. Without an edge they float on the surface.

> **Interactive demo: Image Outline Avatar.** Open https://craft.gustavofior.com/image-outlines to try it.

### Usage

Set the outline color per theme. Black at 10% on light, white at 10% on dark.

**Tailwind**

```html
<img
  class="rounded-lg outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
  src="/cover.jpg"
  alt="Album cover"
/>
```

**CSS**

```css
img {
  border-radius: 8px;
  outline: 1px solid rgb(0 0 0 / 0.1);
  outline-offset: -1px;
}

.dark img {
  outline-color: rgb(255 255 255 / 0.1);
}
```

### Resources

- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): Jakub Krehel's list of small touches, including the inset image outline this page is about.
- [outline-offset](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset): The property that pulls an outline inside the box instead of around it.
- [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow): The inset form is the other way to draw the same line, with full support for rounded corners.
- [color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color-mix): Handy for mixing the outline color into the current text color so it adapts to any theme.
