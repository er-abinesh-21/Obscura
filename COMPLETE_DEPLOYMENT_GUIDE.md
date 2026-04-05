# Complete Step-by-Step Vercel Deployment Guide for Obscura

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] GitHub account created
- [ ] Vercel account created (sign up at vercel.com)
- [ ] Git installed on your computer
- [ ] All project files in the `obscura` folder
- [ ] Firebase project is active and configured

---

## PART 1: PREPARE YOUR PROJECT

### Step 1: Create .gitignore File

1. Open your project folder: `C:\Users\76bab\Downloads\My Projects\obscura`
2. Check if `.gitignore` file exists
3. If it doesn't exist, create it with this content:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env.vercel

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### Step 2: Verify package.json

1. Open `package.json` in your project
2. Ensure it has these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

3. If missing, add them

---

## PART 2: PUSH TO GITHUB

### Step 3: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon in top-right corner
3. Click **"New repository"**
4. Fill in the details:
   - **Repository name**: `obscura` (or any name you prefer)
   - **Description**: `Secure vault application with end-to-end encryption`
   - **Visibility**: Choose **Private** (recommended) or Public
   - **DO NOT** check "Initialize this repository with a README"
   - **DO NOT** add .gitignore or license (we already have .gitignore)
5. Click **"Create repository"**
6. **KEEP THIS PAGE OPEN** - you'll need the repository URL

### Step 4: Initialize Git in Your Project

1. Open **Command Prompt** (Windows) or **Terminal**
2. Navigate to your project folder:
   ```cmd
   cd C:\Users\76bab\Downloads\My Projects\obscura
   ```
3. Initialize Git:
   ```cmd
   git init
   ```
   - You should see: `Initialized empty Git repository`

### Step 5: Configure Git (First Time Only)

If you haven't configured Git before:

```cmd
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

### Step 6: Add All Files to Git

```cmd
git add .
```

This adds all files except those in .gitignore.

### Step 7: Create First Commit

```cmd
git commit -m "Initial commit - Obscura vault application"
```

You should see a summary of files committed.

### Step 8: Rename Branch to Main

```cmd
git branch -M main
```

### Step 9: Connect to GitHub Repository

1. Go back to your GitHub repository page
2. Copy the repository URL (it looks like: `https://github.com/YOUR_USERNAME/obscura.git`)
3. In Command Prompt, run:
   ```cmd
   git remote add origin https://github.com/YOUR_USERNAME/obscura.git
   ```
   Replace with your actual repository URL

### Step 10: Push to GitHub

```cmd
git push -u origin main
```

- If prompted, enter your GitHub username and password
- **Note**: GitHub now requires a Personal Access Token instead of password
  - If you don't have one, go to: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - Give it `repo` permissions
  - Copy the token and use it as your password

**VERIFY**: Refresh your GitHub repository page - you should see all your files uploaded.

---

## PART 3: DEPLOY TO VERCEL

### Step 11: Sign Up / Log In to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** (or "Log In" if you have an account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. You'll be redirected to Vercel dashboard

### Step 12: Import Your Project

1. On Vercel dashboard, click **"Add New..."** button (top-right)
2. Select **"Project"** from dropdown
3. You'll see "Import Git Repository" page
4. Find your `obscura` repository in the list
   - If you don't see it, click **"Adjust GitHub App Permissions"**
   - Select your repository and grant access
5. Click **"Import"** button next to your `obscura` repository

### Step 13: Configure Project Settings

You'll see "Configure Project" page:

1. **Project Name**: Leave as `obscura` (or change if you want)
2. **Framework Preset**: Should auto-detect as **"Next.js"** (if not, select it)
3. **Root Directory**: Leave as `./` (default)
4. **Build and Output Settings**: Leave defaults
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

**DO NOT CLICK DEPLOY YET!**

### Step 14: Add Environment Variables (CRITICAL STEP)

1. On the same "Configure Project" page, scroll down to **"Environment Variables"** section
2. **DO NOT** click "Import .env" or upload any file
3. We'll add each variable manually

