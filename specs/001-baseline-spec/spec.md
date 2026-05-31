# Feature Specification: ExpTracker Baseline

**Feature Branch**: `001-baseline-spec`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "EXPENSES: 1. Add/Edit/Delete expenses..., DASHBOARD: 5. Monthly overview..., BUDGETS: 10. Set monthly budget..., ANALYTICS: 13. Month-over-month..., DATA: 16. Export/Import..., UI/UX: Dark/Light mode, Glassmorphism, Responsive..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Expense Management (Priority: P1)

As a user, I want to record my daily expenses with relevant details so I can track my spending accurately.

**Why this priority**: This is the core utility of the application; without recording data, no other features function.

**Independent Test**: Can be tested by creating, editing, and deleting an expense and verifying it appears in the list with all fields (amount, category, date, note, payment method).

**Acceptance Scenarios**:

1. **Given** the app is open, **When** I add an expense of 50.00 in 'Food' category via 'UPI', **Then** it should appear in the monthly list and update the total balance.
2. **Given** an existing expense, **When** I update the amount from 50 to 45, **Then** the updated amount should be persisted and charts should refresh.

---

### User Story 2 - Monthly Dashboard & Budgets (Priority: P1)

As a user, I want to see a visual summary of my monthly spending against my budgets so I can make informed financial decisions.

**Why this priority**: Essential for the "Tracker" aspect, providing immediate feedback on financial health.

**Independent Test**: Set a budget for a category, add expenses, and verify the dashboard progress bars and donut charts reflect the correct percentages.

**Acceptance Scenarios**:

1. **Given** a 1000 'Food' budget, **When** I add a 850 expense, **Then** the budget progress bar should show a visual warning (80%+ threshold).
2. **Given** multiple expenses in different categories, **When** I view the dashboard, **Then** the donut chart should show the correct distribution percentage for each category.

---

### User Story 3 - Data Portability & Offline Use (Priority: P2)

As a user, I want my data to stay local and be exportable so I have full control over my financial information.

**Why this priority**: Aligns with the "Privacy & Local-First" core principle of the constitution.

**Independent Test**: Add data while offline (simulated), refresh the page, and verify data persists. Export to CSV and verify all fields are present in the file.

**Acceptance Scenarios**:

1. **Given** no internet connection, **When** I add a transaction, **Then** it should be saved to the local SQLite database.
2. **Given** recorded data, **When** I trigger a CSV export, **Then** a file containing all transactions should be downloaded.

---

### Edge Cases

- **Large Attachments**: Handling base64 receipt photos to ensure they don't exceed browser storage limits or degrade performance.
- **Recurring Collision**: Ensuring recurring expenses scheduled for the 31st are handled correctly for shorter months (e.g., February).
- **Import Conflicts**: Handling duplicate transactions or malformed rows during CSV import.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support CRUD operations for Expenses (Amount, Category, Date, Note, Payment Method: Cash/Card/UPI, Tags, Receipt Attachment).
- **FR-002**: System MUST support recurring expense scheduling (Weekly, Monthly).
- **FR-003**: System MUST provide a Monthly Dashboard with Total Spent, Total Income, and Net Balance.
- **FR-004**: System MUST render interactive charts (Donut for Category spending, Line for Daily trends).
- **FR-005**: System MUST allow setting Monthly Budgets per category with visual alerts at 80% usage.
- **FR-006**: System MUST persist all data locally using SQLite (WASM) with auto-save/sync to local storage.
- **FR-007**: System MUST support CSV/JSON Export and CSV Import.
- **FR-008**: UI MUST support Dark/Light mode toggle and be fully mobile responsive.

### Key Entities *(include if feature involves data)*

- **Expense**: ID, Amount (Integer Cents), CategoryID, Date, Note, PaymentMethod, Tags (Array), Receipt (Base64), RecurringID (Optional).
- **Category**: ID, Name, Icon, Color, MonthlyBudget (Integer Cents).
- **BudgetHistory**: Month/Year, CategoryID, BudgetAmount, ActualSpent.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new expense in under 5 seconds from the dashboard.
- **SC-002**: All charts and dashboard metrics update in under 200ms after data entry.
- **SC-003**: System maintains 100% data integrity during offline sessions (verified via refresh).
- **SC-004**: CSV Export generates a valid file containing 100% of recorded transactions.

## Assumptions

- **Local Storage Limit**: Assumed that browser-based storage (IndexedDB/LocalStorage) is sufficient for several years of text-based financial data; receipt photos will be limited in resolution to manage space.
- **Currency**: Single currency support is assumed for the baseline; multi-currency is out of scope.
- **Receipt Storage**: Base64 storage is used for simplicity in v1, acknowledging potential performance impacts for very large numbers of receipts.
