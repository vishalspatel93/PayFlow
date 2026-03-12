## PayFlow — Payment System Visualizer & Transaction Flow Simulator

**PayFlow** is a portfolio PWA that makes the invisible mechanics of payment systems visible. It is built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, and is designed to be deployed as a static site to **GitHub Pages**.

### Stack

- **Framework**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS v4 + light custom CSS
- **PWA**:
  - `public/manifest.webmanifest`
  - `public/sw.js` (very small app-shell cache)
  - Service worker registration in `src/main.tsx`
- **Hosting**: GitHub Pages via `.github/workflows/deploy.yml`

### GitHub Pages deployment

1. Create a GitHub repository (for example `PayFlow`) and push this project.
2. In the repo, go to **Settings → Pages** and set:
   - **Source**: `GitHub Actions`
3. Ensure the default branch is named `main` and that GitHub Pages is enabled for the repo.
4. On every push to `main`, the workflow in `.github/workflows/deploy.yml` will:
   - Install dependencies
   - Run `npm run build`
   - Publish the `dist/` folder to GitHub Pages

With the current `vite.config.ts` (`base: '/PayFlow/'`), the site will be reachable at:

- `https://<your-username>.github.io/PayFlow/`

If your repository name is different, update the `base` option in `vite.config.ts` to match:

```ts
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

### Future AI explainer integration

The **AI Explainer** (Claude-powered, not yet implemented) is intentionally separated from the static front end:

- The UI includes an “AI explainer (stub)” panel that will eventually call a backend endpoint like:
  - `POST https://<your-ai-backend>/api/explain-flow`
- That backend should be implemented as a small **serverless function** on a platform such as:
  - Vercel Functions
  - Netlify Functions
  - Cloudflare Workers
- The front end should read the endpoint URL from configuration (for example an environment variable like `VITE_AI_API_URL`) so that:
  - The PWA remains a static build, deployable to GitHub Pages.
  - Sensitive Claude API keys are stored only in the backend’s secret store, never in the client bundle.

High level flow for the future AI feature:

1. Front end collects:
   - Selected payment method and step
   - Current transaction amount and chaos/failure context
   - User’s natural language question
2. Front end sends this payload to the serverless backend (`VITE_AI_API_URL`).
3. Backend:
   - Validates and sanitizes input
   - Injects structured payment flow context from the same config model used on the front end
   - Calls Claude with a system prompt describing PayFlow and the specific flow state
   - Streams or returns the answer
4. Front end renders the response in the AI panel, without changing how or where the PWA is hosted.

This separation keeps the **hosting simple and free (GitHub Pages)** while leaving a clean, secure path to add rich AI explanations later.
