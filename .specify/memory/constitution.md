<!--
## Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- List of modified principles:
  - V. Interoperability & Openness (Updated for web context)
- Added sections: None
- Removed sections: CLI Framework reference
- Templates requiring updates (✅ updated / ⚠ pending):
  - .specify/templates/plan-template.md ✅
  - .specify/templates/spec-template.md ✅
  - .specify/templates/tasks-template.md ✅
- Follow-up TODOs: Ensure Vite and Tailwind configuration is prioritized in initial setup tasks.
-->

# ExpTracker Constitution

## Core Principles

### I. Financial Accuracy & Precision
Financial calculations MUST NOT use floating-point arithmetic. All monetary values MUST be handled using integer cents or specialized decimal libraries (e.g., `decimal.js`) to prevent rounding errors.

### II. Privacy & Local-First Data
The user owns their data. Data MUST be stored locally by default. Any cloud synchronization MUST be opt-in and end-to-end encrypted. No third-party tracking or analytics.

### III. SQLite-First Persistence
Persistence MUST use SQLite to ensure data is structured, queryable, and portable. Schema migrations MUST be managed, versioned, and reversible. For web environments, this is achieved via `sql.js` (SQLite in WASM).

### IV. Auditability & Integrity
Every transaction MUST have a timestamp and a unique identifier. Once recorded, the core attributes of a transaction SHOULD be immutable; corrections should be handled via adjustments or deletions with logged history.

### V. Interoperability & Openness
Data MUST NOT be locked in. The system MUST support standard export formats (CSV, JSON) to ensure users can transition their data to other tools or perform custom analysis.

## Technology Stack
The project will utilize the following core technologies to uphold the principles:
- **Language**: TypeScript (Strict mode) for type safety and domain modeling.
- **Frontend**: React with Vite for a fast, modern web experience.
- **Styling**: Tailwind CSS for consistent and maintainable UI design.
- **Persistence**: SQLite (via `sql.js`) with Drizzle ORM for type-safe database interactions in the browser.
- **Testing**: Vitest for fast, unit-tested financial logic and component testing.

## Development Workflow
1. **Spec-Driven**: All features must be defined in `.specify/` before implementation.
2. **Test-First**: Core financial logic and data migrations require 100% test coverage.
3. **Surgical Edits**: Maintain a clean codebase with minimal, focused changes.

## Governance
This constitution is the "Supreme Law" of the project. Any implementation that violates these principles MUST be rejected. Amendments to this document require a MINOR or MAJOR version bump and must be documented in the repository history.

All Pull Requests must include a "Constitution Compliance" check in their description. The `GEMINI.md` file serves as the runtime guidance for the AI agent to ensure alignment with these principles.

**Version**: 1.1.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31
