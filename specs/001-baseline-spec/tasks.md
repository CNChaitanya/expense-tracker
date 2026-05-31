# Tasks: ExpTracker Baseline

**Input**: Design documents from `/specs/001-baseline-spec/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included to ensure behavioral correctness.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] Initialize Vite project with React and TypeScript in `/`
- [ ] T002 [P] Install core dependencies: `sql.js`, `drizzle-orm`, `tailwind-css`, `lucide-react`, `recharts`, `decimal.js`
- [ ] T003 [P] Configure Tailwind CSS with glassmorphism utility classes in `tailwind.config.js`
- [ ] T004 [P] Configure Vitest for unit testing in `vitest.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Setup Drizzle schema and SQLite migration logic in `src/db/schema.ts`
- [ ] T006 Implement `sql.js` initialization and IndexedDB sync logic in `src/db/client.ts`
- [ ] T007 [P] Create `useDatabase` hook for shared DB access in `src/hooks/useDatabase.ts`
- [ ] T008 [P] Implement `Decimal` utility for financial calculations in `src/lib/currency.ts`
- [ ] T009 [P] Setup base layout with Dark/Light mode provider in `src/components/Layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core Expense Management (Priority: P1) 🎯 MVP

**Goal**: Enable CRUD operations for expenses with relevant metadata.

**Independent Test**: Create an expense and verify it persists in the SQLite database after a page reload.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Implement Category and Expense models in `src/db/schema.ts`
- [ ] T011 [P] [US1] Create expense entry form with validation in `src/components/ExpenseForm.tsx`
- [ ] T012 [P] [US1] Implement `useExpenses` hook for CRUD operations in `src/hooks/useExpenses.ts`
- [ ] T013 [US1] Add receipt attachment logic (Base64) in `src/components/ReceiptUploader.tsx`
- [ ] T014 [US1] Implement expense list view with filtering in `src/components/ExpenseList.tsx`
- [ ] T015 [US1] Add recurring expense engine (on app load) in `src/lib/recurring.ts`

**Checkpoint**: At this point, User Story 1 is fully functional as an MVP.

---

## Phase 4: User Story 2 - Monthly Dashboard & Budgets (Priority: P1)

**Goal**: Provide visual feedback on spending against budgets.

**Independent Test**: Set a budget for 'Food' and verify the progress bar turns red when 80% is spent.

### Implementation for User Story 2

- [ ] T016 [P] [US2] Create Budget management hook in `src/hooks/useBudgets.ts`
- [ ] T017 [P] [US2] Implement summary metric cards (Total Spent, Balance) in `src/components/SummaryCards.tsx`
- [ ] T018 [P] [US2] Integrate Recharts for Category Donut chart in `src/components/CategoryChart.tsx`
- [ ] T019 [US2] Implement Budget progress bars with threshold alerts in `src/components/BudgetMonitor.tsx`
- [ ] T020 [US2] Create daily spending trend line chart in `src/components/TrendChart.tsx`

**Checkpoint**: Dashboards and budgets are now functional and integrated with expense data.

---

## Phase 5: User Story 3 - Data Portability & Offline Use (Priority: P2)

**Goal**: Ensure data can be exported/imported and works without a network.

**Independent Test**: Export data to CSV, clear database, and import the CSV to restore state.

### Implementation for User Story 3

- [ ] T021 [P] [US3] Implement CSV/JSON export logic in `src/lib/export.ts`
- [ ] T022 [P] [US3] Implement CSV import parser in `src/lib/import.ts`
- [ ] T023 [US3] Create Data Settings page for import/export actions in `src/pages/Settings.tsx`
- [ ] T024 [US3] Verify IndexedDB persistence reliability via automated refresh tests.

**Checkpoint**: Data portability and offline resilience are verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UI/UX refinements and final touches.

- [ ] T025 [P] Implement glassmorphism design across all cards in `src/index.css`
- [ ] T026 [P] Add skeleton loading states for charts and lists in `src/components/Skeleton.tsx`
- [ ] T027 [P] Configure toast notifications for all CRUD actions in `src/hooks/useNotification.ts`
- [ ] T028 Final responsive audit across mobile and desktop breakpoints.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Stories (Phase 3-5)**: All depend on Phase 2.
  - US1 (MVP) is the highest priority.
- **Polish (Phase 6)**: Final phase.

### Parallel Opportunities

- Setup tasks T001-T004 can run in parallel.
- Foundational tasks T007-T009 can run in parallel.
- Once Foundation is complete, US1, US2, and US3 can proceed in parallel if logical dependencies (e.g., hooks) are resolved.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational.
2. Implement User Story 1 (Expense CRUD).
3. **VALIDATE**: Ensure local persistence via SQLite + IndexedDB works.

### Incremental Delivery

1. Add Dashboard/Budgets (US2) to visualize US1 data.
2. Add Data Portability (US3) for security and backup.
3. Apply final UI/UX polish (Phase 6).
