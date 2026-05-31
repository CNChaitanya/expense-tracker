# Research: Premium Overhaul Phase 1 - Visual Foundation

## Theme System Design
We will use CSS Variables (Custom Properties) defined on `:root` to handle dynamic theme switching. Tailwind CSS v4's `@theme` block will be the primary consumer of these variables.

### Themes Specification (CSS Variables)
| Theme | Primary Start | Primary End | Accent Start | Accent End | Glow Color |
|-------|---------------|-------------|--------------|------------|------------|
| Cosmic | #6366f1 | #a855f7 | #06b6d4 | #3b82f6 | rgba(139, 92, 246, 0.5) |
| Ocean | #0ea5e9 | #2dd4bf | #22d3ee | #0284c7 | rgba(14, 165, 233, 0.5) |
| Sunset | #f43f5e | #fb923c | #fbbf24 | #e11d48 | rgba(244, 63, 94, 0.5) |
| Forest | #10b981 | #84cc16 | #a855f7 | #059669 | rgba(16, 185, 129, 0.5) |
| Inferno | #ef4444 | #f59e0b | #dc2626 | #ea580c | rgba(239, 68, 68, 0.5) |

## Aurora Background Implementation
Using `framer-motion` for the floating orbs to ensure smooth, performant animations.
- `motion.div` with `animate={{ x: [...], y: [...] }}` and `transition={{ duration: 20, repeat: Infinity, ease: "linear" }}`.
- Three orbs with large `blur(80px)` and low `opacity: 0.12`.

## Glassmorphism 2.0 Utility
Updating the `.glass` utility in `index.css`:
```css
@utility glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
}
```

## Cursor Trail Glow
Implementation via a global `useCursorGlow` hook:
- Listen to `mousemove` on `window`.
- Update a `motion.div` position with a small lag/spring.
- Radial gradient background: `radial-gradient(circle, rgba(var(--primary-glow), 0.15) 0%, transparent 70%)`.

## Image Lightbox
Using a simple custom component with `framer-motion`'s `AnimatePresence`:
- `layoutId` for smooth shared element transition if possible, otherwise simple scale/fade.
- `html2canvas` is required for later phases (sharing) but we'll install it now as part of Phase 1 preparation.
