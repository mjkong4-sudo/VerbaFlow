# VerbaFlow

Turn rough words into clear, natural expression. Choose tone and context, get multiple rewrites, refine until it fits.

## Setup

1. **API key**  
   Copy `OPENAI_API_KEY` from your **Essay Web App** project (in Downloads: `Essay Web App/.env`) into this project:

   ```bash
   cp "/Users/minjicupertino/Downloads/Essay Web App/.env" .env.local
   ```

   Or create `.env.local` and add:

   ```
   OPENAI_API_KEY=your_key_here
   ```

2. **Install and run**

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy to the web

See **[DEPLOY.md](DEPLOY.md)** for step-by-step instructions to deploy on Vercel (with GitHub or with the Vercel CLI). You’ll add `OPENAI_API_KEY` in the Vercel dashboard so the app works in production.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4
- OpenAI API (GPT-4o-mini)
- Hosting: Vercel
