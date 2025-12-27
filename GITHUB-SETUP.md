# How to Push Code to GitHub - Step by Step

## 📍 Where to Run the Commands

You need to run these commands in a **Terminal/Command Prompt** in your project folder.

---

## 🖥️ Step 1: Open Terminal in Your Project Folder

### **Option A: Using File Explorer (Easiest)**

1. Open **File Explorer**
2. Navigate to: `C:\Users\USER\Documents\14 Tugi`
3. Click in the address bar (or press `Alt + D`)
4. Type: `powershell` and press **Enter**
5. A PowerShell window will open in that folder

### **Option B: Using VS Code (If you use it)**

1. Open VS Code
2. Open your project folder: `C:\Users\USER\Documents\14 Tugi`
3. Press `` Ctrl + ` `` (backtick) to open terminal
4. Terminal will open in the project folder

### **Option C: Using Command Prompt**

1. Press `Windows + R`
2. Type: `cmd` and press Enter
3. Type:
   ```cmd
   cd "C:\Users\USER\Documents\14 Tugi"
   ```
4. Press Enter

---

## 🔧 Step 2: Initialize Git Repository

In the terminal, run these commands **one by one**:

```bash
# 1. Initialize Git repository
git init

# 2. Check status (see what files will be added)
git status
```

---

## 📝 Step 3: Create GitHub Repository

1. Go to https://github.com
2. Log in to your account
3. Click the **"+"** icon (top right) → **"New repository"**
4. Repository name: `14-tugi` (or any name you like)
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**
7. **Copy the repository URL** (you'll need it in the next step)
   - It will look like: `https://github.com/your-username/14-tugi.git`

---

## 🔗 Step 4: Connect Local Repository to GitHub

Back in your terminal, run:

```bash
# Add all files (except those in .gitignore)
git add .

# Check what will be committed (should NOT show .env)
git status

# Commit the files
git commit -m "Initial commit - 14 Tugi website"

# Connect to GitHub (replace with YOUR repository URL)
git remote add origin https://github.com/your-username/14-tugi.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** When you run `git push`, GitHub will ask for your username and password (or token).

---

## 🔐 Step 5: GitHub Authentication

If GitHub asks for credentials:

### **Option A: Personal Access Token (Recommended)**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token"**
3. Name it: `14-tugi-deployment`
4. Select scopes: Check **"repo"** (all repo permissions)
5. Click **"Generate token"**
6. **Copy the token** (you'll only see it once!)
7. When Git asks for password, **paste the token** (not your GitHub password)

### **Option B: GitHub Desktop (Easier)**

1. Download GitHub Desktop: https://desktop.github.com
2. Sign in with GitHub
3. Add your repository
4. Commit and push using the GUI (no command line needed!)

---

## ✅ Step 5: Verify Push

1. Go to your GitHub repository page
2. You should see all your files there
3. **Make sure `.env` is NOT visible** (it should be hidden because of `.gitignore`)

---

## 🚀 Step 6: Deploy to Railway

Now that your code is on GitHub:

1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository (`14-tugi` or whatever you named it)
5. Railway will automatically deploy!

---

## 📋 Quick Command Reference

```bash
# Navigate to project folder
cd "C:\Users\USER\Documents\14 Tugi"

# Initialize Git
git init

# Add files
git add .

# Check status
git status

# Commit
git commit -m "Initial commit"

# Connect to GitHub (replace with your URL)
git remote add origin https://github.com/your-username/your-repo.git

# Push to GitHub
git push -u origin main
```

---

## 🆘 Troubleshooting

### **"fatal: not a git repository"**
- You're not in the project folder
- Run: `cd "C:\Users\USER\Documents\14 Tugi"` first

### **"remote origin already exists"**
- You already connected to GitHub
- Skip the `git remote add origin` command
- Just run: `git push -u origin main`

### **"Authentication failed"**
- Use a Personal Access Token instead of password
- Or use GitHub Desktop for easier authentication

### **".env file is showing in GitHub"**
- Remove it: `git rm --cached .env`
- Commit: `git commit -m "Remove .env file"`
- Push: `git push`

---

## 💡 Pro Tips

1. **Always check `git status`** before committing to see what files will be added
2. **`.env` should NEVER appear** in `git status` (it's in `.gitignore`)
3. **Use meaningful commit messages** like "Add backend API" or "Fix piano styling"
4. **Push regularly** to keep your code backed up on GitHub

---

## 🎯 Summary

1. ✅ Open terminal in project folder
2. ✅ Run `git init`
3. ✅ Create GitHub repository
4. ✅ Run `git add .`
5. ✅ Run `git commit -m "Initial commit"`
6. ✅ Run `git remote add origin <your-github-url>`
7. ✅ Run `git push -u origin main`
8. ✅ Deploy to Railway from GitHub

**You're all set! 🚀**

