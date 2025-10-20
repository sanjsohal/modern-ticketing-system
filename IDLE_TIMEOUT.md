# Idle Timeout / Auto-Logout Feature

## Overview

The application now includes an automatic logout feature that logs users out after a period of inactivity. This enhances security by ensuring that unattended sessions are automatically terminated.

## How It Works

### 1. **Activity Tracking**
The system monitors the following user activities:
- Mouse movements
- Mouse clicks
- Keyboard input
- Scrolling
- Touch events
- Wheel events

### 2. **Timing**
- **Idle Timeout**: Default 15 minutes of inactivity
- **Warning Time**: Users receive a warning 1 minute before auto-logout
- Both durations are configurable via environment variables

### 3. **User Experience Flow**

```
User is active
    ↓
No activity for 14 minutes
    ↓
Warning modal appears (1 minute countdown)
    ↓
User can either:
    ├─→ Click "Stay Logged In" (resets timer)
    └─→ Click "Logout Now" or do nothing (auto-logout after countdown)
```

## Configuration

### Environment Variables

Add these to your `.env.local` or `.env.production`:

```bash
# Idle timeout in minutes (default: 15)
VITE_IDLE_TIMEOUT=15

# Warning time before logout in minutes (default: 1)
VITE_IDLE_WARNING_TIME=1
```

### Adjusting Timeouts

**For Development** (shorter timeouts for testing):
```bash
VITE_IDLE_TIMEOUT=5          # 5 minutes
VITE_IDLE_WARNING_TIME=1      # 1 minute warning
```

**For Production** (standard security):
```bash
VITE_IDLE_TIMEOUT=15         # 15 minutes
VITE_IDLE_WARNING_TIME=2      # 2 minute warning
```

**For High-Security Applications**:
```bash
VITE_IDLE_TIMEOUT=5          # 5 minutes
VITE_IDLE_WARNING_TIME=1      # 1 minute warning
```

**For Internal Tools** (longer sessions):
```bash
VITE_IDLE_TIMEOUT=30         # 30 minutes
VITE_IDLE_WARNING_TIME=2      # 2 minute warning
```

## Features

### ✅ Smart Detection
- Only tracks activity when user is logged in
- Automatically stops tracking after logout
- Throttled to avoid performance impact

### ✅ User-Friendly Warning
- Modal appears with countdown timer
- Clear options to stay logged in or logout
- No data loss - user has time to save work

### ✅ Security Benefits
- Prevents unauthorized access to unattended sessions
- Automatic cleanup of inactive sessions
- Configurable timeouts for different security requirements

### ✅ Performance Optimized
- Events are throttled to once per second
- Minimal CPU usage
- No impact on user experience

## Technical Implementation

### Components Used

1. **`useIdleTimeout` Hook** (`src/hooks/useIdleTimeout.ts`)
   - Custom React hook for idle detection
   - Manages timers and event listeners
   - Triggers callbacks on warning and idle

2. **`IdleWarningModal` Component** (`src/components/ui/IdleWarningModal.tsx`)
   - Warning dialog with countdown
   - Options to continue session or logout
   - Auto-logout when countdown reaches zero

3. **Environment Configuration** (`src/config/env.ts`)
   - Centralized environment variable management
   - Timeout values in milliseconds
   - Type-safe configuration access

### Integration Points

```typescript
// In App.tsx
const { resetTimer } = useIdleTimeout({
  onIdle: handleIdle,           // Auto-logout function
  onWarning: handleWarning,     // Show warning modal
  idleTime: ENV.IDLE_TIMEOUT,   // Main timeout duration
  warningTime: ENV.IDLE_WARNING_TIME, // Warning duration
  enabled: isAuthenticated,     // Only when logged in
});
```

## Testing

### Manual Testing

1. **Test Idle Detection**:
   ```bash
   # Set short timeout for testing
   VITE_IDLE_TIMEOUT=1
   VITE_IDLE_WARNING_TIME=0.5
   
   npm run dev
   ```
   - Login and wait 30 seconds
   - Warning should appear
   - Wait another 30 seconds for auto-logout

2. **Test Activity Reset**:
   - Login and wait for warning
   - Move mouse or click "Stay Logged In"
   - Timer should reset

3. **Test Manual Logout**:
   - Wait for warning modal
   - Click "Logout Now"
   - Should logout immediately

### Automated Testing

```typescript
// Example test
describe('Idle Timeout', () => {
  it('should show warning after idle period', async () => {
    // Arrange
    render(<App />);
    await login();
    
    // Act
    jest.advanceTimersByTime(14 * 60 * 1000); // 14 minutes
    
    // Assert
    expect(screen.getByText(/Are you still there?/i)).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Warning Not Appearing

**Check environment variables**:
```bash
# Verify variables are loaded
console.log(import.meta.env.VITE_IDLE_TIMEOUT);
```

**Restart dev server**:
```bash
# Environment changes require restart
npm run dev
```

### Auto-Logout Too Aggressive

**Increase timeout values**:
```bash
VITE_IDLE_TIMEOUT=30  # Increase to 30 minutes
```

### Performance Issues

The feature is already optimized, but if needed:
- Events are throttled to 1 second
- Only active when user is logged in
- No polling or continuous checks

## Disabling the Feature

To temporarily disable idle timeout:

```typescript
// In App.tsx
const { resetTimer } = useIdleTimeout({
  // ... other options
  enabled: false, // Disable idle detection
});
```

Or remove the integration from `App.tsx` entirely.

## Security Considerations

### Best Practices
✅ Use shorter timeouts for sensitive applications  
✅ Always show warning before auto-logout  
✅ Clear any sensitive data on logout  
✅ Consider implementing server-side session timeout too  

### Compliance
This feature helps meet security requirements for:
- HIPAA (Healthcare)
- PCI DSS (Payment Card Industry)
- SOC 2 (Service Organization Control)
- GDPR (Data Protection)

## Future Enhancements

Potential improvements:
- [ ] Server-side session validation
- [ ] Multiple warning levels
- [ ] User preference for timeout duration
- [ ] Activity logging for security audits
- [ ] Cross-tab synchronization

## Additional Resources

- [OWASP Session Management](https://owasp.org/www-community/Session_Management)
- [Web Security Best Practices](https://web.dev/security-privacy/)
