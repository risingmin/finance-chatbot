# Deployment Guide

This guide covers deploying the Finance Chatbot to production using Vercel (frontend) and Render (backend).

## Prerequisites

1. GitHub account and repository with this code
2. Vercel account (free)
3. Render account (free)
4. OpenAI API key (or another cloud LLM provider)

## Frontend Deployment (Vercel)

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo (`finance-chatbot`)
4. Select "Other" as framework
5. Click "Deploy"

### 3. Configure Build Settings

In Vercel Dashboard:
1. Go to Settings → General
2. Under "Build & Output":
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 4. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

Add:
```
VITE_API_URL = https://your-backend-url.com
```

(Replace `your-backend-url.com` with your Render backend URL after deploying it)

### 5. Redeploy

In Vercel Dashboard → Deployments:
- Click the latest deployment
- Click "Redeploy"

Your frontend is now live! ✅

## Backend Deployment (Render)

### 1. Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Select `finance-chatbot` repo

### 2. Configure Deployment

Fill in the form:
- **Name:** `finance-chatbot-api` (or your choice)
- **Region:** Select closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Choose "Free" (limited) or "Starter" (more reliable)

### 3. Add Environment Variables

In the Render form, scroll to "Environment":

```
PORT=8000
NODE_ENV=production
FRONTEND_ORIGIN=https://your-vercel-frontend.vercel.app
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
```

**Important Notes:**
- Replace `your-vercel-frontend.vercel.app` with your actual Vercel URL
- Get `OPENAI_API_KEY` from [platform.openai.com](https://platform.openai.com/api-keys)
- Make sure this is your production API key, not development

### 4. Deploy

Click "Create Web Service"

Render will build and deploy your backend. Wait 2-3 minutes.

You should see:
```
=== Web Service: finance-chatbot-api ===
Status: Live
```

Copy your backend URL (something like `https://finance-chatbot-api.onrender.com`)

### 5. Update Frontend with Backend URL

Now update Vercel with your Render backend URL:

1. Go to Vercel Dashboard
2. Select your `finance-chatbot` project
3. Settings → Environment Variables
4. Update `VITE_API_URL` to your Render URL
5. Go to Deployments → Redeploy latest

## Testing Production

### Test Backend

```bash
curl https://your-backend-url.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "uptime": "0h 2m",
  "environment": "production",
  "llmProvider": "openai"
}
```

### Test Frontend

Visit your Vercel URL: `https://your-app.vercel.app`

Send a test message. It should work!

## Troubleshooting Deployment

### "Failed to build" on Render

- Check root directory is set to `backend`
- Check build command is `npm install`
- Check all required env vars are set (PORT, LLM_PROVIDER, API keys)

### "CORS error" in frontend

- Check `FRONTEND_ORIGIN` in backend env vars matches your Vercel URL
- The URL must include `https://` and not end with `/`

### "Unable to reach assistant" in frontend

1. Check backend is actually running (visit health endpoint)
2. Check `VITE_API_URL` in Vercel environment variables
3. Wait 30 seconds for Render cold start (free tier)
4. Check backend logs in Render dashboard

### "Invalid API key" error

- Check your OpenAI API key is correct
- Make sure it's not expired or revoked
- Try getting a new key from [platform.openai.com](https://platform.openai.com/api-keys)

## Cost

**Vercel:**
- Free tier: 100GB/month bandwidth (plenty for this app)
- Hobby: $0/month (always on)

**Render:**
- Free tier: ~15 minute auto-sleep after 15 min inactivity (fine for demo)
- Starter: $7/month (always on, recommended for production)

**OpenAI API:**
- Pay per token used
- ~$0.0015 per chat message (estimates, see [pricing](https://openai.com/pricing))
- Set usage limits to avoid surprise bills

## Custom Domain

### For Frontend (Vercel)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel: Settings → Domains
3. Add your domain
4. Follow DNS setup instructions

### For Backend (Render)

Render allows custom domains on paid plans.

For free tier: Use Render's auto-generated URL.

## Monitoring

### Vercel

- Go to Analytics for traffic stats
- Logs available in Deployments

### Render

- Check "Logs" in the Web Service dashboard
- See real-time backend logs

## Auto-Deployment

Both Vercel and Render will auto-deploy when you push to `main` branch:

```bash
git push origin main
# Automatic build and deploy starts within 30 seconds
```

No manual deploys needed after initial setup!

## Next Steps

1. Monitor your usage (especially OpenAI tokens)
2. Add error tracking (Sentry, LogRocket)
3. Consider switching to cheaper LLM for scale
4. Add authentication if making this user-specific
5. Set up email alerts for errors

---

**Need help?** Check the main README.md troubleshooting section.
