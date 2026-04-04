# Firebase Setup Guide - Fix Authentication Errors

## Error: 400 Bad Request on signUp/signIn

This means Firebase Authentication is not properly enabled. Follow these steps:

## Step-by-Step Fix

### 1. Enable Authentication in Firebase Console

1. Go to https://console.firebase.google.com/
2. Select your project (or create new one)
3. Click **Authentication** in left sidebar
4. Click **Get Started** button
5. Go to **Sign-in method** tab
6. Enable these providers:
   - **Email/Password** - Click, toggle Enable, Save
   - **Google** - Click, toggle Enable, Save

### 2. Get Your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. If no web app exists:
   - Click **Add app** → Web icon (</>)
   - Register app with nickname "obscura-web"
4. Copy the config values

### 3. Create .env.local File

Create `.env.local` in project root with your actual values:

```env
# Get these from Firebase Console → Project Settings → Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAGqtKBqd5RFXlkUNX-MC3O28VzreWslvg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Get these from Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### 4. Setup Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Production mode**
4. Select location (closest to your users)
5. Click **Enable**

### 5. Deploy Firestore Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
# Select your project
# Accept default firestore.rules
firebase deploy --only firestore:rules
```

### 6. Restart Development Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Verify Setup Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore database created
- [ ] Web app registered in Firebase
- [ ] `.env.local` file created with correct values
- [ ] Security rules deployed
- [ ] Dev server restarted

## Common Issues

### Issue: "API key not valid"
**Fix:** Double-check `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`

### Issue: "auth/operation-not-allowed"
**Fix:** Enable Email/Password in Firebase Console → Authentication → Sign-in method

### Issue: "Unauthorized" on API calls
**Fix:** Check Firebase Admin SDK credentials (FIREBASE_PRIVATE_KEY)

### Issue: Changes not reflecting
**Fix:** Restart dev server after changing `.env.local`

## Test Authentication

1. Run `npm run dev`
2. Go to http://localhost:3000
3. Try creating account with email/password
4. Try "Continue with Google"
5. Check Firebase Console → Authentication → Users to see registered users

## Quick Test Script

Create `test-firebase.js`:

```javascript
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

try {
  const app = initializeApp(config);
  const auth = getAuth(app);
  console.log('✅ Firebase initialized successfully');
  console.log('Project ID:', config.projectId);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
}
```

Run: `node test-firebase.js`

## Need Help?

1. Check browser console for detailed errors
2. Check Firebase Console → Authentication → Users
3. Verify all environment variables are set
4. Ensure no typos in `.env.local`
