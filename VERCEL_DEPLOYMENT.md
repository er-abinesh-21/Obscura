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
Value: AIzaSyAGqtKBqd5RFXlkUNX-MC3O28VzreWslvg

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: obscura-23926.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: obscura-23926

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: obscura-23926.firebasestorage.app

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 861104204973

NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:861104204973:web:def2b6b20621940a14aa24
```

#### Server-side Variables (Keep Secret)
```
FIREBASE_PROJECT_ID
Value: obscura-23926

FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@obscura-23926.iam.gserviceaccount.com

FIREBASE_PRIVATE_KEY
Value: (See below for special formatting)
```

### Step 4: FIREBASE_PRIVATE_KEY Special Formatting

**CRITICAL**: The private key must be entered WITHOUT quotes and WITH literal `\n` characters.

Copy this EXACT value (including the \n characters):

```
-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAe4mCMYtVukJD\ndzF492bpwWv9zwt3ilKEERKztKxrOfsQG2JpOGKK6ktw0LW1q5a+lxshu4mIbgAo\nyPnbTEKJ+/nT4DoIn69IsKcHGBQxyxsrF2xDBM5LzqZ2eUHR7dvzM8v3jS7K5gG3\ng0WE+5KxJO67toq5CtGuvCOQHdUlDB7HQhmrgkzZrGkf3NAUuBwyyc5N8E+oJ+8d\nbH9qY7YeRx9ekUCl0Nqena9x4zQ0/9SqsyiW2/JfZWjjavXJ0+xyVe4EE6CIEHWJ\nnK1nJjpHWkbqwd87jdxEntcZOkM4HKpDMAVo87WhDwQFqiYil+kTUOw5uNdILy4U\nmDPvahzJAgMBAAECggEARjlL88nrkb1Ai6iizgVE8Kd2pMSy5Ev8yt4HurSB6yTe\nKgQzpTvDB/duypv6j2sotiQe6/GlvbaULE0WiyGJbRoXDWvTAG5x3s1EQtxQEdKN\n+Oy0vMa2FQYxySt4DgT/p/0PvyMtHS1JFxC3fkriO+rDhoyUk+oUkfFl8CBSMQ9W\nJXkdWoTo/B4gqQgz9apPXYDvMMZg7DVLLDP87wLF4tV+MgLTHN1mDxRpBcnjuSJU\nginMNifAhglQZOV3lOqYh9OnF2NfzoX/pyDeHEVJ4QPU/Y7dF42dWF/Bg7M2lOR7\ntAV12uVyvFUFdDb4Ea4+SUxQ/Pfz81Axr1y+65ae+QKBgQD1ns6Mzesr6agMHlYV\nJfl8DuIvix67FTB/7XEQX5/kmHLTGbowPJZC0m9O9tJZgRdLzfoWv/AkJ36paV0n\n0V5fvYtLGsl5TWGKxyjriWV/eKG0dZUgfI13EBWsQWNh/gzXKW2zqqZNDdHIeYeU\nUBOE6eIpHBSg1UuVzLnFy46W1wKBgQDInd7H6Cp1tAEOqZe41eFpYzi/vboSSYlw\nadRR/pVtSi10ChH2Aui3/6IS2qr+sCkOxx0Ay3cYDgoY5doFcvxwpltXAp30Ero+\nMko+kSmnqRQzc7LlAf9LKpaNVItqRd7o1H6yRa/UWjIkg7cG/aQP9+V/ad0pwiOs\n17MbgFOVXwKBgQCjD06og3wApxn9EZasa415IpheX8mDAco043kQGauYoux34LiO\nlWpb6kAi+BElgmHo3VGOENZn6iBYb658ZK52eOskbSAb+5cp/pXX6FsNiRQxLW5X\nJtjzliYNOUu1Hmd/3+0IPd4xgV8n7CZp+885iduu1wmKzI9lX4hlG4IJ+QKBgAQL\n+zR5IHIjYWoUTbUyy0s+7yQfBaPcy+Lyn4/P3N/JgUU39sjJojwj8fcDZjOhBhMA\nPTuI3ywjDF0YNd+qRCFZmboVmW4U+qDKjujYMMjrBjdLfC5WbfnsMAFF1VIderOj\npbKe6T8VWrGV3plLgIW58G0zi3yOJ/4Sk9BYNFdtAoGBAPB6xWoIJsc22N5zS8d2\nCg6+nh6nuhsue9DyODP7DTsXKzB5G85aDw/lDeJWmLFb0cZqDpH7TWL9JcQoSSmZ\nGh2gnTDQNtv+conSk6dT6MHbJ2gfXk34AgvwmI2TaKlu8WaybIAxwXP2XiDMJdk/\nzY+fwYmAuvjwY3a/1vtgMyY3\n-----END PRIVATE KEY-----\n
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

Click "Deploy" and Vercel will build your application.

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
