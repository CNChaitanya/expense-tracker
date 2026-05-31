# ExpTracker 🚀

ExpTracker is a premium, local-first web application designed for delightful and private financial management. Built with a modern tech stack focusing on performance, aesthetics (Glassmorphism), and user privacy.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20SQLite-purple.svg)

---

## ✨ Key Features

### 📊 Powerful Analytics
- **Spending Heatmap**: GitHub-style 12-week visual tracking of your daily spending.
- **Interactive Charts**: Category distribution (Donut) and daily trends (Line) powered by Recharts.
- **Smart Insights**: Automated data analysis telling you where your money goes and if you're on track.

### 🛡️ Privacy & Reliability
- **Local-First**: Your data never leaves your device. Everything is stored in a local SQLite database (via `sql.js`).
- **Offline Ready**: Full functionality without an internet connection using IndexedDB persistence.
- **Data Portability**: Export your entire history to CSV or JSON, or import from existing spreadsheets.

### 🎨 Delightful UX
- **Glassmorphism UI**: High-end aesthetic with `backdrop-filter` effects and smooth animations.
- **Gamified Savings**: Maintain "Spending Streaks" 🔥 and earn an A+ on your Monthly Report Card.
- **Premium Interactivity**: Animated money counters, sound effects, and confetti celebrations.
- **Global Search**: Command palette (`Ctrl+K`) for instant access to every transaction.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [SQLite (WASM)](https://sql.js.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **State/Persistence**: [localforage](https://localforage.github.io/localForage/) + [React Context](https://reactjs.org/docs/context.html)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository (or copy the folder):
   ```bash
   git clone <your-repo-url>
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
expense-tracker/
├── src/
│   ├── components/      # Glassmorphism UI components & charts
│   ├── db/              # Drizzle schema and SQLite client setup
│   ├── hooks/           # Custom logic (useExpenses, useStreaks, useShortcuts)
│   ├── lib/             # Utilities (Currency, Import/Export, Confetti)
│   ├── store/           # Global Theme & Database context
│   └── App.tsx          # Main routing and navigation
├── public/              # Static assets and WASM binary
├── specs/               # Spec-Driven Development documentation
└── .specify/            # AI Agent orchestration memory (SDD)
```

---

## ⌨️ Keyboard Shortcuts

- `1` / `2` / `3` / `4` — Navigate between pages
- `N` or `+` — Open "Add Transaction" modal
- `Ctrl + K` — Open Global Search
- `Esc` — Close any open modal

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ by Gemini CLI using Spec-Driven Development (SDD).*