#### Add Variable 1: NEXT_PUBLIC_FIREBASE_API_KEY

1. In the **"Key"** field, type: `NEXT_PUBLIC_FIREBASE_API_KEY`
2. In the **"Value"** field, paste: `AIzaSyAGqtKBqd5RFXlkUNX-MC3O28VzreWslvg`
3. Leave all three checkboxes checked:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Click **"Add"** button

#### Add Variable 2: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

1. In the **"Key"** field, type: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
2. In the **"Value"** field, paste: `obscura-23926.firebaseapp.com`
3. Keep all three checkboxes checked
4. Click **"Add"**

#### Add Variable 3: NEXT_PUBLIC_FIREBASE_PROJECT_ID

1. **Key**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
2. **Value**: `obscura-23926`
3. Keep all checkboxes checked
4. Click **"Add"**

#### Add Variable 4: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

1. **Key**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
2. **Value**: `obscura-23926.firebasestorage.app`
3. Keep all checkboxes checked
4. Click **"Add"**

#### Add Variable 5: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

1. **Key**: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
2. **Value**: `861104204973`
3. Keep all checkboxes checked
4. Click **"Add"**

#### Add Variable 6: NEXT_PUBLIC_FIREBASE_APP_ID

1. **Key**: `NEXT_PUBLIC_FIREBASE_APP_ID`
2. **Value**: `1:861104204973:web:def2b6b20621940a14aa24`
3. Keep all checkboxes checked
4. Click **"Add"**

#### Add Variable 7: FIREBASE_PROJECT_ID

1. **Key**: `FIREBASE_PROJECT_ID`
2. **Value**: `obscura-23926`
3. Keep all checkboxes checked
4. Click **"Add"**

#### Add Variable 8: FIREBASE_CLIENT_EMAIL

1. **Key**: `FIREBASE_CLIENT_EMAIL`
2. **Value**: `firebase-adminsdk-fbsvc@obscura-23926.iam.gserviceaccount.com`
3. Keep all checkboxes checked
4. Click **"Add"**

#### Add Variable 9: FIREBASE_PRIVATE_KEY (MOST IMPORTANT)

**CRITICAL**: This is the most important variable. Follow these instructions EXACTLY:

1. **Key**: `FIREBASE_PRIVATE_KEY`
2. **Value**: Copy this ENTIRE text (including \n characters):

