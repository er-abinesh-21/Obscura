# 🚀 GET STARTED IN 10 MINUTES

## ⚠️ IMPORTANT: Getting 400 Error?

**If you see a 400 Bad Request error**, it means Firebase Authentication is not enabled!

**Quick Fix (2 minutes):**
1. Go to https://console.firebase.google.com/
2. Select your project → Authentication → Sign-in method
3. Enable "Email/Password" and "Google"
4. Restart dev server: `npm run dev`

📖 **Detailed guide:** See `VISUAL_GUIDE.md` or `TROUBLESHOOTING.md`

---

## What You Have

A **complete, production-ready secure vault application** called **Obscura** with:

✅ End-to-end encryption (AES-256-GCM)  
✅ Serverless backend (Vercel Functions)  
✅ Firebase authentication & database  
✅ Modern React frontend  
✅ Cross-platform ready (Web, Mobile, Desktop)  
✅ Complete documentation  

---

## Quick Start (10 Minutes)

### Step 1: Install Dependencies (1 min)

```bash
cd obscura
npm install
```

### Step 2: Setup Firebase (3 min)

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "obscura"
3. Go to **Authentication** → Enable "Email/Password" and "Google"
4. Go to **Firestore Database** → Create database (Production mode)
5. Go to **Project Settings** → Copy the config

### Step 3: Configure Environment (2 min)

Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Get Admin SDK credentials:**
- Firebase Console → Project Settings → Service Accounts
- Click "Generate new private key"
- Copy values from downloaded JSON

### Step 4: Deploy Security Rules (2 min)

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
# Select your project
# Accept default firestore.rules
firebase deploy --only firestore:rules
```

### Step 5: Run Locally (1 min)

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 6: Test It (1 min)

1. Click "Create new account"
2. Enter email/password
3. Set master password (remember it!)
4. Add a test password/API key
5. Verify it's encrypted in Firebase Console

---

## Deploy to Production (5 Minutes)

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
# Add environment variables when prompted
vercel --prod
```

### Option B: Vercel Dashboard

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/obscura.git
git push -u origin main
```

2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Import your repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

**Done!** Your app is live at `your-app.vercel.app`

---

## File Structure

```
obscura/
├── api/                    # Serverless API routes
│   ├── vault/             # Vault CRUD operations
│   └── user.js            # User management
├── components/            # React components
├── pages/                 # Next.js pages
├── utils/                 # Encryption & Firebase
├── services/              # API client
├── styles/                # CSS
└── Documentation/
    ├── README.md          # Overview
    ├── DEPLOYMENT.md      # Full deployment guide
    ├── SECURITY.md        # Security details
    ├── TESTING.md         # Testing guide
    ├── ARCHITECTURE.md    # System architecture
    ├── CHECKLIST.md       # Deployment checklist
    ├── REACT_NATIVE_GUIDE.md  # Mobile guide
    └── ELECTRON_GUIDE.md      # Desktop guide
```

---

## Key Features

### Security
- **AES-256-GCM encryption** - Military-grade
- **PBKDF2 key derivation** - 100,000 iterations
- **Zero-knowledge** - Server never sees plaintext
- **Master password** - Never stored or transmitted

### Functionality
- Store API keys, passwords, secure notes
- Search and filter
- Copy to clipboard
- Show/hide values
- Categories for organization

### Tech Stack
- React + Next.js
- Vercel Serverless Functions
- Firebase Auth + Firestore
- Web Crypto API

---

## How It Works

### Encryption Flow

```
User Input
    ↓
Master Password + Salt → PBKDF2 → Encryption Key
    ↓
Plaintext + Key → AES-256-GCM → Encrypted Data
    ↓
Send to Server (encrypted only)
    ↓
Store in Firestore
```

### Security Guarantee

- ✅ Server **NEVER** sees plaintext
- ✅ Database **ONLY** has encrypted data
- ✅ Master password **NEVER** transmitted
- ✅ Each item has **unique IV**
- ✅ **Per-user** access control

---

## Common Commands

```bash
# Development
npm run dev              # Run locally

# Deployment
vercel                   # Deploy to Vercel
firebase deploy          # Deploy Firestore rules

# Build
npm run build            # Build for production
```

---

## Testing

### Manual Test Flow

1. **Signup**: Create account with email/password + master password
2. **Login**: Login and unlock with master password
3. **Create**: Add API key, password, or note
4. **Verify**: Check Firebase Console - data should be encrypted
5. **Read**: View items in dashboard
6. **Update**: Edit an item
7. **Delete**: Remove an item
8. **Search**: Test search functionality
9. **Filter**: Test type filters
10. **Logout**: Clear session

### Security Verification

1. Open browser DevTools → Network tab
2. Create a vault item
3. Inspect request to `/api/vault`
4. Verify: Only encrypted data, no plaintext

---

## Troubleshooting

### "Unauthorized" Error
- Check Firebase token in Authorization header
- Verify Firebase Admin SDK credentials

### Decryption Fails
- Ensure master password is correct
- Verify salt is retrieved properly

### Build Fails
- Delete `.next/` and `node_modules/`
- Run `npm install` again

### Deployment Fails
- Check environment variables
- Verify Firebase credentials format

---

## Next Steps

### Immediate
- ✅ Deploy to production
- ✅ Test all features
- ✅ Share with users

### Short Term
- Add auto-lock after inactivity
- Implement export/import
- Add password strength indicator
- Enable dark mode

### Long Term
- Multi-factor authentication
- Biometric unlock (mobile)
- Browser extension
- Secure sharing

---

## Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `DEPLOYMENT.md` | Complete deployment guide |
| `SECURITY.md` | Security architecture |
| `TESTING.md` | Testing checklist |
| `ARCHITECTURE.md` | System diagrams |
| `CHECKLIST.md` | Deployment checklist |
| `REACT_NATIVE_GUIDE.md` | Mobile app guide |
| `ELECTRON_GUIDE.md` | Desktop app guide |

---

## Support

### Resources
- Firebase Docs: https://firebase.google.com/docs
- Vercel Docs: https://vercel.com/docs
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

### Debugging
1. Check browser console
2. Check Vercel logs
3. Check Firebase Console
4. Review documentation

---

## Security Best Practices

### For Users
- Use strong master password (16+ characters)
- Enable MFA on Firebase account
- Lock vault when not in use
- Keep device secure

### For Developers
- Never commit `.env.local`
- Keep dependencies updated
- Regular security audits
- Monitor logs for suspicious activity

---

## 🎉 You're Ready!

Your Obscura vault is:
- ✅ Fully functional
- ✅ Securely encrypted
- ✅ Production-ready
- ✅ Cross-platform capable

**Start securing your secrets today! 🔒**

---

## Quick Reference

### Environment Variables
```bash
# Client (public)
NEXT_PUBLIC_FIREBASE_*

# Server (secret)
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

### API Endpoints
```
GET    /api/vault       # List items
POST   /api/vault       # Create item
PUT    /api/vault/[id]  # Update item
DELETE /api/vault/[id]  # Delete item
GET    /api/user        # Get salt
POST   /api/user        # Create user
```

### Key Files
```
utils/encryption.js     # Encryption logic
api/middleware/auth.js  # Authentication
firestore.rules         # Security rules
pages/dashboard.js      # Main UI
```

---

## Success Checklist

- [ ] Firebase project created
- [ ] Environment variables configured
- [ ] Security rules deployed
- [ ] App runs locally
- [ ] Encryption verified
- [ ] Deployed to Vercel
- [ ] Production tested

**All checked? You're done! 🚀**
