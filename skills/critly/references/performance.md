# Performance

## Responsiveness

> Answer every input on the next frame.

- Section: Performance
- URL: https://critly.vercel.app/responsiveness
- Published: 2026-10-08
- Source: https://github.com/kausthubh-coder/craft/blob/main/content/performance/responsiveness.mdx

People don't feel how long the work takes. They feel how long the screen
takes to answer. A tap that changes something within about 50ms feels like
a physical button; at 150ms it feels like software; past a few hundred it
feels broken.

Type quickly into the box in both modes. Every row costs a little rendering
time, like a real row with a few components in it.

> **Interactive demo: Typing Lag.** Open https://critly.vercel.app/responsiveness to try it.

In Blocking mode, every keystroke waits for the whole list to re-render
before the letter appears, so the text stutters and lags behind your
fingers. In Deferred mode, the letter appears at once and the list catches
up behind it, dimmed for a moment while it's out of date.

**Answer every input on the next frame. Finish the work afterwards.**

The browser can only paint between tasks. Whatever runs in your click or
keystroke handler, plus the render it triggers, sits between the input and
the next frame. Chrome measures that gap as Interaction to Next Paint: under
200ms is "good", over 500ms is "poor". Treat 200ms as the failure line, not
the goal. Aim for 100ms at most, and well under that for typing.

### Paint first, then work

Both buttons do the same 600ms of work. Press each one.

> **Interactive demo: Paint First.** Open https://critly.vercel.app/responsiveness to try it.

The left button does the work, then updates, so for over half a second
nothing seems to happen and the page is frozen. The right button switches
to "Saving…" first, lets the browser paint that frame, then does the work in
40ms pieces, yielding in between so the page keeps responding.

1. Change the visible state first: pressed, optimistic, "Saving…".
2. Yield, so the browser can paint it.
3. Do the work in pieces under 50ms, or move it to a Web Worker.

### Feedback that matches the wait

- **Under 100ms:** just the state change. A pressed button, a checked box,
  the typed letter.
- **Up to about 400ms:** nothing more. A spinner that flashes for 200ms
  reads as a glitch.
- **400ms to 1s:** a quiet cue, like dimming the old content or a button
  label that says "Saving…".
