# Motion

## Icon Morph

> Blur, scale and fade between icons.

- Section: Motion
- URL: https://craft.gustavofior.com/icon-morph
- Published: 2026-07-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/icon-morph.mdx

When an icon changes state, like copy to check or play to pause, the default
is a hard swap. One frame shows the old icon, the next frame shows the new
one, and the eye registers a jump.

**Don't swap icons. Blur, scale and fade between them.** Click either button.

> **Interactive demo: Icon Morph.** Open https://craft.gustavofior.com/icon-morph to try it.

The old icon shrinks and goes out of focus while the new one grows and
sharpens. Neither shape is crisp while they overlap, so it reads as one icon
changing rather than two icons trading places. The whole move takes about
300ms.

### Tuning it

Two numbers matter: how much blur, and how small the icons get. Switch to slow
motion and drag the sliders.

> **Interactive demo: Icon Morph Tuning.** Open https://craft.gustavofior.com/icon-morph to try it.

At `0px` blur you see both icons at once, sharp and stacked on top of each
other. At `4px` the overlap turns into a soft blend. A start scale of `0.25`
gives the new icon somewhere to come from. At `1` it is a plain crossfade, and
at `0` the icon grows out of a single point, which looks like an effect.

Drive it with a spring that has no bounce. Icon swaps should snap into place,
not wobble.

### When the shapes are related

A hamburger and a close icon are both made of lines, so you can move the
lines instead of crossfading the icons. The top and bottom bars rotate into an
X while the middle one shrinks away.

> **Interactive demo: Hamburger Morph.** Open https://craft.gustavofior.com/icon-morph to try it.

This only pays off when the shapes really are related. Turning a copy icon
into a check would mean animating path data, and the blur crossfade gets you
most of the effect for a fraction of the work.

### Usage

**Tailwind**

```tsx
<button data-copied={copied} className="group grid size-10 place-items-center">
  <CopyIcon className="col-start-1 row-start-1 transition-[opacity,scale,filter] duration-300 ease-out group-data-[copied=true]:scale-25 group-data-[copied=true]:opacity-0 group-data-[copied=true]:blur-xs" />
  <CheckIcon className="col-start-1 row-start-1 scale-25 opacity-0 blur-xs transition-[opacity,scale,filter] duration-300 ease-out group-data-[copied=true]:scale-100 group-data-[copied=true]:opacity-100 group-data-[copied=true]:blur-none" />
</button>
```

**Motion**

```tsx
import { AnimatePresence, motion } from "motion/react";

<span className="relative inline-flex">
  <AnimatePresence mode="popLayout" initial={false}>
    <motion.span
      key={copied ? "check" : "copy"}
      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </motion.span>
  </AnimatePresence>
</span>
```

In the Motion version, `mode="popLayout"` takes the leaving icon out of the
layout so the two overlap instead of stacking, which is why the wrapper is
`relative`. `initial={false}` skips the animation on first render, when there
is nothing to morph from. The copy buttons in this site's header use exactly
this component.

### Resources

- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): Jakub Krehel's list of small fixes, including animating icons with opacity, scale and blur.
- [7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): Emil Kowalski's short rules for interface motion, ending with using blur when nothing else works.
- [AnimatePresence](https://motion.dev/docs/react-animate-presence): The Motion component that keeps an element around long enough to animate it out.
- [Spring transitions](https://motion.dev/docs/react-transitions#spring): The duration and bounce options used in the recipe below.


## Button Press

> Scale down on press so it feels real.

- Section: Motion
- URL: https://craft.gustavofior.com/button-press
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/button-press.mdx

A real button moves when you push it. A button on screen can borrow that with
one rule: **scale it down a little while it is pressed.** It tells you the
click landed before anything else has happened.

Press and hold both buttons.

> **Interactive demo: Button Press.** Open https://craft.gustavofior.com/button-press to try it.

The right one shrinks to `0.97` while your finger is down and comes back when
you let go. On a 120px button that is less than 2px per edge. You feel it more
than you see it, which is exactly what you want from press feedback. Every
button on this site does this.

### Finding the amount

Two numbers matter: how far the button shrinks and how quickly it gets there.
Drag the sliders and keep pressing.

> **Interactive demo: Press Amount.** Open https://craft.gustavofior.com/button-press to try it.

Around `0.97` the press feels physical. Below about `0.92` it turns into an
effect, and you notice the animation instead of the click. Keep the duration
near `100ms`. A quick click is over in about that long, so at 300ms the
button is still shrinking when you let go and never seems to land.

Scale runs on the compositor, so the press costs nothing, and the label and
icon shrink with the button for free.

### Not just buttons

Anything you can press can do the same: cards, tiles, chips. Toggle the
feedback and press the tiles.

> **Interactive demo: Press Everywhere.** Open https://craft.gustavofior.com/button-press to try it.

Larger surfaces want less. At `0.97` a 600px card pulls each edge in by 9px,
which starts to look like a zoom. Try `0.98` or `0.99` on anything wider than
a tile.

### Usage

**Tailwind**

```html
<button class="transition-transform duration-100 ease-out active:scale-[0.97]">
  Save changes
</button>
```

**CSS**

```css
.button {
  transition: transform 100ms ease-out;
}

.button:active {
  transform: scale(0.97);
}
```

Transition `transform` only, not `all`. A button usually changes color on
hover too, and you don't want the press timing to leak into that.

### Resources

- [7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): Emil Kowalski's short list of rules for interface motion, starting with a 0.97 scale on press.
- [Great animations](https://emilkowal.ski/ui/great-animations): Why speed and purpose matter more than how much something moves.
- [The :active pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:active): When the browser considers an element pressed.
- [Animations guide](https://web.dev/articles/animations-guide): Why transform and opacity are the cheapest properties to animate.


## Easings

> Ease-out for anything the user triggers.

- Section: Motion
- URL: https://craft.gustavofior.com/easings
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/easings.mdx

An **easing** is the speed profile of an animation: how fast it starts and how
it settles. Duration says how long a menu takes to open. Easing decides
whether it opened for you or at you.

Both menus below take 250ms. Open them.

> **Interactive demo: Easings.** Open https://craft.gustavofior.com/easings to try it.

The left one eases in. It starts slow and reaches full speed at the very end,
so the menu hesitates, then slams into place. The right one eases out. It
starts fast and slows as it lands, the way most physical things come to rest.

**Use ease-out for anything that appears because the user did something.**
They clicked, so the interface should move at once and then settle. Ease-in
has one good use: things that are leaving, where nobody needs to watch them
settle. [Exit animations](https://craft.gustavofior.com/exit-animations) covers that.

### Reading a curve

Time runs left to right and progress runs bottom to top. The dot and the ball
share one clock, slowed down to one second so you can follow them.

> **Interactive demo: Easing Curve.** Open https://craft.gustavofior.com/easings to try it.

Linear is a straight diagonal: the same speed the whole way, which reads as
mechanical. Ease-in bends down, ease-out bends up. In-out does both, and suits
something already on screen that moves to a new spot, rather than something
appearing.

### Stronger than the defaults

The browser's `ease-out` is `cubic-bezier(0, 0, 0.58, 1)`, and it is too
gentle. This site uses `cubic-bezier(0.23, 1, 0.32, 1)` instead, saved as
`--ease-snappy`. Scrub through the same 250ms.

> **Interactive demo: Strong Easing.** Open https://craft.gustavofior.com/easings to try it.

At 60ms, `ease-out` has covered 36% of the distance and `ease-snappy` has
covered 76%. Snappy is 90% of the way there at 90ms. Ease-out needs 185ms to
reach the same point. The duration is identical, but snappy does almost all
of its work in the first third and spends the rest settling, so it feels
twice as fast.

For a little overshoot, CSS can fake a spring with `linear()`, a list of
points the browser joins with straight lines. The site's `--ease-spring`
overshoots by 16% before it settles. Pick two or three curves like these and
use them everywhere. Consistent easing does more for a product than any single
animation.

### Usage

**Tailwind**

```css
@theme {
  --ease-snappy: cubic-bezier(0.23, 1, 0.32, 1);
}

/* Then: class="duration-250 ease-snappy" */
```

**CSS**

```css
:root {
  --ease-snappy: cubic-bezier(0.23, 1, 0.32, 1);
}

.menu {
  transition:
    opacity 250ms var(--ease-snappy),
    transform 250ms var(--ease-snappy);
}
```

Tailwind's own `ease-out` class is not the CSS keyword. It is
`cubic-bezier(0, 0, 0.2, 1)`, which is already stronger and reaches 90% at
150ms of a 250ms animation. Snappy still gets there 60ms sooner, which is why
it gets its own name.

### Resources

- [Great animations](https://emilkowal.ski/ui/great-animations): Emil Kowalski on why ease-out is the right curve for most interface motion.
- [7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): Short rules for interface motion, including why the built-in curves are not strong enough.
- [Easing functions cheat sheet](https://easings.net): Every common curve, drawn out, with the cubic-bezier values ready to copy.
- [The easing-function type](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function): The full CSS syntax, including cubic-bezier(), steps() and linear().
- [Linear easing generator](https://linear-easing-generator.netlify.app/): Jake Archibald's tool for turning a spring or any JavaScript easing into CSS linear().


## Stagger

> Turn one block into a sequence.

- Section: Motion
- URL: https://craft.gustavofior.com/stagger
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/stagger.mdx

When a list appears all at once, it reads as one block. When each row arrives
a moment after the one above, it reads as a list. **Stagger** is that small
offset between siblings.

Drag the slider. Every row fades and rises the same way. Only the gap between
them changes.

> **Interactive demo: Stagger.** Open https://craft.gustavofior.com/stagger to try it.

**Keep the gap between 30ms and 60ms.** That is enough for your eye to pick up
a direction, top to bottom. Past 100ms the last row is still arriving after
you have started reading the first, and the detail turns into a wait.

### Block vs sequence

The same list with and without a stagger. The animation on each row is
identical.

> **Interactive demo: Stagger Compare.** Open https://craft.gustavofior.com/stagger to try it.

The staggered list is not faster. It is easier to follow, because your eye
gets a starting point and a direction. The block gives you five things at
once.

### Long lists

Stagger adds up. A 60ms gap is fine on five rows and terrible on twenty, where
the last row starts 1,140ms after the first. For lists that can grow, cap the
total instead of fixing the step.

> **Interactive demo: Stagger Cap.** Open https://craft.gustavofior.com/stagger to try it.

A good cap is about 300ms from the first row to the last. Divide that by the
number of gaps and you have your step: 33ms for ten rows. For very long lists,
stagger only the rows on screen and show the rest at once.

The rows are content, not decoration. Animate only `opacity` and `transform`
so every row holds its space from the first frame, and keep rows clickable
while they fade in.

### Usage

**CSS**

```css
/* <li style="--index: 0">, <li style="--index: 1">, ... */
@keyframes rise-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.list > li {
  animation: rise-in 360ms cubic-bezier(0.23, 1, 0.32, 1) both;
  animation-delay: calc(var(--index) * 40ms);
}
```

**Motion**

```tsx
import { motion, stagger } from "motion/react";

const list = {
  visible: { transition: { delayChildren: stagger(0.04) } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: [0.23, 1, 0.32, 1] },
  },
};

<motion.ul initial="hidden" animate="visible" variants={list}>
  {rows.map((row) => (
    <motion.li key={row.id} variants={item}>
      {row.title}
    </motion.li>
  ))}
</motion.ul>
```

Keep `both` in the CSS shorthand. It sets `animation-fill-mode`, which holds
each row at its first frame during the delay. Without it, rows flash at full
opacity, disappear, then fade in. It is the most common stagger bug, and you
only notice it once the delays get long.

### Resources

- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): Jakub Krehel on splitting entering content into parts and staggering them.
- [Depth](https://rauno.me/craft/depth): Rauno Freiberg on choreographing elements so they don't all appear at once.
- [stagger()](https://motion.dev/docs/stagger): Motion's helper for spreading delays across children, used in the recipe below.
- [animation-delay](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-delay): The property behind a CSS stagger, and how negative and long delays behave.


## Interruptibility

> Animation that can change its mind.

- Section: Motion
- URL: https://craft.gustavofior.com/interruptibility
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/interruptibility.mdx

People change their mind halfway through an animation. They open a sheet and
close it before it lands, or hit a toggle twice in a row. An
**interruptible** animation turns around from wherever it is. One that isn't
jumps to a fixed frame and starts over.

Open the sheets, then close them before they arrive. Do it a few times
quickly. Both are slowed to 600ms so you can catch them mid-flight.

> **Interactive demo: Interruptibility.** Open https://craft.gustavofior.com/interruptibility to try it.

The left sheet uses CSS keyframes. A keyframe animation is a fixed clip with
its own start and end, so every click restarts it and the sheet teleports.
The right sheet uses a CSS transition, which animates from the current value
to the new one. It just turns around.

**If something can be triggered again before it finishes, animate it toward a
target instead of playing a clip.**

Keyframes are still fine for one-shots that nothing interrupts, like a
spinner or a shake on a wrong password.

### Springs keep their speed

A transition fixes the jump, but it restarts its easing curve on every new
target. Reverse it at full speed and it stops dead, then ramps up again. A
spring carries its velocity into the new target, so the reversal reads as one
motion instead of two.

Toggle twice quickly and watch each dot turn around.

> **Interactive demo: Spring Velocity.** Open https://craft.gustavofior.com/interruptibility to try it.

For anything people flick back and forth, like a switch, a drawer or a drag
handle, a spring is the safer default.

### New targets mid-flight

Reversing is not the only interruption. In a toast stack, every new toast
gives the others a new place to be. Add a few quickly.

> **Interactive demo: Toast Stack.** Open https://craft.gustavofior.com/interruptibility to try it.

On the left each toast only has a keyframe entrance, so the older ones jump
to their new spots. On the right Motion's `layout` prop moves them there from
wherever they are, even if the last move hasn't finished.
[Sonner](https://emilkowal.ski/ui/building-a-toast-component) started with
keyframes and switched to transitions for exactly this reason.

### Usage

**Tailwind**

```html
<div class="translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] data-open:translate-y-0">
  ...
</div>
```

**CSS**

```css
.sheet {
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

.sheet[data-open] {
  transform: translateY(0);
}
```

**Motion**

```tsx
import { motion } from "motion/react";

<motion.div
  animate={{ y: open ? 0 : "100%" }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```

Watch for keyframes hiding in utility classes. The `animate-in` and
`animate-out` classes from tw-animate-css are keyframes, so a popover built
with them restarts when it is closed mid-open. To check any component, open
and close it as fast as you can ten times. If anything flashes or jumps, it
isn't interruptible yet.

### Resources

- [Building a Toast Component](https://emilkowal.ski/ui/building-a-toast-component): Emil Kowalski on moving Sonner from keyframes to transitions so toasts could be retargeted mid-flight.
- [Base UI animation handbook](https://base-ui.com/react/handbook/animation): Why Base UI recommends transitions over keyframes for anything that opens and closes.
- [Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions): The MDN guide to transitions, the CSS tool that animates toward a target.
- [Transitions in Motion](https://motion.dev/docs/react-transitions): How physics-based springs carry the velocity of an animation that is already running.


## Hover Restraint

> Frequent interactions should be instant.

- Section: Motion
- URL: https://craft.gustavofior.com/hover-restraint
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/hover-restraint.mdx

Hover fires more than any other interaction. When you sweep the cursor across a nav
you can cross ten items in a second. If each one fades in, the
interface is always a few frames behind the pointer, and it reads as slow
even when nothing is.

**The more often something happens, the less
animation it can afford.**

> **Interactive demo: Hover Restraint.** Open https://craft.gustavofior.com/hover-restraint to try it.

The right one switches its highlight on with no transition at all. Instant
is the correct default for hover.

### Tooltips

Tooltips are one hover case where a delay helps. Without one they pop
up while you are just passing through on the way to something else.

So the first tooltip should wait, around 400ms to 700ms, and then its neighbors
should appear at once. You have already shown you want the labels, and
making you wait again for each one is frustrating.

> **Interactive demo: Hover Tooltip.** Open https://craft.gustavofior.com/hover-restraint to try it.

### Keyboard actions

The same thinking applies away from the pointer.

> **Interactive demo: Keyboard Action.** Open https://craft.gustavofior.com/hover-restraint to try it.

Someone toggling a sidebar with a shortcut is your fastest user. They are
not looking for the panel to arrive from somewhere. They already know what
the shortcut does, and a 250ms slide is like a speeding ticket.

The line to draw is by frequency and intent, not by input device. A modal
that opens once a session can animate. A panel you flip forty times a day
should not.

Notable examples of interactions that would be worse if animated:

- [Raycast launcher](https://www.raycast.com/): Opens and closes with no transition, every time.
- [macOS Alt+Tab](https://rauno.me/craft/interaction-design): Rauno Freiberg on why the app switcher appears instantly.

### Resources

- [You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations): Emil Kowalski on when animation helps and when it gets in the way, with hover as the main case.
- [7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): Short, concrete rules for interface motion, including how tooltips should behave.
- [Base UI Tooltip](https://base-ui.com/react/components/tooltip): The tooltip used on this site, with the delay and instant-open behavior built in.
- [The :hover pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover): What counts as hover across mouse, pen and touch, and why it is unreliable on touch.


## Shared Layout

> One element moving beats two swapping.

- Section: Motion
- URL: https://craft.gustavofior.com/shared-layout
- Published: 2026-07-16
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/shared-layout.mdx

When a tab highlight jumps from one tab to the next, your eye has to find it
again. When it slides, you never lose it. A **shared layout** animation
treats two elements in two places as one element that moves.

Click the tabs. Both rows follow the same state.

> **Interactive demo: Shared Layout.** Open https://craft.gustavofior.com/shared-layout to try it.

On the left the highlight disappears from one tab and appears under another.
On the right it travels, so it tells you where you are and where you came
from.

**If two elements are the same thing to the user, move one instead of
swapping two.**

In Motion you give both elements the same `layoutId`. When one unmounts and
the other mounts, Motion measures where the old one was and animates the new
one from there with a transform. This is the FLIP technique.

### From list to detail

The same idea carries further than tabs. Open a project, go back, then switch
to Shared and do it again.

> **Interactive demo: Shared Layout Detail.** Open https://craft.gustavofior.com/shared-layout to try it.

With a swap, the whole view is replaced and you have to re-read it to check
you landed in the right place. With a shared layout, the thumbnail and title
carry over and only the rest is new.

Keep it quick. Both demos use a spring with no bounce that settles in 300ms.

### Where it goes wrong

Shared layout scales elements to move them, and scale distorts corners and
shadows. Motion corrects `borderRadius` and `boxShadow`, but only when they
are set through `style`, not a class. Text inside a box that changes shape
can stretch, so the title above uses `layout="position"` to move without
scaling.

### Usage

**Motion**

```tsx
import { motion } from "motion/react";

{tabs.map((tab) => (
  <button key={tab} className="relative" onClick={() => setActive(tab)}>
    {tab === active && (
      <motion.span
        className="absolute inset-0 bg-white"
        layoutId="tab-indicator"
        style={{ borderRadius: 6 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      />
    )}
    <span className="relative">{tab}</span>
  </button>
))}
```

**CSS**

```css
/* Names must be unique, so name only the clicked thumbnail, in JS:
   thumb.style.viewTransitionName = "project-thumb";
   document.startViewTransition(() => openProject(id)); */

.detail-header {
  view-transition-name: project-thumb;
}

::view-transition-group(project-thumb) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}
```

Without React, the View Transition API does this natively. Same-document view
transitions work in Chrome, Edge, Safari and Firefox. They are not
interruptible, though: starting a new one skips the one in progress, so a
fast second click makes the morph snap to its end instead of turning around.

### Resources

- [How I Use Shared Layout Animations](https://jakub.kr/work/shared-layout-animations): Jakub Krehel on layoutId, with interactive examples of where morphs make sense.
- [Layout animations in Motion](https://motion.dev/docs/react-layout-animations): The official guide to layout and layoutId, including how to fix scale distortion.
- [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/): Paul Lewis's original write-up of the First, Last, Invert, Play technique behind shared layout.
- [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API): The native way to morph elements between two states of the page, without a library.


## Exit Animations

> Leave faster and quieter than you came.

- Section: Motion
- URL: https://craft.gustavofior.com/exit-animations
- Published: 2026-07-16
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/exit-animations.mdx

The lazy exit is the entrance played backwards: same distance, same
duration, same curve. It looks tidy, but it gives a goodbye as much time as a
hello. **Something leaving deserves less ceremony than something arriving.**

Dismiss the toasts and watch them go.

> **Interactive demo: Exit Animations.** Open https://craft.gustavofior.com/exit-animations to try it.

Both enter the same way, rising 12px over 240ms. The left one leaves by doing
that again in reverse. The right one fades out in half the time, 120ms, with
2px of blur, no travel and an ease-in.

An entrance has a job. Something new is here, and the motion shows you where
it came from. An exit has none. The user has already moved on, and anything
that makes them watch is in the way. So exits get about half the duration and
less movement. They are also the one place ease-in fits, since the element is
speeding away and nobody needs to watch it settle.

In React, an element removed from the tree is gone before it can animate.
Motion's `AnimatePresence` keeps it mounted until its `exit` animation
finishes.

### Exits that keep layout steady

The exit people forget most is a row leaving a list. Without one, the row
vanishes and everything below it jumps up in a single frame. Delete a few
tasks on each side.

> **Interactive demo: Exit List.** Open https://craft.gustavofior.com/exit-animations to try it.

On the right the row collapses its height while it fades, so the rows beneath
slide up instead of teleporting. It takes 160ms, short enough that you barely
notice it, and long enough that your eye can follow the list.

### Usage

**Motion**

```tsx
import { AnimatePresence, motion } from "motion/react";

<AnimatePresence initial={false}>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(0px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        filter: "blur(2px)",
        transition: { duration: 0.12, ease: "easeIn" },
      }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
    >
      Changes saved
    </motion.div>
  )}
</AnimatePresence>
```

**CSS**

```css
.toast {
  display: block;
  transition:
    opacity 240ms cubic-bezier(0.23, 1, 0.32, 1),
    translate 240ms cubic-bezier(0.23, 1, 0.32, 1),
    display 240ms allow-discrete;

  @starting-style {
    opacity: 0;
    translate: 0 12px;
  }
}

.toast[hidden] {
  display: none;
  opacity: 0;
  filter: blur(2px);
  transition:
    opacity 120ms ease-in,
    filter 120ms ease-in,
    display 120ms allow-discrete;
}
```

In CSS, the transition that runs is the one declared on the state you are
moving to. So the entrance timing lives on `.toast`, the exit timing lives on
`.toast[hidden]`, and `allow-discrete` holds off `display: none` until the
fade has finished.

### Resources

- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): Jakub Krehel's collection of small motion decisions, including why exits should be subtler than entrances.
- [AnimatePresence](https://motion.dev/docs/react-animate-presence): How Motion keeps a removed React element mounted until its exit animation finishes.
- [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style): The CSS rule that gives an element something to transition from when it first appears.
- [transition-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior): How allow-discrete lets an element fade out before display none removes it.


## Scale Entrances

> Grow from the trigger, not from zero.

- Section: Motion
- URL: https://craft.gustavofior.com/scale-entrances
- Published: 2026-07-16
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/scale-entrances.mdx

Menus, popovers and dialogs often enter with a bit of scale, so they seem to
arrive instead of switching on. But a **scale entrance** that starts at zero
looks like a cartoon zoom. One that starts at `0.95` looks like a small
settle.

Open both menus. Same duration, same easing, different starting scale.

> **Interactive demo: Scale Entrances.** Open https://craft.gustavofior.com/scale-entrances to try it.

The left menu spends the start of its animation as an unreadable smudge,
because the text scales with the box. The right one is readable from the
first frame. The scale is a hint of movement, not the movement itself.

**Start a scale entrance between 0.9 and 0.97, fade it in, and grow it from
the thing that opened it.**

### Grow from the trigger

By default an element scales from its center. That suits a dialog in the
middle of the screen. A menu under a button in the corner should grow out of
that corner, so it looks attached to what you clicked. The dot marks the
origin.

> **Interactive demo: Transform Origin.** Open https://craft.gustavofior.com/scale-entrances to try it.

Same `0.9` start, same timing. The only change is `transform-origin`.

A positioning library already knows where the trigger is. Base UI exposes it
on every anchored popup as `--transform-origin`, so one line covers every side
the menu can open on. Radix has a variable for each component, like
`--radix-dropdown-menu-content-transform-origin`.

### Find your number

Drag the slider to change where the menu starts. It is slowed to 480ms so you
can see the shape of it.

> **Interactive demo: Starting Scale.** Open https://craft.gustavofior.com/scale-entrances to try it.

Below `0.8` it starts to read as a zoom. Above `0.98` you may as well drop the
scale and keep the fade.

### Usage

**Tailwind**

```tsx
<Popover.Popup
  className="origin-(--transform-origin) transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
    data-starting-style:scale-95 data-starting-style:opacity-0
    data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100"
>
  ...
</Popover.Popup>
```

**CSS**

```css
.popup {
  transform-origin: var(--transform-origin);
  transition:
    opacity 200ms cubic-bezier(0.23, 1, 0.32, 1),
    scale 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

.popup[data-starting-style],
.popup[data-ending-style] {
  opacity: 0;
  scale: 0.95;
}

.popup[data-ending-style] {
  transition-duration: 100ms;
}
```

`--transform-origin` only exists inside Base UI's anchored popups. For a
menu you place yourself, set the origin to the corner nearest the trigger,
like `origin-top-right` for a menu that opens below a right-aligned button.

### Resources

- [7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips): Emil Kowalski's list, including why popovers should not start from scale(0) and should grow from their trigger.
- [CSS Transforms](https://emilkowal.ski/ui/css-transforms): An interactive walk through scale, translate and transform-origin.
- [Base UI animation handbook](https://base-ui.com/react/handbook/animation): The starting and ending style attributes, and the transform origin variable on anchored popups.
- [transform-origin](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin): The MDN reference for the property that decides where a scale grows from.


## Reduced Motion

> Reduce motion, keep meaning.

- Section: Motion
- URL: https://craft.gustavofior.com/reduced-motion
- Published: 2026-10-02
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/reduced-motion.mdx

Movement on screen can make some people dizzy or sick. Sliding panels, zooms
and parallax are the usual triggers, which is why every major operating system
has a setting to reduce motion. The browser exposes it as
`prefers-reduced-motion: reduce`.

The tempting fix is to set every duration to 0. That removes the movement, but
it also removes whatever the motion was telling you. Press the button and flip
between the three.

> **Interactive demo: Reduced Motion.** Open https://craft.gustavofior.com/reduced-motion to try it.

**Reduced motion means less movement, not no animation.** Swap translates,
scales and parallax for a short opacity fade, and keep the feedback that shows
what changed.

### What to keep

Things traveling across the screen are the problem. A fade or a color change
doesn't move anything, so it can stay. In the reduced version the new row fades
in over 150ms and its highlight still fades out, so you can see which message
arrived. At 0ms the row just appears and the highlight is gone before it's ever
painted.

Zero also breaks code. A transition with no duration never starts, so
`transitionend` never fires, and anything waiting for it, like unmounting a
closed sheet, waits forever. If you need to flatten a transition, use 1ms.

### In React

Wrap the app in `<MotionConfig reducedMotion="user">` and every motion
component drops transform and layout animations when the setting is on, while
opacity and color keep animating. For anything else, `useReducedMotion()`
returns the preference so you can choose a different animation yourself.

### On this site

The index thumbnails stop their hover animations and cut transitions to 1ms
rather than 0. Some demos, like [icon morph](https://craft.gustavofior.com/icon-morph) and
[stagger](https://craft.gustavofior.com/stagger), keep their fade and drop the scale or the rise. Others
still drop to 0ms. A demo you press to watch, like the one above, always plays,
because watching it is the point.

### Usage

**Tailwind**

```html
<div
  class="transition-opacity duration-150 data-closed:opacity-0
    motion-safe:transition-[opacity,translate] motion-safe:duration-300
    motion-safe:data-closed:translate-y-4"
></div>
```

**React**

```tsx
import { MotionConfig, motion } from "motion/react";

<MotionConfig reducedMotion="user">
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
  />
</MotionConfig>
```

`MotionConfig` only reaches motion components. CSS transitions, keyframes and
autoplaying video in the same app still need the media query, and the fade
keeps the original duration, so shorten long ones yourself.

### Resources

- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): The media feature that reads the operating system's reduce motion setting, on MDN.
- [prefers-reduced-motion: Sometimes less movement is more](https://web.dev/articles/prefers-reduced-motion): Why the setting exists and how to design a calmer version instead of a blank one.
- [Understanding WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): The success criterion on motion triggered by interaction, and what counts as essential.
- [Motion accessibility](https://motion.dev/docs/react-accessibility): How MotionConfig and useReducedMotion handle the setting in React.
- [Accessible animations in React](https://www.joshwcomeau.com/react/prefers-reduced-motion/): Josh Comeau on building the preference into components from the start.
