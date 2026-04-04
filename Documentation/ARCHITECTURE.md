# 🏗️ Obscura Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                             │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    React Application                        │    │
│  │                                                             │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │    │
│  │  │  Login   │  │  Unlock  │  │Dashboard │  │ Settings │  │    │
│  │  │  Page    │  │  Screen  │  │   Page   │  │   Page   │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────────┐ │    │
│  │  │              Components Layer                         │ │    │
│  │  │  • VaultCard  • AddEditModal  • SearchBar           │ │    │
│  │  └──────────────────────────────────────────────────────┘ │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────────┐ │    │
│  │  │              Services Layer                           │ │    │
│  │  │  • API Client (Axios)                                │ │    │
│  │  │  • Authentication Service                            │ │    │
│  │  └──────────────────────────────────────────────────────┘ │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────────┐ │    │
│  │  │              Utilities Layer                          │ │    │
│  │  │  • Encryption (AES-256-GCM)                          │ │    │
│  │  │  • Key Derivation (PBKDF2)                           │ │    │
│  │  │  • Password Utils                                     │ │    │
│  │  └──────────────────────────────────────────────────────┘ │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────────┐ │    │
│  │  │         Client-Side Encryption Engine                 │ │    │
│  │  │  ┌────────────────────────────────────────────────┐  │ │    │
│  │  │  │  Master Password + Salt → PBKDF2 → Key        │  │ │    │
│  │  │  │  Plaintext + Key → AES-256-GCM → Ciphertext   │  │ │    │
│  │  │  └────────────────────────────────────────────────┘  │ │    │
│  │  └──────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  Session Storage                              │  │
│  │  • Master Password (temporary)                               │  │
│  │  • Salt (temporary)                                          │  │
│  │  • Firebase Auth Token                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           │ HTTPS (TLS 1.3)
                           │ Encrypted Payload Only
                           │
┌──────────────────────────▼───────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                                │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Serverless Functions (Node.js)                  │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────────┐ │    │
│  │  │  API Routes                                            │ │    │
│  │  │                                                        │ │    │
│  │  │  /api/vault          → GET/POST vault items          │ │    │
│  │  │  /api/vault/[id]     → PUT/DELETE vault item         │ │    │
│  │  │  /api/user           → GET/POST user salt            │ │    │
│  │  └────────────────────────────────────────────────────────┘ │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────────┐ │    │
│  │  │  Middleware                                            │ │    │
│  │  │  • Firebase Token Verification                        │ │    │
│  │  │  • Authorization Check                                │ │    │
│  │  │  • Input Sanitization                                 │ │    │
│  │  └────────────────────────────────────────────────────────┘ │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────────┐ │    │
│  │  │  Firebase Admin SDK                                    │ │    │
│  │  │  • Token Verification                                  │ │    │
│  │  │  • Firestore Access                                    │ │    │
│  │  └────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
                            │ Firebase Admin API
                            │
┌───────────────────────────▼───────────────────────────────────────────┐
│                      FIREBASE (Google Cloud)                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                  Firebase Authentication                     │    │
│  │  • Email/Password Provider                                  │    │
│  │  • JWT Token Generation                                     │    │
│  │  • User Management                                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                  Cloud Firestore                             │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────┐    │    │
│  │  │  Collection: users                                 │    │    │
│  │  │  ┌──────────────────────────────────────────────┐ │    │    │
│  │  │  │  Document: {userId}                          │ │    │    │
│  │  │  │  • uid: string                               │ │    │    │
│  │  │  │  • email: string                             │ │    │    │
│  │  │  │  • salt: string (base64)                     │ │    │    │
│  │  │  │  • createdAt: timestamp                      │ │    │    │
│  │  │  └──────────────────────────────────────────────┘ │    │    │
│  │  └────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────┐    │    │
│  │  │  Collection: vaultItems                            │    │    │
│  │  │  ┌──────────────────────────────────────────────┐ │    │    │
│  │  │  │  Document: {itemId}                          │ │    │    │
│  │  │  │  • userId: string                            │ │    │    │
│  │  │  │  • type: "api"|"password"|"note"             │ │    │    │
│  │  │  │  • title: string                             │ │    │    │
│  │  │  │  • encryptedData: string (base64)            │ │    │    │
│  │  │  │  • iv: string (base64)                       │ │    │    │
│  │  │  │  • category: string                          │ │    │    │
│  │  │  │  • createdAt: timestamp                      │ │    │    │
│  │  │  │  • updatedAt: timestamp                      │ │    │    │
│  │  │  └──────────────────────────────────────────────┘ │    │    │
│  │  └────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────┐    │    │
│  │  │  Security Rules                                     │    │    │
│  │  │  • Per-user access control                         │    │    │
│  │  │  • Data validation                                 │    │    │
│  │  │  • Authentication required                         │    │    │
│  │  └────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### 1. User Signup Flow

