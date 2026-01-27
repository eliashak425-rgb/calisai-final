# CalisAI Deployment Guide

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Turso Account** (for database) - Sign up at [turso.tech](https://turso.tech) (free tier available)

## Step 1: Set Up Turso Database

Turso is a hosted SQLite-compatible database that works with Vercel.

### Create Database

```bash
# Install Turso CLI
# Windows (PowerShell)
irm https://get.turso.tech/install.ps1 | iex

# Mac/Linux
curl -sSfL https://get.turso.tech/install.sh | bash

# Login to Turso
turso auth login

# Create a database
turso db create calisai-production

# Get the database URL
turso db show calisai-production --url

# Create an auth token
turso db tokens create calisai-production
```

### Update Environment Variables

Your `DATABASE_URL` for Turso will look like:
```
libsql://[database-name]-[username].turso.io?authToken=[your-token]
```

## Step 2: Push to GitHub

```bash
# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment"

# Create GitHub repo and push
# (Create repo on github.com first, then:)
git remote add origin https://github.com/YOUR_USERNAME/calisai.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `calisai` (if your code is in a subdirectory)

### Environment Variables

Add these in Vercel's project settings → Environment Variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `libsql://...` | Your Turso database URL with auth token |
| `NEXTAUTH_SECRET` | `your-secret-here` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel domain |
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |
| `GOOGLE_CLIENT_ID` | `...` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `...` | From Google Cloud Console |

### Google OAuth Setup for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to APIs & Services → Credentials
4. Edit your OAuth 2.0 Client ID
5. Add authorized redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

## Step 4: Run Database Migrations

After first deployment, you need to push the schema to Turso:

```bash
# Update your local .env to use Turso URL temporarily
# Then run:
npx prisma db push

# Seed the exercises (optional but recommended)
npx tsx prisma/seed.ts

# Seed the templates
npx tsx prisma/seedTemplates.ts
```

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Test the assessment flow
3. Test Google sign-in
4. Verify plan generation works

## Troubleshooting

### "Database connection failed"
- Check your `DATABASE_URL` is correct
- Ensure the auth token is included
- Verify Turso database is active

### "Google sign-in not working"
- Verify redirect URIs are correct in Google Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

### "OpenAI generation failed"
- Verify `OPENAI_API_KEY` is set and valid
- Check you have API credits

## Local Development with Turso

To develop locally with your production database:

```bash
# Create a .env.local file
DATABASE_URL="libsql://your-db.turso.io?authToken=your-token"
```

Or continue using local SQLite for development:

```bash
# .env.local for local dev
DATABASE_URL="file:./dev.db"
```

## Production Checklist

- [ ] Turso database created and seeded
- [ ] All environment variables set in Vercel
- [ ] Google OAuth redirect URI updated
- [ ] Domain configured (optional)
- [ ] Test complete user flow

---

## Quick Deploy Commands

```bash
# One-time setup after Vercel deploy
npx prisma db push
npx tsx prisma/seed.ts
npx tsx prisma/seedTemplates.ts
```

## Support

If you encounter issues, check:
1. Vercel deployment logs
2. Browser console for client errors
3. Turso dashboard for database metrics

