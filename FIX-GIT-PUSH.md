# Fix Git Push Error - Step by Step

## The Problem
- Your local branch is `master`
- You tried to push to `main` branch
- Your remote URL is a placeholder

## Solution

### Step 1: Update Remote URL

Replace `YOUR-ACTUAL-USERNAME` and `YOUR-ACTUAL-REPO-NAME` with your real GitHub username and repository name:

```bash
git remote set-url origin https://github.com/YOUR-ACTUAL-USERNAME/YOUR-ACTUAL-REPO-NAME.git
```

**Example:**
If your GitHub username is `preston10` and repo is `14tugi-website`:
```bash
git remote set-url origin https://github.com/preston10/14tugi-website.git
```

### Step 2: Rename Branch to `main` (Recommended)

Since GitHub now defaults to `main`, let's rename your branch:

```bash
# Rename master to main
git branch -M main

# Push to main branch
git push -u origin main
```

### Alternative: Push to `master` Instead

If you prefer to keep `master`:

```bash
git push -u origin master
```

---

## Quick Commands (Copy & Paste)

**After updating the remote URL, run:**

```bash
git branch -M main
git push -u origin main
```

---

## Need Help?

1. **Find your GitHub repo URL:**
   - Go to your GitHub repository
   - Click the green "Code" button
   - Copy the HTTPS URL

2. **Check your current remote:**
   ```bash
   git remote -v
   ```