```
-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAe4mCMYtVukJD\ndzF492bpwWv9zwt3ilKEERKztKxrOfsQG2JpOGKK6ktw0LW1q5a+lxshu4mIbgAo\nyPnbTEKJ+/nT4DoIn69IsKcHGBQxyxsrF2xDBM5LzqZ2eUHR7dvzM8v3jS7K5gG3\ng0WE+5KxJO67toq5CtGuvCOQHdUlDB7HQhmrgkzZrGkf3NAUuBwyyc5N8E+oJ+8d\nbH9qY7YeRx9ekUCl0Nqena9x4zQ0/9SqsyiW2/JfZWjjavXJ0+xyVe4EE6CIEHWJ\nnK1nJjpHWkbqwd87jdxEntcZOkM4HKpDMAVo87WhDwQFqiYil+kTUOw5uNdILy4U\nmDPvahzJAgMBAAECggEARjlL88nrkb1Ai6iizgVE8Kd2pMSy5Ev8yt4HurSB6yTe\nKgQzpTvDB/duypv6j2sotiQe6/GlvbaULE0WiyGJbRoXDWvTAG5x3s1EQtxQEdKN\n+Oy0vMa2FQYxySt4DgT/p/0PvyMtHS1JFxC3fkriO+rDhoyUk+oUkfFl8CBSMQ9W\nJXkdWoTo/B4gqQgz9apPXYDvMMZg7DVLLDP87wLF4tV+MgLTHN1mDxRpBcnjuSJU\nginMNifAhglQZOV3lOqYh9OnF2NfzoX/pyDeHEVJ4QPU/Y7dF42dWF/Bg7M2lOR7\ntAV12uVyvFUFdDb4Ea4+SUxQ/Pfz81Axr1y+65ae+QKBgQD1ns6Mzesr6agMHlYV\nJfl8DuIvix67FTB/7XEQX5/kmHLTGbowPJZC0m9O9tJZgRdLzfoWv/AkJ36paV0n\n0V5fvYtLGsl5TWGKxyjriWV/eKG0dZUgfI13EBWsQWNh/gzXKW2zqqZNDdHIeYeU\nUBOE6eIpHBSg1UuVzLnFy46W1wKBgQDInd7H6Cp1tAEOqZe41eFpYzi/vboSSYlw\nadRR/pVtSi10ChH2Aui3/6IS2qr+sCkOxx0Ay3cYDgoY5doFcvxwpltXAp30Ero+\nMko+kSmnqRQzc7LlAf9LKpaNVItqRd7o1H6yRa/UWjIkg7cG/aQP9+V/ad0pwiOs\n17MbgFOVXwKBgQCjD06og3wApxn9EZasa415IpheX8mDAco043kQGauYoux34LiO\nlWpb6kAi+BElgmHo3VGOENZn6iBYb658ZK52eOskbSAb+5cp/pXX6FsNiRQxLW5X\nJtjzliYNOUu1Hmd/3+0IPd4xgV8n7CZp+885iduu1wmKzI9lX4hlG4IJ+QKBgAQL\n+zR5IHIjYWoUTbUyy0s+7yQfBaPcy+Lyn4/P3N/JgUU39sjJojwj8fcDZjOhBhMA\nPTuI3ywjDF0YNd+qRCFZmboVmW4U+qDKjujYMMjrBjdLfC5WbfnsMAFF1VIderOj\npbKe6T8VWrGV3plLgIW58G0zi3yOJ/4Sk9BYNFdtAoGBAPB6xWoIJsc22N5zS8d2\nCg6+nh6nuhsue9DyODP7DTsXKzB5G85aDw/lDeJWmLFb0cZqDpH7TWL9JcQoSSmZ\nGh2gnTDQNtv+conSk6dT6MHbJ2gfXk34AgvwmI2TaKlu8WaybIAxwXP2XiDMJdk/\nzY+fwYmAuvjwY3a/1vtgMyY3\n-----END PRIVATE KEY-----\n
```

**IMPORTANT NOTES:**
- Do NOT add quotes `"` at the beginning or end
- Do NOT remove the `\n` characters (they must stay as literal \n)
- Copy the ENTIRE string including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- The value should be ONE LONG LINE with \n characters in it

3. Keep all checkboxes checked
4. Click **"Add"**

### Step 15: Verify All Environment Variables

Before deploying, verify you have added ALL 9 variables:

1. ✅ NEXT_PUBLIC_FIREBASE_API_KEY
2. ✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
3. ✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
4. ✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
5. ✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
6. ✅ NEXT_PUBLIC_FIREBASE_APP_ID
7. ✅ FIREBASE_PROJECT_ID
8. ✅ FIREBASE_CLIENT_EMAIL
9. ✅ FIREBASE_PRIVATE_KEY

You should see all 9 variables listed in the Environment Variables section.

### Step 16: Deploy Your Application

1. Scroll to the bottom of the page
2. Click the big blue **"Deploy"** button
3. Vercel will now:
   - Clone your repository
   - Install dependencies (npm install)
   - Build your Next.js application (next build)
   - Deploy to production

**This will take 2-5 minutes.**

### Step 17: Monitor the Build Process

1. You'll see a build log screen with real-time output
2. Watch for these stages:
   - ✅ Cloning repository
   - ✅ Installing dependencies
   - ✅ Building application
   - ✅ Deploying

**If you see errors:**
- Read the error message carefully
- Most common error: "Invalid private key" - means FIREBASE_PRIVATE_KEY is wrong
- Go to Step 18 (Troubleshooting) below

**If successful:**
- You'll see "🎉 Congratulations!" or similar success message
- Continue to Step 19

---

## PART 4: VERIFY DEPLOYMENT

### Step 18: Access Your Deployed Application

