# 🔧 TROUBLESHOOTING: Fix 400 Bad Request Error

## Current Status
✅ Environment variables configured  
✅ API routes moved to correct location (`pages/api/`)  
❌ Firebase Authentication NOT enabled (this is the issue!)

---

## 🎯 THE FIX (5 minutes)

### Step 1: Enable Firebase Authentication

**This is the MAIN issue causing the 400 error!**

1. Open: **https://console.firebase.google.com/**
2. Select your project
3. Click **"Authentication"** in left sidebar
4. If you see "Get Started" button, click it
5. Click **"Sign-in method"** tab
6. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"
7. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable" to ON
   - Click "Save"

### Step 2: Create Firestore Database

1. In Firebase Console, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Production mode"**
4. Choose your region (closest to you)
5. Click **"Enable"**

### Step 3: Deploy Security Rules

```bash
firebase login
firebase init firestore
# Select your project
# Accept default files
firebase deploy --only firestore:rules
```

### Step 4: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🧪 Test Your Setup

### Option 1: Visit Test Page
Go to: **http://localhost:3000/test-firebase**

This will show you what's configured correctly.

### Option 2: Try Login
1. Go to http://localhost:3000
2. Click "Create new account"
3. Enter email/password
4. Set master password
5. Should work now! ✅

### Option 3: Try Google Sign-In
1. Go to http://localhost:3000
2. Click "Continue with Google"
3. Select Google account
4. Set master password when prompted
5. Should work! ✅

---

## 📋 Verification Checklist

After completing the steps above, verify:

- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firebase Authentication enabled (Google)
- [ ] Firestore Database created
- [ ] Security rules deployed
- [ ] Dev server restarted
- [ ] Can create account with email/password
- [ ] Can sign in with Google
- [ ] No 400 errors in console
- [ ] No 404 errors for `/api/user`

---

## 🐛 Still Having Issues?

### Error: "API key not valid"
**Cause:** Wrong API key in `.env.local`  
**Fix:** Copy correct key from Firebase Console → Project Settings

### Error: "auth/operation-not-allowed"
**Cause:** Authentication not enabled  
**Fix:** Follow Step 1 above

### Error: "User not found" (404)
**Cause:** User document not created in Firestore  
**Fix:** This is normal for first-time users, the app will create it

### Error: "Unauthorized"
**Cause:** Firebase Admin SDK not configured  
**Fix:** Check `FIREBASE_PRIVATE_KEY` in `.env.local`

### API routes still 404
**Cause:** Server not restarted  
**Fix:** Stop server (Ctrl+C) and run `npm run dev` again

---

## 🎓 Understanding the Errors

### 400 Bad Request
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signUp 400
```
**Meaning:** Firebase received the request but Authentication is not enabled.  
**Fix:** Enable Authentication in Firebase Console (Step 1)

### 404 Not Found
```
GET http://localhost:3000/api/user 404
```
**Meaning:** API route not found by Next.js  
**Fix:** Already fixed! Routes moved to `pages/api/`

---

## ✅ Success Indicators

You'll know it's working when:

1. **No 400 errors** in browser console
2. **No 404 errors** for API routes
3. **Can create account** with email/password
4. **Can sign in** with Google
5. **User appears** in Firebase Console → Authentication → Users
6. **Data appears** in Firebase Console → Firestore Database

---

## 🚀 Quick Commands

```bash
# Check Firebase config
node check-firebase-config.js

# Test Firebase setup
# Visit: http://localhost:3000/test-firebase

# Restart dev server
npm run dev

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

---

## 📞 Need More Help?

1. Check browser console (F12) for detailed errors
2. Check Firebase Console → Authentication → Users
3. Check Firebase Console → Firestore Database
4. Verify `.env.local` has correct values
5. Make sure you completed Step 1 (Enable Authentication!)

---

## 🎉 Once Fixed

After fixing, you'll have:
- ✅ Email/Password authentication
- ✅ Google authentication
- ✅ Secure vault with encryption
- ✅ Working API routes
- ✅ Production-ready app

**The #1 issue is usually: Authentication not enabled in Firebase Console!**

Go enable it now! 🔥
