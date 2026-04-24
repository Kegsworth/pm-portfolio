# Publishing the PM Toolkit to GitHub + Vercel
### James Tubbs — Step-by-Step Guide

---

## Overview

You have 7 standalone React/Vite apps in your workspace. This guide walks you through:

1. **Creating a GitHub account** (if you don't have one)
2. **Installing Git** on your local machine
3. **Downloading the source files** from Perplexity workspace
4. **Creating the GitHub repo** and pushing the code
5. **Deploying to Vercel** for permanent public URLs
6. **Writing the repo README** (optional but high-value)

Estimated total time: **45–60 minutes** (most of it one-time setup).

---

## Step 1 — Prerequisites

### GitHub Account
If you don't have one: go to [github.com](https://github.com) → Sign up. Use your professional email. Your username will appear on your resume, so choose something clean: `jtubbs`, `james-tubbs`, or similar.

### Git (the tool)
Check if it's already installed. Open **Terminal** (Mac) or **Command Prompt / PowerShell** (Windows) and run:

```bash
git --version
```

If it prints something like `git version 2.x.x` — you're good. If not:
- **Mac**: Run `xcode-select --install` or install from [git-scm.com](https://git-scm.com)
- **Windows**: Download the installer from [git-scm.com](https://git-scm.com/download/win)

### Node.js
Required to run the apps locally. Check:

```bash
node --version
```

Should print `v18` or higher. If not, download from [nodejs.org](https://nodejs.org) (choose the LTS version).

---

## Step 2 — Download Source Files from Perplexity

In your Perplexity Computer workspace, the 7 tool folders are:

| Folder | Tool |
|--------|------|
| `pm-toolkit/` | Landing Page |
| `door-compliance/` | DoorSpec |
| `battle-cards/` | BattleCard |
| `code-tracker/` | CodeTracker |
| `crosswalk/` | CrosswalkDB |
| `pm-studio/` | PM Studio |
| `portfolio-iq/` | PortfolioIQ |
| `command-center/` | PM Command Center |

Ask Perplexity Computer to zip all 7 project folders for download:

> "Please zip all 7 PM toolkit source folders (pm-toolkit, door-compliance, battle-cards, code-tracker, crosswalk, pm-studio, portfolio-iq, command-center) into a single archive for download."

Extract the zip to a folder on your computer. Something like:

```
~/Documents/pm-toolkit-portfolio/
├── pm-toolkit/
├── door-compliance/
├── battle-cards/
├── code-tracker/
├── crosswalk/
├── pm-studio/
├── portfolio-iq/
└── command-center/
```

---

## Step 3 — Set Up the Root Repo

Open Terminal / PowerShell, navigate to your portfolio folder:

```bash
cd ~/Documents/pm-toolkit-portfolio
```

Initialize git:

```bash
git init
```

Create a `.gitignore` file so you don't upload unnecessary build artifacts and dependencies. Run this (Mac/Linux):

```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
Thumbs.db
EOF
```

Or on Windows, create a file called `.gitignore` in the root folder with this content:

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
Thumbs.db
```

---

## Step 4 — Create the GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name**: `pm-toolkit` (or `assa-abloy-pm-suite` if you want to be more descriptive)
   - **Description**: `Seven enterprise-grade PM tools for the automatic door industry — DoorSpec, BattleCard, CodeTracker, CrosswalkDB, PM Studio, PortfolioIQ, PM Command Center`
   - **Visibility**: ✅ **Public**
   - **Do NOT** check "Add a README" — you'll push your own
4. Click **Create repository**

GitHub will show you a page with setup commands. Copy the repo URL — it will look like:
`https://github.com/YOUR-USERNAME/pm-toolkit.git`

---

## Step 5 — Connect Local Folder to GitHub and Push

Back in your terminal (make sure you're in `~/Documents/pm-toolkit-portfolio`):

```bash
# Stage all files
git add .

# Create the first commit
git commit -m "Initial commit — 7 PM toolkit tools"

# Connect to your GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/pm-toolkit.git

# Push to GitHub
git branch -M main
git push -u origin main
```

It will ask for your GitHub username and password. For the password, GitHub now requires a **Personal Access Token** (not your account password):

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Give it a name like "pm-toolkit push"
4. Check the **repo** scope
5. Click **Generate token** — copy it immediately (you won't see it again)
6. Use this token as your "password" when git prompts you

After the push completes, refresh your GitHub repo page — all your files will be there.

---

## Step 6 — Deploy to Vercel (Free Permanent URLs)

Vercel reads directly from your GitHub repo and auto-deploys. Since each subfolder is a separate Vite app, you'll create one Vercel project per tool.

### One-time Vercel setup:
1. Go to [vercel.com](https://vercel.com) → **Sign Up with GitHub** (use your GitHub account)
2. Authorize Vercel to access your repos

### Deploy each tool (repeat for all 7):
1. Click **Add New Project**
2. Find and select your `pm-toolkit` repo
3. Under **Root Directory**, click **Edit** and set it to the tool's subfolder (e.g., `pm-toolkit` for the landing page, `battle-cards` for BattleCard, etc.)
4. Framework: Vercel will auto-detect **Vite**
5. Leave everything else default
6. Click **Deploy**

Vercel gives each deployment a URL like:
- `pm-toolkit-james.vercel.app` → landing page
- `battle-cards-james.vercel.app` → BattleCard
- etc.

You can also set a **custom domain** (e.g., `jamestubbs.dev`) for free if you own one.

### Suggested Vercel project names:

| Tool | Suggested Vercel name |
|------|----------------------|
| Landing Page | `pm-toolkit-james-tubbs` |
| DoorSpec | `doorspec-tubbs` |
| BattleCard | `battlecard-tubbs` |
| CodeTracker | `codetracker-tubbs` |
| CrosswalkDB | `crosswalkdb-tubbs` |
| PM Studio | `pmstudio-tubbs` |
| PortfolioIQ | `portfolioiq-tubbs` |
| PM Command Center | `pm-command-center-tubbs` |

---

## Step 7 — Update Internal Links (Important)

Right now each tool's navigation bar links back to the Perplexity URLs. Once you're on Vercel, you'll want to update those links to your new Vercel URLs.

Ask Perplexity Computer:
> "Update all suite navigation links across all 7 tools to use these Vercel URLs: [paste your new URLs]"

Then re-zip, re-push to GitHub, and Vercel will auto-redeploy from the new commit.

---

## Step 8 — Write the Root README (Highly Recommended)

A strong README is what makes recruiters and hiring managers take the portfolio seriously. Ask Perplexity Computer:

> "Write a professional GitHub README for my PM toolkit portfolio repo — include a hero section, tool descriptions with live links, tech stack, my background, and a 'Why I built this' section."

Drop the result into a `README.md` file at the root of the repo, commit, and push:

```bash
git add README.md
git commit -m "Add portfolio README"
git push
```

---

## What to Put on Your Resume / LinkedIn

Once deployed on Vercel, your entry might look like:

**PM Portfolio — Entrance Systems Toolkit**
*Vite · React · TypeScript · Tailwind CSS*
[github.com/YOUR-USERNAME/pm-toolkit](https://github.com) | [Live Demo](https://pm-toolkit-james-tubbs.vercel.app)

> Seven purpose-built PM tools for the automatic door industry: competitive intelligence platform (14 NA competitors), FL/HVHZ compliance checker with live NOA tracking, standards crosswalk database, SKU rationalization engine, and enterprise NPD platform. Built from 4 years of domain expertise at ASSA ABLOY Entrance Systems.

---

## Quick Reference — Commands You'll Use Again

```bash
# After making changes, push updates to GitHub:
git add .
git commit -m "describe what you changed"
git push

# Vercel auto-deploys from every push — no extra steps needed.
```

---

## Troubleshooting

**`git push` is rejected with "permission denied"**
→ Make sure you're using your Personal Access Token as the password, not your GitHub account password.

**Vercel build fails**
→ Check that the Root Directory is set correctly (e.g., `battle-cards`, not the repo root). The build command should auto-detect as `npm run build` and output directory as `dist/public`.

**Tool loads but navigation links go to old Perplexity URLs**
→ Update the suite nav links as described in Step 7 above.

**`node_modules` folder is huge and GitHub rejects the push**
→ Make sure `.gitignore` is in place and run `git rm -r --cached node_modules` then push again.
