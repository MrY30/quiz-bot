# Deploying the CCNA Quiz Web App to GitHub Pages

This guide walks you through deploying your modern, frontend-only CCNA Quiz Web Application to GitHub Pages so you can access it from anywhere!

Since this project was built with Vite, the easiest and most robust way to deploy to GitHub Pages is by using **GitHub Actions**. This automatically builds your project every time you push changes to your repository.

## Step 1: Update your Vite Config

Because your repository name is likely `quiz-bot`, you need to tell Vite to serve assets from that sub-path on GitHub Pages.

Open `vite.config.ts` and add a `base` property that matches your repository name:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Replace '/quiz-bot/' with your actual repository name if different
  base: '/quiz-bot/', 
})
```

## Step 2: Push your code to GitHub

If you haven't already, make sure your code is committed and pushed to your GitHub repository.

```bash
git add .
git commit -m "Complete CCNA quiz application"
git push origin main
```

## Step 3: Set up GitHub Actions for Deployment

GitHub Actions can automatically run `npm run build` and publish the generated `dist` folder to GitHub Pages.

1. Inside your project, create the following directory structure: `.github/workflows/`
2. Create a file named `deploy.yml` inside that folder (`.github/workflows/deploy.yml`).
3. Paste the following configuration into `deploy.yml`:

```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload entire repository
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step 4: Configure GitHub Pages Settings in your Repository

1. Go to your repository on **GitHub.com**.
2. Click on the **Settings** tab.
3. In the left sidebar, click on **Pages**.
4. Under the **Build and deployment** section, look for the **Source** dropdown.
5. Change it from "Deploy from a branch" to **GitHub Actions**.

## Step 5: Commit and Push the Workflow

Commit the new `deploy.yml` file and `vite.config.ts` change, and push them to your repository:

```bash
git add vite.config.ts .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

## Step 6: Watch the Magic Happen!

1. Go to the **Actions** tab in your GitHub repository.
2. You will see your deployment workflow running.
3. Once it completes successfully (turns green), your site will be live!
4. The link to your live quiz app will be provided in the workflow summary, usually looking like:
   `https://<your-username>.github.io/quiz-bot/`

---

**Tip**: From now on, anytime you modify the JSON files to add more questions or update the UI, simply commit and push your changes to the `main` branch. GitHub Actions will automatically rebuild and redeploy your updated app!
