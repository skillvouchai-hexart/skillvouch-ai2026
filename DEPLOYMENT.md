# SkillVouch – Deployment Guide

Deploy SkillVouch with the **backend on [Render](https://render.com)** and the **frontend on [Vercel](https://vercel.com)**.

---

## Prerequisites

- GitHub repository with this project pushed (both `backend/` and `frontend/` directories)
- A MySQL 8 database (see options below)
- A [Mistral AI](https://console.mistral.ai/) API key

---

## Step 1 – Set Up MySQL Database

You need a cloud-hosted MySQL 8 database. Recommended free/cheap options:

| Provider | Free Tier | Notes |
|---|---|---|
| [PlanetScale](https://planetscale.com) | Yes | Serverless MySQL, very fast |
| [Railway](https://railway.app) | $5/mo credit | Easy setup |
| [AlwaysData](https://www.alwaysdata.com) | Yes | 100 MB free |
| [Aiven](https://aiven.io) | Yes | MySQL 8 |

Once you have your database, run the schema from `backend/init-db.js` to create all tables:

```bash
cd backend
# Set env vars first, then:
node init-db.js
```

Note your connection details:
- `MYSQL_HOST`
- `MYSQL_PORT` (usually `3306`)
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

---

## Step 2 – Deploy Backend to Render

### 2a. Create a Web Service

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set these settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Health Check Path**: `/health`

> **Tip**: Render will auto-detect `render.yaml` in the `backend/` folder and pre-fill these settings.

### 2b. Set Environment Variables on Render

In Render → your service → **Environment** tab, add:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MISTRAL_API_KEY` | Your Mistral key from console.mistral.ai |
| `MYSQL_HOST` | Your DB host |
| `MYSQL_PORT` | `3306` |
| `MYSQL_USER` | Your DB user |
| `MYSQL_PASSWORD` | Your DB password |
| `MYSQL_DATABASE` | Your DB name |
| `ALLOWED_ORIGIN` | *(leave blank for now, fill in after Vercel deploy)* |
| `LLAMA_API_KEY` | Your OpenRouter key *(optional)* |
| `OPENROUTER_HTTP_REFERER` | Your Vercel URL *(optional)* |
| `OPENROUTER_APP_TITLE` | `SkillVouch AI` *(optional)* |

### 2c. Deploy & Verify

1. Click **Deploy**. Wait for build to complete (~2 min).
2. Visit `https://<your-render-url>/health`
   - ✅ Should return: `{"status":"ok","timestamp":"..."}`
3. Note your Render URL: `https://skillvouch-backend.onrender.com` (example)

---

## Step 3 – Deploy Frontend to Vercel

### 3a. Create a Vercel Project

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite *(auto-detected)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3b. Set Environment Variable on Vercel

In Vercel → your project → **Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | Your Render backend URL (e.g. `https://skillvouch-backend.onrender.com`) |

> ⚠️ **Important**: Do NOT add a trailing slash to `VITE_API_URL`.

### 3c. Deploy & Verify

1. Click **Deploy**. Wait for build (~1-2 min).
2. Visit your Vercel URL (e.g. `https://skillvouch.vercel.app`)
   - ✅ The app should load and the login screen should appear

---

## Step 4 – Configure CORS (Final Step)

Now that you have both URLs:
1. Go back to **Render → your service → Environment**
2. Set `ALLOWED_ORIGIN` to your Vercel URL:
   ```
   https://skillvouch.vercel.app
   ```
   If you have multiple Vercel URLs (preview + production), separate with commas:
   ```
   https://skillvouch.vercel.app,https://skillvouch-git-main.vercel.app
   ```
3. Render will automatically restart the service.

---

## Post-Deploy Checklist

- [ ] `/health` returns `{"status":"ok"}` on Render
- [ ] Frontend loads on Vercel without console errors
- [ ] Can sign up / log in (confirms DB connection)
- [ ] Quiz generation works (confirms Mistral API key)
- [ ] Peer recommendations work (confirms DB queries)
- [ ] `ALLOWED_ORIGIN` is set to correct Vercel domain on Render

---

## Local Development

Local dev works with the Vite proxy — no `VITE_API_URL` needed:

```bash
# Terminal 1 – Backend
cd backend
cp .env.example .env   # fill in your DB credentials & Mistral key
npm install
npm run dev            # runs on http://localhost:3000

# Terminal 2 – Frontend
cd frontend
npm install
npm run dev            # runs on http://localhost:3001 (proxies /api → :3000)
```

---

## Architecture Overview

```
┌─────────────────────────────────┐    ┌──────────────────────────────────┐
│  Frontend (Vercel)              │    │  Backend (Render)                │
│  React + Vite + TypeScript      │───▶│  Express + MySQL + Mistral AI    │
│  https://skillvouch.vercel.app  │    │  https://skillvouch.onrender.com │
└─────────────────────────────────┘    └──────────────────────────────────┘
                                                     │
                                       ┌─────────────▼──────────────┐
                                       │  MySQL Database            │
                                       │  (PlanetScale / Railway)   │
                                       └────────────────────────────┘
```
