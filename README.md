# 🔒 Obscura - Secure Vault Application

A production-ready, cross-platform secure vault application with end-to-end encryption.

## 🌟 Features

- **End-to-End Encryption**: AES-256-GCM encryption on client-side
- **Zero-Knowledge Architecture**: Server never sees plaintext data
- **Master Password System**: Separate encryption key from login credentials
- **Cross-Platform**: Web, Mobile (React Native), Desktop (Electron)
- **Serverless Backend**: Vercel Functions + Firebase
- **Secure Storage**: API Keys, Passwords, Secure Notes

## 🔐 Security

- **Encryption**: AES-256-GCM
- **Key Derivation**: PBKDF2 (100,000 iterations)
- **Authentication**: Firebase Auth with JWT verification
- **Database**: Firestore with strict security rules
- **Transport**: HTTPS only

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 📦 Tech Stack

- **Frontend**: React (Next.js)
- **Backend**: Next.js API Routes (serverless on Vercel)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Encryption**: Web Crypto API
- **Deployment**: Vercel

## 📖 Documentation

See [DEPLOYMENT.md](./Documentation/DEPLOYMENT.md) for complete setup and deployment instructions.

## 🏗️ Project Structure

```
obscura/
├── pages/
│   ├── api/
│   │   ├── middleware/
│   │   │   └── auth.js          # Firebase token verification
│   │   ├── vault/
│   │   │   ├── index.js         # GET/POST vault items
│   │   │   └── [id].js          # PUT/DELETE vault items
│   │   └── user.js              # User salt management
│   ├── index.js                 # Login/Signup
│   ├── unlock.js                # Master password entry
│   └── dashboard.js             # Main vault interface
├── components/
│   ├── VaultCard.js         # Display vault items
│   └── AddEditModal.js      # Create/edit items
├── services/
│   └── api.js               # API client
├── utils/
│   ├── encryption.js        # AES-256-GCM + PBKDF2
│   ├── firebase.js          # Firebase client config
│   └── firebaseAdmin.js     # Firebase Admin SDK
└── styles/
    └── globals.css          # Glassmorphism UI
```

## 🔑 Environment Variables

```env
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Secret)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

## 🎯 Roadmap

- [ ] Multi-factor authentication
- [ ] Biometric unlock (mobile)
- [ ] Password strength analyzer
- [ ] Secure sharing with temporary links
- [ ] Browser extension
- [ ] Import from other password managers

## 📄 License

MIT

## ⚠️ Security Notice

This is a demonstration project. For production use:
- Conduct security audit
- Implement rate limiting
- Add monitoring and logging
- Enable MFA
- Regular security updates
