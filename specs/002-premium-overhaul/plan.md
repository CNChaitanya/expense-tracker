# Implementation Plan: Premium Overhaul Phase 1 - Visual Foundation

**Branch**: `002-premium-overhaul` | **Date**: 2026-05-31 | **Spec**: [specs/002-premium-overhaul/spec.md]

## Summary
Transform the visual identity of ExpTracker by implementing a sophisticated theme system, high-end glassmorphism effects, animated backgrounds, and interactive micro-animations.

## Technical Context
- **Language**: TypeScript
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Fonts**: Inter Variable (Google Fonts)

## Constitution Check
- [x] **I. Financial Accuracy**: No changes to core calculations.
- [x] **II. Privacy**: All preferences (themes, AMOLED mode) stored in `localStorage`.
- [x] **III. SQLite-First**: No schema changes in this phase.
- [x] **IV. Auditability**: No changes to transaction recording.
- [x] **V. Interoperability**: No changes to data formats.

## Project Structure (New Components)
```text
src/
├── components/
│   ├── visual/
│   │   ├── AuroraBackground.tsx  # Floating gradient orbs
│   │   ├── CursorGlow.tsx        # Cursor trail effect
│   │   └── Lightbox.tsx          # Receipt image viewer
│   └── ui/
│       ├── GlassCard.tsx         # Reusable glassmorphism container
│       └── LiquidButton.tsx      # SVG-morphed action button
├── store/
│   └── ThemeContext.tsx          # Updated to support 5 themes + AMOLED
└── hooks/
    └── useCursorGlow.ts          # Mouse tracking logic
```

## Phase 1 Execution Steps

### 1. Global Styles & Typography
- Import Inter Variable in `index.html`.
- Update `index.css` with CSS variables for all 5 themes.
- Redefine `@utility glass` and `.glass-dark`.
- Add global hover and focus micro-interactions.

### 2. Foundational Components
- Implement `AuroraBackground` with Framer Motion.
- Implement `CursorGlow` for the interactive trail.
- Update `Layout` to include `AuroraBackground` and `CursorGlow`.

### 3. Theme System Overhaul
- Update `ThemeContext` to manage `theme` (5 options) and `isAmoled` flag.
- Add `ThemeSelector` component to Settings.
- Implement smooth CSS variable transitions.

### 4. Component Refactoring
- Wrap all dashboard cards and modals in the new `GlassCard` (or update existing CSS classes).
- Update `SummaryCards` with gradient text and larger typography.
- Implement the receipt `Lightbox`.

### 5. Interaction Polish
- Add `staggerChildren` to all lists (Expenses, Budgets).
- Implement morphing icon effects on category icons.
- Add spring physics to all modal entrances.
