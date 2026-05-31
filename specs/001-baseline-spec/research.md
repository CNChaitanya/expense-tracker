# Research: ExpTracker Baseline

## Decision: Core Frameworks & Dependencies
- **Frontend**: React 18+ with Vite as the build tool for fast HMR and optimized production builds.
- **Styling**: Tailwind CSS for a utility-first approach to UI development, enabling glassmorphism effects easily.
- **Persistence**: `sql.js` (SQLite WASM) for the core database engine in the browser.
- **ORM**: Drizzle ORM for type-safe query building and schema management.
- **State Management**: React Context API for global state (Theme, DB connection) combined with TanStack Query for data fetching and caching.
- **Charts**: Recharts or Lucide-React for visualization (interactive donut and line charts).
- **Icons**: Lucide-React for a clean, consistent icon set.

## Rationale
- **React + Vite**: Industry standard for modern web apps; Vite's speed is essential for a smooth developer experience.
- **Tailwind CSS**: Simplifies responsive design and complex styling (glassmorphism) without writing custom CSS.
- **sql.js + Drizzle**: Meets the "SQLite-First" principle. Drizzle provides the best DX for TypeScript while supporting the underlying SQLite structure.
- **Recharts**: Highly customizable and SVG-based, perfect for the responsive dashboard requirements.

## Decision: Storage Strategy
- **SQLite Engine**: Initialized as a WASM module.
- **Persistence Layer**: The SQLite database file will be persisted to **IndexedDB** using a wrapper like `localforage` or custom logic to ensure data survives page refreshes, adhering to the "Local-First" principle.
- **Receipts**: Receipt photos will be stored as Base64 strings within the SQLite `BLOB` or `TEXT` column, with a client-side resolution limit (e.g., max 1024px) to prevent storage bloat.

## Decision: Financial Accuracy
- **Monetary Storage**: All amounts will be stored as **Integers** (cents/paise) in the database.
- **Logic**: Use `decimal.js` for complex calculations (analytics, averages) to ensure precision before displaying to the user.

## Alternatives Considered
- **PouchDB/CouchDB**: Rejected because the constitution mandates SQLite.
- **LocalStorage**: Rejected for primary storage due to 5MB limits and lack of structured query support; used only as a secondary backup or for small settings.
- **Chart.js**: Rejected in favor of Recharts for better React integration and SVG-based responsiveness.
