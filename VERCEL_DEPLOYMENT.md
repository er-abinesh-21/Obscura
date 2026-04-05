# Vercel Deployment Guide for Obscura

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Obscura vault app"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings

### Step 3: Add Environment Variables

**IMPORTANT: Do NOT use the .env file import feature. Add variables manually.**

Go to **Settings → Environment Variables** and add these one by one:

#### Public Variables (Client-side)
```
NEXT_PUBLIC_FIREBASE_API_KEY
Value: 

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: 

NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: 

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: 

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 

NEXT_PUBLIC_FIREBASE_APP_ID
Value: 
```

#### Server-side Variables (Keep Secret)
```
FIREBASE_PROJECT_ID
Value: 

FIREBASE_CLIENT_EMAIL
Value: 

FIREBASE_PRIVATE_KEY
Value: (See below for special formatting)
```

### Step 4: FIREBASE_PRIVATE_KEY Special Formatting

**CRITICAL**: The private key must be entered WITHOUT quotes and WITH literal `\n` characters.

Copy this EXACT value (including the \n characters):

```
-----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----\n
```

**Important Notes:**
- Do NOT add quotes around the key
- Keep the `\n` characters (they represent line breaks)
- Copy the entire string including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Step 5: Environment Selection

For each variable, select which environments it should be available in:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 6: Deploy

Click "  Deploy" and Vercel will build your application.

---

## 🔧 Troubleshooting

### Error: "references Secret which does not exist"
**Solution**: You're trying to import the .env file. Don't do this. Add variables manually in Vercel dashboard.

### Error: "Invalid private key"
**Solution**: Make sure you copied the FIREBASE_PRIVATE_KEY without quotes and with `\n` characters intact.

### Error: "Firebase Admin initialization failed"
**Solution**: Check that all three Firebase Admin variables are set correctly:
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

### Build fails with "Module not found"
**Solution**: Make sure all dependencies are in package.json and committed to Git.

---

## 📋 Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] Pushed to GitHub
- [ ] Firebase project is active
- [ ] Firestore database created
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Security rules deployed
- [ ] All environment variables ready to copy

---

## 🎯 Post-Deployment Steps

1. **Test Authentication**: Try signing up with a new account
2. **Test Vault Operations**: Create, read, update, delete items
3. **Test Theme Toggle**: Switch between light and dark modes
4. **Test Responsive Design**: Check on mobile, tablet, desktop
5. **Check Console**: Look for any errors in browser console

---

## 🔒 Security Notes

- Never commit `.env.local` to Git (it's in .gitignore)
- NEXT_PUBLIC_* variables are exposed to the browser (safe for Firebase client config)
- FIREBASE_PRIVATE_KEY is server-side only (never exposed to browser)
- Firestore security rules protect data at the database level

---

## 📱 Custom Domain (Optional)

After successful deployment:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

---

## 🚀 Continuous Deployment

Once set up, every push to your main branch will automatically deploy to Vercel!

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel will automatically build and deploy your changes.

---

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments, logs, and analytics
- **Firebase Console**: Monitor authentication, database usage
- **Browser DevTools**: Check for client-side errors

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ You can access your deployed URL
- ✅ Login/signup works
- ✅ Vault operations work
- ✅ Theme toggle works
- ✅ No console errors

---

**Need Help?** Check Vercel deployment logs for detailed error messages.
