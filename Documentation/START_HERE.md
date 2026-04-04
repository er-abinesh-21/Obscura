# 🔒 OBSCURA - Secure Vault Application

> **Production-ready, cross-platform secure vault with end-to-end encryption**

[![Security](https://img.shields.io/badge/Security-AES--256--GCM-green)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-blue)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

---

## 🎯 What is Obscura?

Obscura is a **zero-knowledge secure vault** that stores your API keys, passwords, and secure notes with military-grade encryption. Your data is encrypted on your device before it ever reaches the server, ensuring complete privacy.

### Key Features

- 🔐 **End-to-End Encryption** - AES-256-GCM with PBKDF2 key derivation
- 🚫 **Zero-Knowledge** - Server never sees your plaintext data
- 🔑 **Master Password** - Separate encryption key from login credentials
- 📱 **Cross-Platform** - Web, Mobile (React Native), Desktop (Electron)
- ☁️ **Serverless** - Scalable Vercel Functions + Firebase
- 🎨 **Modern UI** - Beautiful glassmorphism design

---

## 🚀 Quick Start (10 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase
1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create Firestore database
4. Copy configuration

### 3. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Deploy Security Rules
```bash
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 5. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000`

### 6. Deploy to Vercel
```bash
vercel
```

**📖 For detailed instructions, see [GET_STARTED.md](./GET_STARTED.md)**

---

## 📁 Project Structure

```
obscura/
├── api/                          # Serverless API routes
│   ├── middleware/auth.js        # Firebase token verification
│   ├── vault/
│   │   ├── index.js             # GET/POST vault items
│   │   └── [id].js              # PUT/DELETE vault items
│   └── user.js                  # User salt management
│
├── components/                   # React components
│   ├── VaultCard.js             # Display vault items
│   └── AddEditModal.js          # Create/edit modal
│
├── pages/                        # Next.js pages
│   ├── _app.js                  # App wrapper
│   ├── index.js                 # Login/Signup
│   ├── unlock.js                # Master password entry
│   └── dashboard.js             # Main vault interface
│
├── services/                     # API client
│   └── api.js                   # HTTP requests
│
├── utils/                        # Utilities
│   ├── encryption.js            # AES-256-GCM + PBKDF2
│   ├── firebase.js              # Firebase client
│   ├── firebaseAdmin.js         # Firebase Admin SDK
│   └── passwordUtils.js         # Password utilities
│
├── styles/                       # CSS
│   └── globals.css              # Global styles
│
└── Documentation/
    ├── GET_STARTED.md           # 10-minute quick start ⭐
    ├── DEPLOYMENT.md            # Complete deployment guide
    ├── SECURITY.md              # Security architecture
    ├── TESTING.md               # Testing checklist
    ├── ARCHITECTURE.md          # System diagrams
    ├── CHECKLIST.md             # Deployment checklist
    ├── REACT_NATIVE_GUIDE.md    # Mobile app guide
    └── ELECTRON_GUIDE.md        # Desktop app guide
```

---

## 🔐 How It Works

### Encryption Flow

```
User Input (Plaintext)
        ↓
Master Password + Salt → PBKDF2 (100k iterations)
        ↓
256-bit Encryption Key (in memory only)
        ↓
AES-256-GCM Encryption + Random IV
        ↓
Encrypted Data (base64)
        ↓
Send to Server via HTTPS
        ↓
Store in Firestore (encrypted at rest)
```

### Security Guarantees

✅ Server **NEVER** sees plaintext data  
✅ Database **ONLY** contains encrypted data  
✅ Master password **NEVER** transmitted  
✅ Each item has **unique IV**  
✅ **Per-user** access control enforced  

---

## 📚 Documentation

| Document | Description | When to Read |
|----------|-------------|--------------|
| **[GET_STARTED.md](./GET_STARTED.md)** | 10-minute quick start | **Start here** ⭐ |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Complete deployment guide | Before deploying |
| [SECURITY.md](./SECURITY.md) | Security architecture | Understanding security |
| [TESTING.md](./TESTING.md) | Testing checklist | Before production |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System diagrams | Understanding architecture |
| [CHECKLIST.md](./CHECKLIST.md) | Deployment checklist | During deployment |
| [REACT_NATIVE_GUIDE.md](./REACT_NATIVE_GUIDE.md) | Mobile app guide | Building mobile app |
| [ELECTRON_GUIDE.md](./ELECTRON_GUIDE.md) | Desktop app guide | Building desktop app |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Comprehensive summary | Overview |
| [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md) | Visual summary | Quick reference |

---

## 🛠️ Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Encryption**: Web Crypto API (AES-256-GCM, PBKDF2)
- **Deployment**: Vercel
- **Styling**: CSS (Glassmorphism)

---

## 🎨 Features

### Core Features
- ✅ Store API Keys, Passwords, Secure Notes
- ✅ Search and filter
- ✅ Copy to clipboard
- ✅ Show/hide sensitive values
- ✅ Categories (General, Work, Personal, Dev)
- ✅ Responsive design

### Security Features
- ✅ AES-256-GCM encryption
- ✅ PBKDF2 key derivation (100,000 iterations)
- ✅ Unique salt per user
- ✅ Unique IV per encryption
- ✅ Client-side encryption only
- ✅ Master password never transmitted
- ✅ Firebase security rules
- ✅ JWT token verification

---

## 📱 Cross-Platform Support

### Web (Current)
✅ Fully implemented and ready to deploy

### Mobile (React Native + Expo)
📖 Complete guide in [REACT_NATIVE_GUIDE.md](./REACT_NATIVE_GUIDE.md)
- Supports iOS and Android
- Can add biometric authentication
- Uses secure storage

### Desktop (Electron)
📖 Complete guide in [ELECTRON_GUIDE.md](./ELECTRON_GUIDE.md)
- Supports Windows, macOS, Linux
- Native menu and shortcuts
- System tray integration

---

## 🔧 API Endpoints

```
GET    /api/vault       # Fetch all vault items
POST   /api/vault       # Create new vault item
PUT    /api/vault/[id]  # Update vault item
DELETE /api/vault/[id]  # Delete vault item
GET    /api/user        # Get user salt
POST   /api/user        # Create user with salt
```

All endpoints require Firebase authentication token in `Authorization` header.

---

## 🧪 Testing

### Manual Testing
1. Signup with email/password + master password
2. Login and unlock vault
3. Create API key, password, or note
4. Verify encryption in Firebase Console
5. Test search and filter
6. Test copy to clipboard
7. Test edit and delete

### Security Verification
1. Open browser DevTools → Network tab
2. Create a vault item
3. Inspect request payload
4. Verify only encrypted data is sent

**📖 Complete testing guide: [TESTING.md](./TESTING.md)**

---

## 🚨 Security Best Practices

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

**📖 Complete security guide: [SECURITY.md](./SECURITY.md)**

---

## 🐛 Troubleshooting

### Common Issues

**"Unauthorized" errors**
- Check Firebase token in Authorization header
- Verify Firebase Admin SDK credentials

**Decryption fails**
- Ensure master password is correct
- Verify salt is retrieved properly

**Build fails**
- Delete `.next/` and `node_modules/`
- Run `npm install` again

**📖 More troubleshooting: [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 📊 Project Statistics

```
Total Files:                26
Lines of Code:              ~2,500
Documentation Pages:        10
API Endpoints:              6
React Components:           6
Security Layers:            5
Supported Platforms:        3
Encryption Strength:        256-bit AES-GCM
Key Derivation Iterations:  100,000
```

---

## 🎯 Roadmap

### Completed ✅
- End-to-end encryption
- User authentication
- Vault CRUD operations
- Search and filter
- Copy to clipboard
- Categories
- Responsive UI

### Short Term 🔜
- Auto-lock after inactivity
- Export/import backup
- Password strength indicator
- Dark mode toggle
- Rate limiting

### Long Term 🚀
- Multi-factor authentication
- Biometric unlock (mobile)
- Browser extension
- Secure sharing
- Password breach detection

---

## 💰 Cost Estimate

### Free Tier (Recommended for Starting)
- **Firebase**: Free (up to 50K reads/day, 20K writes/day)
- **Vercel**: Free (100GB bandwidth, unlimited requests)
- **Total**: $0/month

### Paid Tier (For Scale)
- **Firebase Blaze**: Pay-as-you-go (~$25/month for 1M operations)
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **Total**: ~$45/month

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Vercel](https://vercel.com/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

## 🎉 Get Started Now!

```bash
# 1. Clone or navigate to project
cd obscura

# 2. Install dependencies
npm install

# 3. Read the quick start guide
cat GET_STARTED.md

# 4. Setup Firebase (5 minutes)
# Follow instructions in GET_STARTED.md

# 5. Run locally
npm run dev

# 6. Deploy to production
vercel
```

---

## 📞 Support & Resources

- **Quick Start**: [GET_STARTED.md](./GET_STARTED.md) ⭐
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Security**: [SECURITY.md](./SECURITY.md)
- **Testing**: [TESTING.md](./TESTING.md)
- **Firebase Docs**: https://firebase.google.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

## ⭐ Star This Project

If you find Obscura useful, please consider starring the repository!

---

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🔒 OBSCURA - SECURE VAULT 🔒                   ║
║                                                              ║
║         Keep Your Secrets Safe with Zero-Knowledge          ║
║                    Encryption                                ║
║                                                              ║
║              Production-Ready • Secure • Fast                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Ready to secure your secrets? Start with [GET_STARTED.md](./GET_STARTED.md)! 🚀**
