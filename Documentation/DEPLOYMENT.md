# 🔒 Obscura - Secure Vault Application

## Complete Deployment Guide

---

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account
- Vercel account
- Git installed

---

## 🔥 Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "obscura" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. Click "Save"

### 1.3 Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode**
4. Select your region
5. Click "Enable"

### 1.4 Deploy Security Rules

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in project:
```bash
cd obscura
firebase init firestore
```

4. Select your project
5. Accept default `firestore.rules` file
6. Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### 1.5 Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click **Web** icon (</>)
4. Register app name: "Obscura Web"
5. Copy the config object

### 1.6 Get Firebase Admin SDK Credentials

1. In **Project Settings**, go to **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Extract these values:
   - `project_id`
   - `client_email`
   - `private_key`

---

## 🚀 Step 2: Deploy to Vercel

### 2.1 Install Dependencies

```bash
cd obscura
npm install
```

### 2.2 Create Environment Variables

Create `.env.local` file:

```env
# Firebase Client (from Step 1.5)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=obscura-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=obscura-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=obscura-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin SDK (from Step 1.6)
FIREBASE_PROJECT_ID=obscura-xxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@obscura-xxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

### 2.3 Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 2.4 Deploy to Vercel

#### Option A: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts and add environment variables when asked.

#### Option B: Vercel Dashboard

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/obscura.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

---

## 🔐 Security Checklist

- ✅ All sensitive data encrypted client-side with AES-256-GCM
- ✅ Master password NEVER sent to server
- ✅ PBKDF2 key derivation (100,000 iterations)
- ✅ Firestore security rules enforce per-user access
- ✅ Firebase ID token verification on all API routes
- ✅ HTTPS enforced by Vercel
- ✅ No plaintext storage anywhere

---

## 📱 Step 3: Convert to React Native (Expo)

### 3.1 Create Expo Project

```bash
npx create-expo-app obscura-mobile
cd obscura-mobile
```

### 3.2 Install Dependencies

```bash
npm install firebase axios expo-secure-store @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

### 3.3 Copy Files

Copy these files from web project:
- `utils/encryption.js` (modify for React Native crypto)
- `services/api.js`
- `components/VaultCard.js`
- `components/AddEditModal.js`

### 3.4 Modify Encryption for React Native

Install crypto polyfill:
```bash
npm install expo-crypto
```

Update `utils/encryption.js`:
```javascript
import * as Crypto from 'expo-crypto';

// Use Crypto.digestStringAsync for PBKDF2
// Use Crypto.getRandomBytesAsync for random generation
```

### 3.5 Use Secure Storage

Replace `sessionStorage` with `expo-secure-store`:

```javascript
import * as SecureStore from 'expo-secure-store';

// Store
await SecureStore.setItemAsync('masterPassword', password);

// Retrieve
const password = await SecureStore.getItemAsync('masterPassword');
```

### 3.6 Run App

```bash
npx expo start
```

---

## 🖥️ Step 4: Convert to Electron Desktop App

### 4.1 Install Electron

```bash
cd obscura
npm install electron electron-builder --save-dev
```

### 4.2 Create Electron Main Process

Create `electron/main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const startUrl = process.env.ELECTRON_START_URL || 
    `file://${path.join(__dirname, '../out/index.html')}`;
  
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

### 4.3 Update package.json

Add scripts:

```json
{
  "scripts": {
    "electron": "electron .",
    "electron-dev": "ELECTRON_START_URL=http://localhost:3000 electron .",
    "electron-build": "next build && next export && electron-builder"
  },
  "main": "electron/main.js",
  "build": {
    "appId": "com.obscura.vault",
    "productName": "Obscura",
    "files": ["electron/**/*", "out/**/*"],
    "directories": {
      "output": "dist"
    }
  }
}
```

### 4.4 Build Desktop App

```bash
npm run electron-build
```

---

## 🎯 Features Implemented

### Core Features
- ✅ Add/Edit/Delete vault items
- ✅ API Keys, Passwords, Secure Notes
- ✅ Search & filter
- ✅ Copy to clipboard
- ✅ Show/hide sensitive values
- ✅ Categories (General, Work, Personal, Dev)

### Security Features
- ✅ End-to-end encryption (AES-256-GCM)
- ✅ Master password system
- ✅ PBKDF2 key derivation
- ✅ Firebase authentication
- ✅ Secure session handling

---

## 🔧 Advanced Features (Optional Enhancements)

### Auto-lock After Inactivity

Add to `pages/dashboard.js`:

```javascript
useEffect(() => {
  let timeout;
  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      sessionStorage.clear();
      router.push('/unlock');
    }, 5 * 60 * 1000); // 5 minutes
  };
  
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keypress', resetTimer);
  resetTimer();
  
  return () => {
    clearTimeout(timeout);
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keypress', resetTimer);
  };
}, []);
```

### Export Encrypted Backup

```javascript
const exportBackup = async () => {
  const data = JSON.stringify(items);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `obscura-backup-${Date.now()}.json`;
  a.click();
};
```

### Dark Mode Toggle

Add to state and toggle CSS variables dynamically.

---

## 📊 Database Schema

### Collection: `users`
```
{
  uid: string,
  email: string,
  salt: string (base64),
  createdAt: timestamp
}
```

### Collection: `vaultItems`
```
{
  id: string,
  userId: string,
  type: 'api' | 'password' | 'note',
  title: string,
  encryptedData: string (base64),
  iv: string (base64),
  category: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" errors
- Check Firebase ID token is being sent in Authorization header
- Verify Firebase Admin SDK credentials are correct

### Issue: Decryption fails
- Ensure master password is correct
- Verify salt is stored and retrieved properly

### Issue: CORS errors
- Vercel automatically handles CORS
- For local dev, ensure API routes are on same domain

---

## 🎉 Success!

Your Obscura vault is now deployed and running with:
- ✅ Serverless backend (Vercel Functions)
- ✅ End-to-end encryption
- ✅ Firebase authentication & database
- ✅ Cross-platform ready (Web, Mobile, Desktop)

**Live URL**: Your Vercel deployment URL
**Security**: All data encrypted client-side before storage

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Expo Documentation](https://docs.expo.dev/)
- [Electron Documentation](https://www.electronjs.org/docs)
