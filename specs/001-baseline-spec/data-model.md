# Data Model: ExpTracker Baseline

## Database Schema (SQLite)

### table: `categories`
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (UUID) | Primary Key |
| name | TEXT | Unique name (e.g., Food, Travel) |
| icon | TEXT | Lucide icon identifier |
| color | TEXT | Tailwind color class or Hex code |
| budget_amount | INTEGER | Monthly budget in cents |
| created_at | INTEGER | Epoch timestamp |

### table: `expenses`
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (UUID) | Primary Key |
| amount | INTEGER | Amount in cents |
| type | TEXT | 'expense' or 'income' |
| category_id | TEXT | Foreign Key -> categories.id |
| date | INTEGER | Epoch timestamp of transaction |
| note | TEXT | Optional description |
| payment_method | TEXT | 'cash', 'card', 'upi' |
| receipt_image | TEXT | Base64 encoded image data (Optional) |
| is_recurring | INTEGER | Boolean (0/1) |
| recurring_interval| TEXT | 'weekly', 'monthly' (Optional) |
| created_at | INTEGER | Epoch timestamp of record creation |

### table: `tags`
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (UUID) | Primary Key |
| name | TEXT | Unique tag name |

### table: `expense_tags`
| Column | Type | Description |
|--------|------|-------------|
| expense_id | TEXT | Foreign Key -> expenses.id |
| tag_id | TEXT | Foreign Key -> tags.id |

## Validation Rules
- **Amount**: MUST be a positive integer.
- **Date**: MUST be a valid Unix timestamp.
- **Category**: MUST exist in the `categories` table.
- **Receipt**: MUST be validated for size (max 500KB) and format (JPEG/PNG).

## State Transitions
- **Expense Creation**: Draft -> Validated -> Persisted.
- **Recurring Engine**: On app load, check for pending recurring transactions and auto-generate new `expense` records.
