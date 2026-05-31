# Tasks: Premium Overhaul Phase 1 - Visual Foundation

**Input**: Design documents from `/specs/002-premium-overhaul/`

**Prerequisites**: plan.md (required), spec.md (required), research.md

---

## Phase 1.1: Global Infrastructure & Typography

- [ ] T001 [P] Update `index.html` to import Inter Variable font and JetBrains Mono
- [ ] T002 [P] Update `index.css` with CSS variables for all 5 themes (Cosmic, Ocean, Sunset, Forest, Inferno)
- [ ] T003 [P] Redefine `@utility glass` and `.glass-dark` with Glassmorphism 2.0 specs in `index.css`
- [ ] T004 [P] Add global micro-interaction transitions and cursor glow styles to `index.css`

---

## Phase 1.2: Theme System & State

- [ ] T005 Update `ThemeContext.tsx` to support 5 named themes and `isAmoled` state
- [ ] T006 Implement smooth CSS variable switching logic in `ThemeContext.tsx`
- [ ] T007 Create `ThemeSelector` component for visual theme picking in `src/components/ThemeSelector.tsx`
- [ ] T008 Integrate `ThemeSelector` and AMOLED toggle into `src/components/Settings.tsx`

---

## Phase 1.3: Visual Foundational Components

- [ ] T009 Create `AuroraBackground` component using Framer Motion in `src/components/visual/AuroraBackground.tsx`
- [ ] T010 Create `CursorGlow` component and `useCursorGlow` hook in `src/components/visual/CursorGlow.tsx`
- [ ] T011 Update `Layout.tsx` to wrap content in `AuroraBackground` and add `CursorGlow`
- [ ] T012 Implement `staggerChildren` variants for Framer Motion in `src/lib/animations.ts`

---

## Phase 1.4: Component Elevation

- [ ] T013 Update `SummaryCards.tsx` with text-5xl font-black and gradient text effects
- [ ] T014 Update `ExpenseList.tsx` to use staggered entry animations and JetBrains Mono for amounts
- [ ] T015 Implement `Lightbox` component for receipt images in `src/components/visual/Lightbox.tsx`
- [ ] T016 Update `ExpenseList` to trigger `Lightbox` on receipt thumbnail click
- [ ] T017 Update all modal containers to use spring physics and glassmorphism 2.0

---

## Phase 1.5: Verification

- [ ] T018 Verify build success with `npm run build`
- [ ] T019 Manually verify theme switching and aurora background performance
- [ ] T020 Audit contrast ratios for all 5 themes to ensure accessibility
