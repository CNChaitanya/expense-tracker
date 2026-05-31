# Quickstart: ExpTracker Baseline

## Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Database Setup**:
   The application initializes the SQLite database automatically on first load in the browser. Initial categories (Food, Travel, Entertainment, etc.) are seeded by the initialization script.

## Core Workflows

### 1. Adding an Expense
- Click the "+" button on the floating action bar.
- Enter the amount (displayed as currency, stored as cents).
- Select a category and date.
- (Optional) Attach a receipt photo or add tags.
- Save.

### 2. Setting a Budget
- Go to the "Budgets" tab.
- Edit a category to set its monthly budget amount.
- Save. Progress bars on the dashboard will now reflect this limit.

### 3. Data Management
- Access the "Settings" page for Import/Export.
- Export to CSV for external backups.
- Import from CSV to migrate data from other trackers.

## Troubleshooting
- **Database not loading**: Ensure WASM is enabled in your browser and check the console for `sql.js` initialization errors.
- **Persistence Issues**: Check if "Private Browsing" or "Incognito" mode is preventing IndexedDB from saving the SQLite file.
