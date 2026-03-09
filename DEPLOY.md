# Deploy VerbaFlow to the web (Vercel)

## Option A: Deploy with Vercel (recommended)

### 1. Push your code to GitHub

If you haven’t already:

```bash
cd "/Users/minjicupertino/Desktop/verbaflow 2"
git init
git add .
git commit -m "Initial commit"
```

Your repo is already created: [github.com/mjkong4-sudo/VerbaFlow](https://github.com/mjkong4-sudo/VerbaFlow). Add it as the remote:

```bash
git remote add origin https://github.com/mjkong4-sudo/VerbaFlow.git
git branch -M main
git push -u origin main
```

### 2. Import the project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
2. Click **Add New…** → **Project**.
3. **Import** the GitHub repo you just pushed.
4. Leave **Framework Preset** as Next.js and **Root Directory** as `.`.
5. Before deploying, open **Environment Variables** and add:
   - **Name:** `OPENAI_API_KEY`  
   - **Value:** your OpenAI API key (same as in `.env.local`).
6. Click **Deploy**.

When the build finishes, Vercel will give you a URL like `https://verbaflow-xxx.vercel.app`. That’s your live app.

---

## Option B: Deploy with Vercel CLI (no GitHub)

1. Install Vercel CLI and log in:

   ```bash
   npm i -g vercel
   vercel login
   ```

2. From the project folder:

   ```bash
   cd "/Users/minjicupertino/Desktop/verbaflow 2"
   vercel
   ```

3. Follow the prompts (link to an existing Vercel project or create a new one).
4. Add the API key in the Vercel dashboard:
   - [vercel.com/dashboard](https://vercel.com/dashboard) → your project → **Settings** → **Environment Variables**
   - Add `OPENAI_API_KEY` with your key, then trigger a **Redeploy** so the new variable is used.

---

## After deploy

- Your app will be at a URL like `https://your-project.vercel.app`.
- To use a custom domain: Project → **Settings** → **Domains**.
- To update the site: push to the connected Git branch (Option A) or run `vercel --prod` (Option B).

**Important:** Never commit `.env.local` or your API key. Vercel uses the environment variables you set in the dashboard.
