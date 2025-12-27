# Quick Fix: Remove .env File

## Immediate Steps

### 1. If you deployed to GitHub:

```bash
# Initialize Git (if not done)
git init

# Remove .env from tracking
git rm --cached .env

# Commit the removal
git commit -m "Remove .env file"

# Push to GitHub
git push origin main
```

### 2. If you deployed directly to hosting (Railway/Render/Vercel):

**Go to your hosting platform and:**
- **Delete the `.env` file** from the file browser (if visible)
- **Set environment variables** in the platform's dashboard instead

### 3. Set Environment Variables on Hosting Platform:

**Railway:**
- Project → Variables → Add:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT` (usually auto-set)

**Render:**
- Service → Environment → Add variables

**Vercel:**
- Project → Settings → Environment Variables

---

## ⚠️ IMPORTANT: Change Your Secrets!

Since `.env` was exposed, change:
1. MongoDB password (in MongoDB Atlas)
2. JWT_SECRET (generate new random string)
3. Update connection string with new password

---

## Verify .env is Ignored

Your `.gitignore` already has `.env` listed, so it won't be committed again.

