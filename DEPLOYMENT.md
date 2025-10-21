# Deployment Guide - Vercel

## Setting Up Environment Variables in Vercel

⚠️ **CRITICAL:** Vercel **does not** automatically use `.env.production` from your repository. 

If you have a `.env.production` file committed to your repository, Vercel will use those values instead of the ones configured in the dashboard. This is why `.env.production` must be:
- Added to `.gitignore`
- Removed from Git tracking
- Never committed to your repository

You must configure environment variables directly in the Vercel dashboard for them to be used in production.

### Step-by-Step Setup

1. **Go to your Vercel project dashboard**
   - Navigate to your project
   - Click on "Settings" tab
   - Select "Environment Variables" from the sidebar

2. **Add each environment variable**:

   **⚠️ CRITICAL**: All variables must be added. Missing variables will cause failures.
   
   See `VERCEL_ENV_CHECKLIST.md` for a complete interactive checklist.

   **Required Firebase Variables:**
   ```
   VITE_FIREBASE_API_KEY = your-production-api-key
   VITE_FIREBASE_AUTH_DOMAIN = your-production-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = your-production-project-id
   VITE_FIREBASE_STORAGE_BUCKET = your-production-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID = your-production-sender-id
   VITE_FIREBASE_APP_ID = your-production-app-id
   ```

   **Required API Variables:**
   ```
   VITE_API_URL = https://api.yourproduction.com
   ```
   **⚠️ If VITE_API_URL is not set, the app will default to `http://localhost:3000` and fail in production!**

   **Optional but Recommended:**
   ```
   VITE_FIREBASE_MEASUREMENT_ID = G-YYYYYYYYYY
   VITE_ENV = production
   VITE_ENABLE_DEBUG = false
   VITE_ENABLE_ANALYTICS = true
   VITE_IDLE_TIMEOUT = 15
   VITE_IDLE_WARNING_TIME = 1
   ```

3. **Set environment scope**:
   - **Production**: Used for production deployments (main branch)
   - **Preview**: Used for preview deployments (PRs, other branches)
   - **Development**: Used for local `vercel dev` command

   **Recommendation**: Add variables to both "Production" and "Preview" initially.

4. **Save and redeploy**:
   - After adding variables, trigger a new deployment
   - Or push a new commit to automatically deploy

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Import your repository in Vercel dashboard
2. Connect your GitHub account
3. Select the repository
4. Configure build settings (should auto-detect Vite)
5. Add environment variables as described above
6. Deploy!

## Environment Variable Security

### Best Practices:

1. **Never commit `.env.production` to Git** (it's already in `.gitignore`)
2. **Use different Firebase projects** for staging and production
3. **Rotate sensitive credentials** regularly
4. **Limit access** to Vercel project settings

### Sensitive Variables:
- Store API keys and secrets only in Vercel dashboard
- Use Vercel's encrypted environment variables
- Enable "Sensitive" toggle for confidential values (hides them in UI)

## Vercel Build Configuration

The `vercel.json` file is configured with:
- Build command: `npm run build`
- Framework detection: Vite
- SPA routing support (all routes → index.html)

## Automatic Deployments

Once connected to GitHub, Vercel will:
- ✅ Deploy `main` branch to **production**
- ✅ Deploy PRs and other branches as **preview** deployments
- ✅ Run builds on every push
- ✅ Provide unique URLs for each deployment

## Testing Before Production

1. **Test locally with production build**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Use Vercel preview deployments**:
   - Push to a feature branch
   - Vercel creates a preview URL
   - Test thoroughly before merging to main

## Troubleshooting

### Build Fails on Vercel

**Check environment variables:**
```bash
# In Vercel dashboard, ensure all VITE_* variables are set
# Variables must start with VITE_ to be accessible in the app
```

**Check build logs:**
- Vercel provides detailed logs in the deployment view
- Look for missing dependencies or configuration errors

### Environment Variables Not Working

1. Verify variables start with `VITE_` prefix
2. Check they're assigned to the correct environment (Production/Preview)
3. Redeploy after adding/changing variables
4. Clear Vercel cache if needed (in project settings)

### Firebase Connection Issues

- Ensure Firebase project allows your Vercel domain
- Check Firebase console → Authentication → Settings → Authorized domains
- Add your Vercel domain (e.g., `your-app.vercel.app`)

## Monitoring & Analytics

After deployment:
- ✅ Check Vercel Analytics for performance metrics
- ✅ Monitor Firebase console for authentication/database activity
- ✅ Enable VITE_ENABLE_ANALYTICS=true for production

## Custom Domain Setup

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update Firebase authorized domains

## Rollback Strategy

Vercel keeps deployment history:
1. Go to Deployments tab
2. Find a previous successful deployment
3. Click "Promote to Production" to rollback

## Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Vercel + Vite Guide](https://vercel.com/docs/frameworks/vite)
- [Firebase Hosting Authorization](https://firebase.google.com/docs/auth/web/redirect-best-practices)