1. After successful deployment, you'll see a preview image of your site
2. Click the **"Visit"** button or the preview image
3. Your application will open in a new tab
4. The URL will be something like: `https://obscura-xxxxx.vercel.app`

### Step 19: Test Your Application

#### Test 1: Homepage Loads
1. Verify the login page appears
2. Check that the theme toggle button is visible (top-right)
3. Try switching between light and dark themes

#### Test 2: Sign Up
1. Click "Create account" button
2. Enter a test email: `test@example.com`
3. Enter a password: `testpassword123`
4. Enter a master password: `masterpass123`
5. Click "Create Account"
6. You should be redirected to the dashboard

#### Test 3: Create Vault Item
1. Click "New Item" button
2. Fill in the form:
   - Title: `Test API Key`
   - Type: `API Keys`
   - Key: `test-key`
   - Value: `test-value-12345`
3. Click "Save"
4. Verify the item appears in your vault

#### Test 4: Logout and Login
1. Click "Sign Out"
2. Log in with the same credentials
3. Enter your master password on the unlock screen
4. Verify your vault item is still there

#### Test 5: Responsive Design
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)

**If all tests pass: ✅ Deployment successful!**

---

## PART 5: TROUBLESHOOTING

### Error: "Build failed"

**Check the build logs for specific errors:**

#### Error: "Cannot find module 'firebase'"
**Solution:**
1. Make sure `package.json` includes all dependencies
2. In your local project, run: `npm install`
3. Commit and push: `git add . && git commit -m "Update dependencies" && git push`
4. Vercel will auto-deploy

#### Error: "Invalid private key"
**Solution:**
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Find `FIREBASE_PRIVATE_KEY`
3. Click the three dots → Edit
4. Re-paste the private key (make sure no quotes, keep \n characters)
5. Click Save
6. Go to Deployments tab → Click three dots on latest deployment → Redeploy

#### Error: "Firebase Admin initialization failed"
**Solution:**
1. Verify all three Firebase Admin variables are set:
   - FIREBASE_PROJECT_ID
   - FIREBASE_CLIENT_EMAIL
   - FIREBASE_PRIVATE_KEY
