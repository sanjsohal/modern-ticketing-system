# Environment Configuration Guide

This project uses environment-specific configuration for local development and production deployments.

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your local Firebase credentials** in `.env.local`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Files

### `.env.local` (Local Development)
- Used during local development
- **Not committed to Git** (ignored by `.gitignore`)
- Contains your local Firebase project credentials
- Enables debug mode and disables analytics

### `.env.production` (Production Build)
- Used when building for production
- Contains production Firebase credentials
- Should be managed securely (not committed to Git)
- Disables debug mode and enables analytics

### `.env.example` (Template)
- Template file showing all required environment variables
- **Committed to Git** to help other developers set up their environment
- Contains placeholder values

## Available Scripts

### Development
```bash
npm run dev          # Run with default mode (uses .env.local)
npm run dev:local    # Explicitly use local environment
```

### Production Build
```bash
npm run build        # Build with default mode
npm run build:prod   # Explicitly build for production
```

### Preview
```bash
npm run preview      # Preview production build
npm run preview:prod # Preview with production environment
```

## Environment Variables

### Firebase Configuration
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

### API Configuration
```
VITE_API_URL              # Backend API URL
VITE_ENV                  # Environment name (local/staging/production)
```

### Feature Flags
```
VITE_ENABLE_DEBUG         # Enable debug logging (true/false)
VITE_ENABLE_ANALYTICS     # Enable analytics tracking (true/false)
```

### Idle Timeout / Auto-Logout
```
VITE_IDLE_TIMEOUT         # Minutes before auto-logout (default: 15)
VITE_IDLE_WARNING_TIME    # Warning time in minutes (default: 1)
```

See [IDLE_TIMEOUT.md](./IDLE_TIMEOUT.md) for detailed configuration.

## Using Environment Variables in Code

Import the centralized environment configuration:

```typescript
import { ENV } from './config/env';

// Access environment variables
console.log(ENV.API_URL);
console.log(ENV.FIREBASE.PROJECT_ID);
console.log(ENV.IS_DEV);

// Use feature flags
if (ENV.ENABLE_DEBUG) {
  console.debug('Debug information...');
}
```

## Security Best Practices

1. **Never commit sensitive credentials** to version control
2. Use different Firebase projects for local/staging/production
3. Rotate API keys regularly
4. Use Firebase Security Rules to protect your data
5. In production, consider loading sensitive config from a secure backend

## CI/CD Setup

For production deployments, set environment variables in your CI/CD platform:

### Vercel
**Important:** Vercel does NOT automatically use `.env.production` from your repository!

1. Go to your Vercel project → Settings → Environment Variables
2. Add each `VITE_*` variable manually
3. Set appropriate environment scope (Production/Preview/Development)
4. See `DEPLOYMENT.md` for detailed Vercel setup instructions

### Netlify
Add environment variables in the project dashboard under Settings → Environment Variables.

### GitHub Actions
Add secrets in repository settings and use them in your workflow:
```yaml
- name: Build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    # ... other variables
  run: npm run build:prod
```

## Troubleshooting

### Missing Environment Variables
If you see errors about missing environment variables:
1. Ensure `.env.local` exists and is populated
2. Restart the development server after changing environment files
3. Check that variable names start with `VITE_` (required by Vite)

### Firebase Configuration Errors
- Verify your Firebase credentials are correct
- Ensure you're using the right project (local vs production)
- Check Firebase console for any project configuration issues

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Project Setup](https://firebase.google.com/docs/web/setup)
