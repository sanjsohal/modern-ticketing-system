# Utility Functions

## Date Utilities (`dateUtils.ts`)

Centralized date parsing and formatting utilities to handle dates consistently across the application.

### Why Use This?

- **Handles API date formats**: Properly parses ISO 8601 timestamps with microseconds (e.g., `2025-10-21T15:00:53.757832`)
- **Safe error handling**: Never crashes on invalid dates, returns fallback values
- **Consistent formatting**: Use predefined formats across the entire app
- **Type-safe**: Full TypeScript support with proper types

### Basic Usage

```typescript
import { formatDate, DateFormats } from '../utils/dateUtils';

// Simple usage with default format (dd MMM yyyy, hh:mm a)
formatDate(ticket.updatedAt) // "21 Oct 2025, 03:00 PM"

// Custom format string
formatDate(ticket.createdAt, 'MMM d, yyyy h:mm a') // "Oct 21, 2025 3:00 PM"

// Using predefined format constants
formatDate(article.updatedAt, DateFormats.LONG_DATE) // "October 21, 2025"
formatDate(notification.createdAt, DateFormats.TIME_ONLY) // "03:00 PM"

// Custom fallback for invalid dates
formatDate(invalidDate, DateFormats.DATE_ONLY, 'N/A') // "N/A"
```

### Available Functions

#### `formatDate(dateValue, formatString?, fallback?)`
Main formatting function that handles any date value safely.

**Parameters:**
- `dateValue`: `string | Date | number | null | undefined` - The date to format
- `formatString`: `string` (optional) - Format pattern, default: `'dd MMM yyyy, hh:mm a'`
- `fallback`: `string` (optional) - Text to show for invalid dates, default: `'Invalid date'`

**Returns:** Formatted date string or fallback

#### `parseDate(dateValue)`
Parse any date value into a Date object or null.

**Parameters:**
- `dateValue`: `string | Date | number | null | undefined`

**Returns:** `Date | null`

### Predefined Format Constants

Use `DateFormats` for consistent formatting across the app:

```typescript
DateFormats.FULL_DATETIME    // "21 Oct 2025, 03:00 PM"
DateFormats.DATE_ONLY        // "21 Oct 2025"
DateFormats.TIME_ONLY        // "03:00 PM"
DateFormats.SHORT_DATE       // "21/10/2025"
DateFormats.ISO_DATE         // "2025-10-21"
DateFormats.LONG_DATE        // "October 21, 2025"
DateFormats.SHORT_MONTH_DAY  // "Oct 21"
DateFormats.DATETIME_24H     // "21 Oct 2025, 15:00"
```

### Examples

```typescript
// Format ticket timestamps
<td>{formatDate(ticket.updatedAt)}</td>

// Format with custom format
<span>{formatDate(ticket.createdAt, 'MMM d, yyyy h:mm a')}</span>

// Format with preset
<p>Last updated: {formatDate(article.updatedAt, DateFormats.LONG_DATE)}</p>

// Show time only in notifications
<span>{formatDate(notification.createdAt, DateFormats.TIME_ONLY)}</span>

// Handle potentially null dates
<p>{formatDate(user.lastLogin, DateFormats.FULL_DATETIME, 'Never')}</p>
```

### Migration from `date-fns`

**Before:**
```typescript
import { format } from 'date-fns';

{format(ticket.updatedAt, 'dd MMM yyyy, hh:mm a')} // May crash on invalid dates
```

**After:**
```typescript
import { formatDate } from '../../utils/dateUtils';

{formatDate(ticket.updatedAt)} // Safe, never crashes
```

### Error Handling

The utility automatically handles:
- Invalid date strings
- Null or undefined values
- Malformed timestamps
- Timezone issues

All errors are logged to console for debugging while displaying a fallback to the user.