- **Over 1s:** a real loading state; past 10 seconds, progress and a way
  out. See [Performance Is Design](https://critly.vercel.app/performance-is-design).

To stop double submits, switch the button to a pending state that ignores
repeat presses, instead of a silent `disabled` that greys it out and drops
focus.

### Usage

**JavaScript**

```ts
function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

button.addEventListener("click", async () => {
  button.dataset.state = "saving"; // 1. answer
  await yieldToMain();             // 2. let it paint

  let last = performance.now();
  for (const item of items) {      // 3. work in pieces
    process(item);
    if (performance.now() - last > 40) {
      await yieldToMain();
      last = performance.now();
    }
  }
});
```

**React**

```tsx
import { memo, useDeferredValue, useState } from "react";

function Search({ items }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const stale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: stale ? 0.6 : 1 }}>
        <Results items={items} query={deferredQuery} />
      </div>
    </>
  );
}

// Must be memoized (or compiled by React Compiler) to skip urgent renders.
const Results = memo(function Results({ items, query }) { ... });
```

Never put a text input's own value behind a transition, a debounce or an
`await`: the letter has to echo immediately. Debounce network requests, not
rendering. `scheduler.yield()` runs in Chrome and Firefox; the `setTimeout`
fallback covers Safari. Test with DevTools' CPU throttling set to mid-tier
mobile, because a fast laptop hides almost all of this.

### Resources

- [Interaction to Next Paint](https://web.dev/articles/inp): The metric for how quickly a page answers clicks, taps and key presses, with its 200ms and 500ms thresholds.
- [Optimize long tasks](https://web.dev/articles/optimize-long-tasks): Why tasks over 50ms block input, and how to break them up by yielding.
- [Use scheduler.yield()](https://developer.chrome.com/blog/use-scheduler-yield): The Chrome team on giving feedback first and yielding before the slow part.
- [useDeferredValue](https://react.dev/reference/react/useDeferredValue): React's way to keep typing instant while an expensive part of the screen catches up.
- [Slow Software](https://inkandswitch.com/slow-software/): Ink & Switch on how little latency people notice when they touch, click and type.


## Instant Navigation

> Start loading before the click lands.

- Section: Performance
- URL: https://critly.vercel.app/instant-navigation
- Published: 2026-10-08
- Source: https://github.com/kausthubh-coder/craft/blob/main/content/performance/instant-navigation.mdx

Moving between screens is the most common thing people do in an app, and
they decide whether it feels fast in the first tenth of a second. Most of
that time can be spent before they even click.

Both apps take 600ms to load each page. Move your pointer onto a page name
the way you normally would, then click.

> **Interactive demo: Prefetch.** Open https://critly.vercel.app/instant-navigation to try it.

The left app starts loading when you click, so every page shows a skeleton
for 600ms. The right one starts loading when you show intent: hovering for
65ms, pressing down, or focusing with the keyboard. By the time the click
lands, most of the wait is already over.

**Start loading on intent, not on click, and never show a blank screen while
you wait.**

### How much head start you get

People hover on a link for a while before they click it. instant.page's
measurements found that after 65ms of hover, half of users go on to click,
with over 300ms still to go. Pressing the button gives about 80ms more
before the click fires, and on touch screens `touchstart` gives about 90ms.
That's why the right app also loads on press: it's free and wastes nothing.

Prefetch the data as well as the code, and let a click join the request
already in flight instead of starting a new one. On touch screens there's
no hover, so prefetch only the few links people are most likely to tap,
such as the first items in a list.

### What to show while it loads

- **Under 100ms:** nothing. Keep the old screen, show the pressed link, then
  swap.
- **Longer, and you know the next layout:** show the destination's skeleton
  straight away, filled with what you already know, like the title from the
  link.
- **Longer, and you don't:** keep the old screen and dim it after about
  100ms.

Spinners need the same care. Load each panel a few times.

> **Interactive demo: Spinner Delay.** Open https://critly.vercel.app/instant-navigation to try it.

Most loads take about 100ms. The left spinner appears for every one of them,
so the panel blinks. The right one only appears if the load is still going
after 150ms, and then stays for at least 300ms, so fast loads look instant
and slow ones look steady.

### Usage

**React**

```tsx
const inflight = new Map();
const prefetch = (key, load) => {
  if (!inflight.has(key)) inflight.set(key, load());
  return inflight.get(key);
};

function IntentLink({ href, load, children }) {
  let timer;
  return (
    <a
      href={href}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") timer = setTimeout(() => prefetch(href, load), 65);
      }}
      onPointerLeave={() => clearTimeout(timer)}
      onPointerDown={() => prefetch(href, load)}
      onFocus={() => prefetch(href, load)}
    >
      {children}
    </a>
  );
}
```

**HTML**

```html
<!-- Chromium: prerender same-site links after 200ms of hover or on press -->
<script type="speculationrules">
{
  "prerender": [{
    "where": {
      "and": [
        { "href_matches": "/*" },
        { "not": { "href_matches": ["/logout", "/cart/*"] } }
      ]
    },
    "eagerness": "moderate"
  }]
}
</script>
```

Frameworks already do much of this. Next.js prefetches links as they scroll
into view, and a dynamic route only prefetches down to its `loading.js`, so
give every dynamic route one. React Router has `prefetch="intent"`, and
TanStack Router preloads on a 50ms hover. Speculation Rules only run in
Chromium, so treat them as a bonus. Never prefetch links that change
something, like logout or add to cart.

Make Back instant too. Remove every `unload` listener, since it keeps the
browser from restoring the page from memory, and in single-page apps
restore the previous screen and its scroll position from cache.

### Resources

- [instant.page](https://instant.page/): The measurements behind hover prefetching, including how long people hover before they click.
- [Prerender pages in Chrome](https://developer.chrome.com/docs/web-platform/prerender-pages): The Speculation Rules API, its eagerness levels and exactly when each one fires.
- [Prefetching in Next.js](https://nextjs.org/docs/app/guides/prefetching): How Next.js prefetches links, and how to prefetch only on hover for long lists.
- [Back/forward cache](https://web.dev/articles/bfcache): How browsers make Back instant, and what stops them.
- [spin-delay](https://github.com/smeijer/spin-delay): A small hook for spinners that only show after a delay and then stay long enough not to flicker.


## Image Loading

> Hold the space, then fade in.

- Section: Performance
- URL: https://critly.vercel.app/image-loading
- Published: 2026-10-08
- Source: https://github.com/kausthubh-coder/craft/blob/main/content/performance/image-loading.mdx

Images are usually the heaviest thing on a page and the last thing to
arrive. How they arrive is part of the design: they can drop into an empty
gap and shove the page around, or settle into a space that was waiting for
them.

Replay both cards. The network is simulated, so each image takes a moment.

> **Interactive demo: Image Arrival.** Open https://critly.vercel.app/image-loading to try it.

The left image has no size and no placeholder, so there's nothing, then the
picture appears all at once and pushes the text down while you're reading
it. The right one reserves its box from the first frame, fills it with the
photo's average colour, and fades the picture in over 240ms.

**Give every image its space and a placeholder before it loads, then fade it
in. Except the hero: load that one first and show it at once.**

### What fills the box

Switch between the placeholder and the loaded image.

> **Interactive demo: Placeholder.** Open https://critly.vercel.app/image-loading to try it.

A grey box is safe but tells you nothing. The average colour hints at the
photo for a few bytes. A tiny preview looks like the real image, but only if
it's blurred: stretched without blur, it looks like a broken JPEG.
BlurHash and ThumbHash encode a smooth preview in about 25 bytes. In dark
mode, mix the colour with the page's surface so placeholders don't flash
bright.

Don't fade images that are already in the cache, or every revisit flickers.
Crossfade with `opacity` over a still placeholder, and never animate the blur
itself.

### The hero is different

The main image at the top is usually what Chrome measures as Largest
Contentful Paint, which should land within 2.5 seconds. The download is
rarely what makes it late. On slow sites, the browser waits about four times
longer to *start* downloading the hero than it spends downloading it.

- Put the hero in the HTML as a real `<img>`, not a CSS background or an
  image added by JavaScript.
- Mark it `fetchpriority="high"`, and only it.
- Never lazy-load it. Lazy-load everything below the fold instead.
- Don't fade it in from invisible. Paints at opacity 0 don't count, so a
  reveal animation can delay it by seconds.

### Usage

**HTML**

```html
<!-- The hero: first in line, shown at once -->
<img src="/hero-1600.avif" width="1600" height="900" alt="…"
     fetchpriority="high">

<!-- Everything else: sized, lazy, sized to its slot -->
<img src="/card-640.avif" width="640" height="400" alt="…"
     loading="lazy" decoding="async"
     srcset="/card-320.avif 320w, /card-640.avif 640w, /card-960.avif 960w"
     sizes="auto, (min-width: 40rem) 45vw, 92vw"
     style="background: var(--placeholder)">
```

**Next.js**

```tsx
import Image from "next/image";
import hero from "./hero.jpg";

// next/image lazy-loads by default, so the hero must opt out.
<Image src={hero} alt="…" fetchPriority="high" loading="eager"
       sizes="100vw" placeholder="blur" />

// Below the fold: lazy by default, with a blurred placeholder.
<Image src={photo} alt="…" sizes="(min-width: 40rem) 45vw, 92vw"
       placeholder="blur" />
```

Serve AVIF with WebP and JPEG fallbacks, or let an image CDN pick, and stop
at 2× pixel density: the extra pixels on 3× screens are rarely visible. Next.js 16
deprecated `priority` in favour of `preload`, but its docs recommend
`fetchPriority="high"` for most heroes. Always set `width` and `height`;
see [Layout Shift](https://critly.vercel.app/layout-shift).

### Resources

- [Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp): The four parts of a slow hero image, and the share of time each should take.
- [Fetch Priority API](https://web.dev/articles/fetch-priority): How fetchpriority="high" moves the hero image to the front of the queue.
- [The performance effects of too much lazy loading](https://web.dev/articles/lcp-lazy-loading): WordPress's test showing that lazy-loading above-the-fold images makes pages slower.
- [ThumbHash](https://evanw.github.io/thumbhash/): A tiny encoding of an image's colours and shape, for placeholders that look like the photo.
- [Remove image transitions to improve LCP](https://performance.shopify.com/en-ca/blogs/blog/improve-largest-contentful-paint-lcp-by-removing-image-transitions): Shopify on how a fade-in reveal on the hero image delayed it by seconds.


## Long Lists

> Render what's on screen, not everything.

- Section: Performance
- URL: https://critly.vercel.app/long-lists
- Published: 2026-10-08
- Source: https://github.com/kausthubh-coder/craft/blob/main/content/performance/long-lists.mdx

Feeds, tables, chat logs and search results grow until they're the slowest
thing in the app. Every row is a handful of elements, and the browser has to
style and lay out every one of them, even the thousands nobody can see.

Re-sort the list in both modes and watch the time under it.

> **Interactive demo: Long List.** Open https://critly.vercel.app/long-lists to try it.

With all 5,000 rows rendered, every re-sort touches 5,000 rows and takes a
visible beat; on a phone it takes several. With only the visible rows
rendered (plus a few above and below), the list looks and scrolls the same,
but a re-sort only touches about a dozen, and it's instant at any length.

**Render only the rows people can see. Keep the rest as space, not as
elements.**

### Three ways to keep it light

- **Fewer than about 300 simple rows:** just render them.
- **Long, mostly static content** (articles, docs, a long settings page):
  add `content-visibility: auto` to each section. The browser skips laying
  out and painting what's off screen, and find-in-page still works. In one
  test, 10,000 rows went from about 436ms to 247ms.
- **Over about 1,000 items, or anything filtered, sorted or updated live:**
  virtualize. Only the visible rows exist, so the cost stays flat, around 5
  to 20ms whether there are a thousand rows or a million.

Virtualization has costs to plan for. Find-in-page can't see rows that don't
exist, so offer your own search. Screen readers need `aria-setsize` and
`aria-posinset` to know where they are, and the focused row has to stay
mounted. Search engines and printing only see what's rendered.

### Keep the reader's place

Chats and feeds that load older content above you have a second problem.
Scroll up a little in both chats, then load older messages.

> **Interactive demo: Chat Anchor.** Open https://critly.vercel.app/long-lists to try it.

On the left, the new messages push everything down and you lose the line you
were reading. On the right, the scroll position moves by exactly the height
that was added, so the same message stays under your eyes. Browsers do this
automatically with scroll anchoring, except at the very top of the list,
which is exactly where "load older" usually fires. Start loading a little
before the top, or correct the position yourself.

### Infinite scroll or "Load more"

Infinite scroll suits feeds people browse without a goal. For search
results, products and anything people compare, use pagination or a "Load
more" button: people can reach the footer, and Back can return them to the
same place. Put the page in the URL, and after a few automatic loads switch
to a button.

### Usage

**CSS**

```css
/* Long, mostly static sections: skip rendering what's off screen.
   The size is a guess the browser replaces once it has rendered it. */
.feed-item {
  content-visibility: auto;
  contain-intrinsic-size: auto 120px;
}
```

**React**

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function Activity({ rows }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 6,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflowY: "auto" }}>
      <ul style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((item) => (
          <li
            key={rows[item.index].id}
            aria-posinset={item.index + 1}
            aria-setsize={rows.length}
            style={{ position: "absolute", top: item.start, height: item.size, width: "100%" }}
          >
            {rows[item.index].text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Key rows by their data id, never their index. Prefer fixed row heights for
tables and logs; when heights vary, overestimate the guess. Typing into a
filter over a long list still needs [Responsiveness](https://critly.vercel.app/responsiveness):
virtualize so each render is small, and defer it so typing stays instant.
Use a library for chat lists rather than hand-written scroll math.

### Resources

- [How large DOM sizes affect interactivity](https://web.dev/articles/dom-size-and-interactivity): Why every extra node makes style, layout and every interaction slower.
- [content-visibility](https://web.dev/articles/content-visibility): Letting the browser skip rendering off-screen sections, with measured savings.
- [TanStack Virtual](https://tanstack.com/virtual/latest): A headless virtualization library for lists, grids and chats of any length.
- [Infinite scrolling tips](https://www.nngroup.com/articles/infinite-scrolling-tips/): Nielsen Norman Group on when infinite scroll helps and when it gets in the way.
- [overflow-anchor](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor): Scroll anchoring, which keeps your place when content is added above it.


## Smooth Animation

> Animate what the compositor can run.

- Section: Performance
- URL: https://critly.vercel.app/smooth-animation
- Published: 2026-10-08
- Source: https://github.com/kausthubh-coder/craft/blob/main/content/performance/smooth-animation.mdx

A browser tab does almost everything on one thread: your JavaScript, React,
style, layout and paint. Smooth motion needs a new frame every 16ms at 60Hz
and every 8ms at 120Hz. When that thread is busy, anything that needs it
misses frames.

Some animations don't need it. The browser can hand them to the compositor,
a separate thread that only moves and fades layers that are already painted.
Press play, then switch to a busy page, which blocks the main thread for 70ms
out of every 100, about what a big re-render does on a mid-range phone.

> **Interactive demo: Main Thread.** Open https://critly.vercel.app/smooth-animation to try it.

All three dots run the same motion. The JavaScript loop needs the main
thread to compute every frame, and the `left` animation needs it to lay out
the page every frame, so both stutter. The `transform` animation was handed
to the compositor once, so it keeps gliding while the page is stuck.

**Animate `transform` and `opacity`, and let CSS or the Web Animations API
run them.**

### What each property costs

- **Composited everywhere:** `transform`, `translate`, `scale`, `rotate`,
  `opacity`.
- **Depends on the browser:** `filter`, `backdrop-filter`, `clip-path` and
  `background-color` run on the compositor in some engines and on the main
  thread in others. Treat them as expensive.
- **Paint every frame:** `box-shadow`, `border-radius`, `color`,
  `filter: blur()` in Chrome.
- **Layout every frame:** `width`, `height`, `top`, `left`, `margin`,
  `padding`. Moving one box can move every box after it.

For size changes, animate a transform and measure once ([shared
layout](https://critly.vercel.app/shared-layout) does this for you). For shadows and blur, paint the
end state once and fade it in. Lift both cards, then try it on a busy page.

> **Interactive demo: Shadow Lift.** Open https://critly.vercel.app/smooth-animation to try it.

The left card animates `box-shadow`, which repaints the shadow on every
frame on the main thread, so it stutters with the page. The right card fades
the opacity of a layer that already has the big shadow painted, so it stays
smooth.

### JavaScript animation

JavaScript engines compute each frame on the main thread, so they're only as
smooth as the page around them. In Motion, `x`, `y` and `scale` run that
way. A full `transform` string can be handed to the browser instead. Springs
handed over this way become `linear()` curves, which Safari runs on the main
thread anyway. In React, never animate through state: a re-render per frame
is exactly the main-thread work that causes the stutter. Use motion values,
refs or CSS.

A few more habits keep frames steady:

- Start the animation first, then do the heavy work after a frame or two.
- Don't run JavaScript entrance animations while the page is hydrating.
- Set `will-change` just before an animation and remove it afterwards.
  Every layer costs GPU memory.
- Pause loops that are off screen.

### Measure it

In Chrome DevTools, record a trace and open the Animations track. A red
triangle marks an animation that wasn't composited, and the summary says
why. CPU throttling shows main-thread problems, but it doesn't slow the GPU,
so check blur and glass on a real phone.

### Usage

**CSS**

```css
/* Fade a pre-painted shadow instead of animating box-shadow. */
.card {
  position: relative;
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

.card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 18px 36px -12px rgb(0 0 0 / 0.35);
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

.card:hover {
  transform: translateY(-4px);
}

.card:hover::after {
  opacity: 1;
}
```

**Motion**

```tsx
import { motion } from "motion/react";

// Runs in JavaScript every frame:
<motion.div animate={{ x: 100 }} />

// Can be handed to the browser and keep running when the page is busy:
<motion.div animate={{ transform: "translateX(100px)" }} />
```

Composited motion keeps animating while the page is blocked, but the page
still can't respond to a click until the work finishes. Smooth animation
hides a slow page; it doesn't fix one. See [Performance Is
Design](https://critly.vercel.app/performance-is-design).

### Resources

- [Stick to compositor-only properties](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count): Why transform and opacity are cheap, and what every extra layer costs.
- [Motion animation performance guide](https://motion.dev/docs/performance): Which values Motion can hardware-accelerate, and why x and scale aren't among them.
- [How to animate box-shadow](https://tobiasahlin.com/blog/how-to-animate-box-shadow/): Tobias Ahlin's technique of fading a pre-rendered shadow instead of animating it.
- [Chrome DevTools performance reference](https://developer.chrome.com/docs/devtools/performance/reference): The Frames and Animations tracks, including why an animation wasn't composited.
- [Scroll-driven animation performance](https://developer.chrome.com/blog/scroll-animation-performance-case-study): A case study of a CSS animation that stays smooth while JavaScript is busy.