```
User
  │
  ├─► Enter email + login password
  │
  ▼
Firebase Auth
  │
  ├─► Create account
  │
  ▼
Client
  │
  ├─► Generate random salt (16 bytes)
  ├─► Prompt for master password
  │
  ▼
API: POST /api/user
  │
  ├─► Store { uid, email, salt }
  │
  ▼
Firestore: users collection
  │
  ▼
Dashboard (logged in)
```

### 2. Vault Item Creation Flow

```
User
  │
  ├─► Enter sensitive data (API key, password, note)
  │
  ▼
Client Encryption
  │
  ├─► Retrieve master password from session
  ├─► Retrieve salt from session
  ├─► Derive key: PBKDF2(masterPassword, salt, 100k iterations)
  ├─► Generate random IV (12 bytes)
  ├─► Encrypt: AES-256-GCM(plaintext, key, iv)
  │
  ▼
API: POST /api/vault
  │
  ├─► Verify Firebase token
  ├─► Validate input
  ├─► Store { userId, type, title, encryptedData, iv, category }
  │
  ▼
Firestore: vaultItems collection
  │
  ▼
Success response
  │
  ▼
Dashboard (item appears)
```

### 3. Vault Item Retrieval Flow

```
User
  │
  ├─► Navigate to dashboard
  │
  ▼
API: GET /api/vault
  │
  ├─► Verify Firebase token
  ├─► Query: WHERE userId == currentUser
  ├─► Return encrypted items
  │
  ▼
Client Decryption
  │
  ├─► For each item:
  │   ├─► Retrieve master password from session
  │   ├─► Retrieve salt from session
  │   ├─► Derive key: PBKDF2(masterPassword, salt, 100k iterations)
  │   ├─► Decrypt: AES-256-GCM-DECRYPT(encryptedData, key, iv)
  │   └─► Parse JSON plaintext
  │
  ▼
Dashboard (display decrypted items)
```

## Security Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    TRUSTED ZONE                              │
│                   (Client Browser)                           │
│                                                              │
│  • Master Password (in memory only)                         │
│  • Derived Encryption Key (in memory only)                  │
│  • Plaintext Data (in memory only)                          │
│  • Encryption/Decryption Operations                         │
│                                                              │
│  ⚠️ If compromised: All data exposed                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            │ Only encrypted data crosses
                            │
┌─────────────────────────────────────────────────────────────┐
│                   UNTRUSTED ZONE                             │
│              (Server + Database)                             │
│                                                              │
│  • Encrypted Data (ciphertext)                              │
│  • Initialization Vectors (IV)                              │
│  • User Salts (not secret)                                  │
│  • Firebase Auth Tokens                                     │
│                                                              │
│  ✅ If compromised: Data remains encrypted                  │
│  ⚠️ Attacker cannot decrypt without master password         │
└─────────────────────────────────────────────────────────────┘
```

## Encryption Key Hierarchy

```
Master Password (user knows)
        │
        ├─► PBKDF2 (100,000 iterations)
        │   + Salt (stored in Firestore)
        │
        ▼
Encryption Key (256-bit, in memory only)
        │
        ├─► AES-256-GCM Encryption
        │   + Random IV (per item)
        │
        ▼
Encrypted Data (stored in Firestore)
```

## Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ├─► Login with email/password
     │
     ▼
┌─────────────────┐
│ Firebase Auth   │
└────┬────────────┘
     │
     ├─► Verify credentials
     ├─► Generate JWT token
     │
     ▼
┌─────────────────┐
│  Client         │
└────┬────────────┘
     │
     ├─► Store token
     ├─► Include in Authorization header
     │
     ▼
┌─────────────────┐
│  API Request    │
└────┬────────────┘
     │
     ├─► Extract token
     ├─► Verify with Firebase Admin SDK
     │
     ▼
┌─────────────────┐
│  Authorized     │
│  Access         │
└─────────────────┘
```

## Cross-Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Core Logic                         │
│  • Encryption utilities (AES-256-GCM)                       │
│  • API client                                               │
│  • Business logic                                           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│     Web      │   │    Mobile    │   │   Desktop    │
│   (React)    │   │(React Native)│   │  (Electron)  │
│              │   │              │   │              │
│ • Next.js    │   │ • Expo       │   │ • Wraps Web  │
│ • Vercel     │   │ • iOS/Android│   │ • Win/Mac/Lin│
│ • Browser    │   │ • Biometric  │   │ • Native Menu│
└──────────────┘   └──────────────┘   └──────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Developer                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ├─► git push
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      GitHub                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ├─► Webhook
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vercel                                  │
│  • Build Next.js app                                        │
│  • Deploy to edge network                                   │
│  • Deploy serverless functions                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ├─► Live at: your-app.vercel.app
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Users                                   │
│  • Access via HTTPS                                         │
│  • Automatic SSL                                            │
│  • Global CDN                                               │
└─────────────────────────────────────────────────────────────┘
```
