# Implementation Plan: ExpTracker Baseline

**Branch**: `master` | **Date**: 2026-05-31 | **Spec**: [specs/001-baseline-spec/spec.md]

## Summary
Build a modern, local-first web application for expense tracking using React, Vite, and SQLite (WASM). The baseline includes full expense CRUD, recurring transactions, category-based budgeting, and a visual dashboard.

## Technical Context

**Language/Version**: TypeScript 5.0+

**Primary Dependencies**: React 18, Vite, Tailwind CSS, `sql.js`, Drizzle ORM, Recharts, Lucide-React, `decimal.js`

**Storage**: SQLite (WASM) persisted to IndexedDB via custom sync logic.

**Testing**: Vitest for unit tests, Playwright for end-to-end user flows.

**Target Platform**: Modern Web Browsers (Mobile & Desktop).

**Project Type**: Web Application.

**Performance Goals**: <500ms initial load, <200ms transaction persistence.

**Constraints**: Offline-capable, zero server dependencies, local-first privacy.

**Scale/Scope**: Optimized for personal use (10k+ transactions per year).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Financial Accuracy**: Integer cents storage confirmed in `data-model.md`.
- [x] **II. Privacy & Local-First**: SQLite-WASM and IndexedDB persistence confirmed.
- [x] **III. SQLite-First**: Schema defined in `data-model.md`.
- [x] **IV. Auditability**: `created_at` and UUIDs included in schema.
- [x] **V. Interoperability**: CSV/JSON export/import workflows defined in `quickstart.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-baseline-spec/
├── plan.md              # Implementation strategy
├── research.md          # Technology decisions
├── data-model.md        # Database schema
├── quickstart.md        # Setup and workflows
├── contracts/           # UI and Data contracts
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── components/          # UI Components (Charts, Cards, Forms)
├── hooks/               # useDatabase, useExpenses, useBudgets
├── db/                  # Drizzle schema and migrations
├── lib/                 # Decimal utility, Export/Import logic
├── store/               # Theme and Global state
└── App.tsx              # Main layout and routing
```

**Structure Decision**: Standard React application layout with dedicated `db/` and `hooks/` directories to manage the local-first state effectively.
