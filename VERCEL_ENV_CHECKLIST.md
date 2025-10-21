# Vercel Environment Variables Checklist

## ⚠️ CRITICAL: How Vercel Handles Environment Variables

**Vercel does NOT automatically read `.env.production` from your repository!**

Environment variables must be set in Vercel's dashboard. During build time, Vercel injects these variables, and Vite embeds them into your JavaScript bundle.

## Required Environment Variables Checklist

Login to your Vercel project and set these variables in:
**Settings → Environment Variables**

### ✅ Required Firebase Variables

- [ ] `VITE_FIREBASE_API_KEY` - Your Firebase API key
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` - `your-project.firebaseapp.com`
- [ ] `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` - `your-project.appspot.com`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- [ ] `VITE_FIREBASE_APP_ID` - Firebase app ID

### ✅ Optional but Recommended

- [ ] `VITE_FIREBASE_MEASUREMENT_ID` - Google Analytics measurement ID (e.g., `G-XXXXXXXXXX`)
- [ ] `VITE_API_URL` - Your backend API URL (e.g., `https://api.yourdomain.com`)
  - **⚠️ If not set, defaults to `http://localhost:3000` which will NOT work in production!**
- [ ] `VITE_ENV` - Environment name (e.g., `production`, `staging`)
- [ ] `VITE_ENABLE_DEBUG` - Set to `false` for production
- [ ] `VITE_ENABLE_ANALYTICS` - Set to `true` for production
- [ ] `VITE_IDLE_TIMEOUT` - Minutes before auto-logout (e.g., `15`)
- [ ] `VITE_IDLE_WARNING_TIME` - Warning time in minutes (e.g., `1`)

## Setting Variables in Vercel

### For Each Variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click "Add New" or "Add"
3. **Name**: Enter the variable name (e.g., `VITE_API_URL`)
4. **Value**: Enter the actual value (e.g., `https://api.yourdomain.com`)
5. **Environments**: Select which environments to apply to:
   - ✅ **Production** (for main branch deployments)
   - ✅ **Preview** (for pull request/branch deployments)
   - ⬜ **Development** (only if using `vercel dev` locally)
6. Click "Save"

### After Adding All Variables:

1. Go to your project's Deployments tab
2. Find the latest deployment
3. Click the "..." menu → "Redeploy"
4. Select "Redeploy with existing Build Cache" or "Redeploy" to trigger a fresh build

## Verification

### Check if Variables Are Set

After redeployment, check your application console (browser DevTools):

```javascript
// The app logs environment config on startup if debug is enabled
// Or you can manually check in console:
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### Build-Time Verification

The project now includes a `verify-env.js` script that runs before each build:
- ✅ Checks all required variables are present
- ⚠️  Warns about missing optional variables
- ❌ Fails the build if required variables are missing

Check your Vercel build logs to see the verification output.

## Common Issues & Solutions

### Issue: "API URL is localhost:3000 in production"

**Cause**: `VITE_API_URL` is not set in Vercel dashboard.

**Solution**: 
1. Add `VITE_API_URL` in Vercel → Settings → Environment Variables
2. Set value to your production API URL (e.g., `https://api.yourdomain.com`)
3. Redeploy

### Issue: "Firebase configuration errors"

**Cause**: Firebase variables are missing or incorrect.

**Solution**:
1. Go to Firebase Console → Project Settings
2. Copy your web app configuration
3. Set each `VITE_FIREBASE_*` variable in Vercel
4. Ensure no typos in variable names or values
5. Redeploy

### Issue: "Changes to environment variables not reflected"

**Cause**: Build cache or browser cache.

**Solution**:
1. Redeploy in Vercel after changing variables
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Check the deployment logs to confirm new values were used

### Issue: "Build succeeds but app shows defaults"

**Cause**: Variable names don't start with `VITE_` prefix.

**Solution**:
- Vite only exposes variables starting with `VITE_`
- Rename variables to include the prefix (e.g., `API_URL` → `VITE_API_URL`)
- Update code to use the new variable names
- Redeploy

## Security Best Practices

1. **Mark Sensitive Variables**: Use the "Sensitive" toggle in Vercel for API keys
2. **Different Projects**: Use separate Firebase projects for development/staging/production
3. **Rotate Keys**: Regularly rotate Firebase API keys and other credentials
4. **Limit Scope**: Set variables only for environments that need them
5. **Never Commit**: Ensure `.env.production` is in `.gitignore` and never committed

## Example Configuration

Here's a complete example for production:

```
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=my-prod-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-prod-app
VITE_FIREBASE_STORAGE_BUCKET=my-prod-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXX
VITE_API_URL=https://api.myapp.com
VITE_ENV=production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
VITE_IDLE_TIMEOUT=15
VITE_IDLE_WARNING_TIME=1
```

## Need Help?

- 📖 [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- 📖 [Vite Environment Variables Docs](https://vitejs.dev/guide/env-and-mode.html)
- 📁 See `DEPLOYMENT.md` for full deployment guide
- 📁 See `ENVIRONMENT_SETUP.md` for local development setup
