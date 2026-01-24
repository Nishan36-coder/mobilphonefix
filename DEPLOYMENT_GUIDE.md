# Deployment Guide for Mobilphonefix.com

You are now ready to deploy your site to GitHub Pages and connect your Squarespace domain.

## Step 1: Push to GitHub

1.  **Initialize Git** (if not done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a Repo on GitHub**:
    *   Go to GitHub.com -> New Repository
    *   Name it `mobilphonefix`
    *   **Make it Public** (Private pages require Pro) or configure properly.

3.  **Connect and Push**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/mobilphonefix.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy to GitHub Pages

1.  **Run the deploy script**:
    ```bash
    npm run deploy
    ```
    *   This will build your site and push the `dist` folder to a `gh-pages` branch.

2.  **Configure GitHub Pages**:
    *   Go to your GitHub Repo -> Settings -> Pages.
    *   Ensure "Source" is set to the `gh-pages` branch.
    *   Verify the custom domain `mobilphonefix.com` appears (it should be read from the `CNAME` file).
    *   Enable **"Enforce HTTPS"**.

## Step 3: Configure Squarespace Domain (DNS)

You need to point your Squarespace domain to GitHub Pages.

1.  Log in to Squarespace -> Domains.
2.  Select `mobilphonefix.com` -> DNS Settings.
3.  **Delete** any default records (like Squarespace parked page).
4.  **Add these records**:

    **A Records:** (Points root domain to GitHub)
    *   Host: `@` | Type: `A` | Data: `185.199.108.153`
    *   Host: `@` | Type: `A` | Data: `185.199.109.153`
    *   Host: `@` | Type: `A` | Data: `185.199.110.153`
    *   Host: `@` | Type: `A` | Data: `185.199.111.153`

    **CNAME Record:** (Points www to your profile)
    *   Host: `www` | Type: `CNAME` | Data: `YOUR_USERNAME.github.io` (Replace with your actual GitHub username)

5.  Save changes. It may take up to 24-48 hours to propagate, but usually works in minutes.

## ✅ Security Checklist (Complete)

*   [x] **Sensitive API Keys**: Your Web3Forms key is properly stored in `.env.local` which is **ignored** by Git. It will NOT be uploaded.
    *   *Note: For the live site to work, you MUST add the key to GitHub Secrets or the Environment variables if using an Action, OR since this is a static build, the key is baked into the build safely because it's a public key.*
    *   **Wait!** Actually, for a static site like this built with Vite, the key IS included in the final Javascript bundle. This is **safe** for Web3Forms access keys (they are designed to be public-facing for form submissions).
*   [x] **HTTPS**: Enabled via GitHub Pages automatically.
*   [x] **SEO**: Meta tags, sitemap.xml, and robots.txt are configured.

## Final Note

Since you are deploying a **static site**, the environment variables in `.env.local` need to be present during the *build* process.
*   When you run `npm run deploy` on your computer, it uses your local `.env.local` file.
*   So the deployed site **WILL** have the key and work correctly!