2. Check for typos in variable names (they're case-sensitive)
3. Redeploy

### Error: "Application loads but login doesn't work"

**Check browser console (F12 → Console tab):**

#### Error: "Firebase: Error (auth/invalid-api-key)"
**Solution:**
1. Check `NEXT_PUBLIC_FIREBASE_API_KEY` is correct
2. Make sure it starts with `NEXT_PUBLIC_` (this prefix is required)
3. Update in Vercel settings and redeploy

#### Error: "Network request failed"
**Solution:**
1. Check Firebase project is active
2. Verify Firestore database is created
3. Verify Authentication is enabled (Email/Password provider)

### Error: "Data not saving"

**Solution:**
1. Check Firestore security rules are deployed
2. In Firebase Console → Firestore Database → Rules
3. Make sure rules allow authenticated users to read/write their own data

---

## PART 6: POST-DEPLOYMENT CONFIGURATION

### Step 20: Add Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** tab
3. Click **"Domains"** in sidebar
4. Click **"Add"** button
5. Enter your domain name (e.g., `obscura.yourdomain.com`)
6. Follow DNS configuration instructions
7. Wait for SSL certificate (automatic, takes 5-10 minutes)

### Step 21: Configure Firebase Authorized Domains

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your `obscura-23926` project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add your Vercel domain: `obscura-xxxxx.vercel.app`
6. If you added a custom domain, add that too
7. Click **"Add"**

### Step 22: Set Up Continuous Deployment

**Good news: This is already set up!**

Every time you push to GitHub, Vercel will automatically:
1. Detect the push
2. Build your application
3. Deploy to production

**To deploy updates:**
```cmd
cd C:\Users\76bab\Downloads\My Projects\obscura
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy within 2-5 minutes.

---

## PART 7: MONITORING AND MAINTENANCE

### Step 23: Monitor Your Application

**Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Click on your `obscura` project
3. View:
   - **Deployments**: History of all deployments
   - **Analytics**: Page views, performance metrics
   - **Logs**: Runtime logs and errors

**Firebase Console:**
1. Go to https://console.firebase.google.com
2. Select `obscura-23926` project
3. Monitor:
   - **Authentication**: User signups and logins
   - **Firestore**: Database reads/writes
   - **Usage**: Quota and billing

### Step 24: View Logs

**To view runtime logs:**
1. Vercel dashboard → Your project
2. Click **"Deployments"** tab
3. Click on a deployment
4. Click **"Functions"** tab
5. Click on any function to see logs

**To view build logs:**
1. Click on a deployment
2. Click **"Building"** tab
3. View full build output

---

## PART 8: SECURITY CHECKLIST

### Step 25: Security Verification

Verify these security measures are in place:

- ✅ `.env.local` is in `.gitignore` (not pushed to GitHub)
- ✅ Firebase security rules are deployed
- ✅ Only authenticated users can access their own data
- ✅ Master password never sent to server
- ✅ All data encrypted before storage
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Environment variables are secure (not exposed in client)

---

## PART 9: COMMON ISSUES AND SOLUTIONS

### Issue: "I made changes but they're not showing on the deployed site"

**Solution:**
1. Make sure you committed and pushed your changes:
   ```cmd
   git add .
   git commit -m "Your changes"
   git push
   ```
2. Wait 2-5 minutes for Vercel to rebuild
3. Hard refresh your browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue: "Environment variable changes not taking effect"

**Solution:**
1. After changing environment variables in Vercel
2. You must manually redeploy:
   - Go to Deployments tab
   - Click three dots on latest deployment
   - Click "Redeploy"
   - Select "Use existing Build Cache" (faster) or rebuild from scratch

### Issue: "Getting 404 errors on page refresh"

**Solution:**
This shouldn't happen with Next.js, but if it does:
1. Check `next.config.js` exists
2. Verify Vercel detected it as a Next.js project
3. Redeploy

### Issue: "Slow loading times"

**Solution:**
1. Check Vercel Analytics for performance metrics
2. Optimize images (use Next.js Image component)
3. Consider upgrading Vercel plan for better performance

---

## PART 10: BACKUP AND RECOVERY

### Step 26: Backup Your Data

**Firebase Backup:**
1. Go to Firebase Console
2. Firestore Database → Import/Export
3. Set up automated backups to Google Cloud Storage

**Code Backup:**
- Your code is already backed up on GitHub
- Consider enabling GitHub Actions for automated testing

### Step 27: Rollback a Deployment

**If a deployment breaks your app:**
1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click three dots → "Promote to Production"
4. Your app will instantly rollback

---

## 📊 DEPLOYMENT CHECKLIST

Use this checklist for every deployment:

**Before Deployment:**
- [ ] All code tested locally
- [ ] No console errors
- [ ] All features working
- [ ] Environment variables documented
- [ ] .gitignore includes .env.local
- [ ] Dependencies in package.json

**During Deployment:**
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All 9 environment variables added
- [ ] Build completed successfully
- [ ] No build errors

**After Deployment:**
- [ ] Application loads
- [ ] Login/signup works
- [ ] Vault operations work
- [ ] Theme toggle works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Firebase authorized domain added

---

## 🎉 SUCCESS!

If you've followed all steps, your Obscura application should now be:
- ✅ Deployed to Vercel
- ✅ Accessible via public URL
- ✅ Fully functional
- ✅ Secure and encrypted
- ✅ Responsive on all devices
- ✅ Auto-deploying on every push

**Your deployment URL:** `https://obscura-xxxxx.vercel.app`

**Share it, use it, and enjoy your secure vault!** 🔒

---

## 📞 NEED HELP?

**Vercel Support:**
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

**Firebase Support:**
- Documentation: https://firebase.google.com/docs
- Community: https://stackoverflow.com/questions/tagged/firebase

**Obscura Issues:**
- Check build logs in Vercel
- Check browser console (F12)
- Check Firebase Console for errors
- Review this guide again

---

**Last Updated:** 2024
**Version:** 1.0
**Status:** Production Ready ✅
