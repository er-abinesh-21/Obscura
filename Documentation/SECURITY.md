# Security Architecture & Best Practices

## 🔐 Encryption Implementation

### End-to-End Encryption Flow

```
User Input → Client-Side Encryption → Encrypted Storage → Client-Side Decryption → User Display
                    ↓                         ↓
              Master Password          Server NEVER sees
              (Never sent)             plaintext data
```

### Encryption Specifications

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Size**: 256 bits
- **IV Size**: 96 bits (12 bytes)
- **Authentication**: Built-in with GCM mode
- **Key Derivation**: PBKDF2
  - Iterations: 100,000
  - Hash: SHA-256
  - Salt: 128 bits (16 bytes) per user

### Why AES-256-GCM?

1. **Authenticated Encryption**: Provides both confidentiality and integrity
2. **NIST Approved**: Recommended by NIST for sensitive data
3. **Performance**: Hardware acceleration available on modern CPUs
4. **Security**: No known practical attacks

## 🔑 Key Management

### Master Password System

```javascript
// NEVER do this:
❌ sendToServer({ masterPassword: password })

// ALWAYS do this:
✅ const key = deriveKey(masterPassword, salt);
✅ const encrypted = encrypt(data, key);
✅ sendToServer({ encryptedData, iv });
```

### Key Derivation Process

1. User enters master password
2. Retrieve user's unique salt from server
3. Derive encryption key using PBKDF2
4. Use key for encryption/decryption
5. Key exists only in memory, never stored

### Salt Storage

- Each user has unique salt
- Salt stored in Firestore (not secret)
- Salt generated on signup using crypto.getRandomValues()
- 16 bytes (128 bits) of entropy

## 🛡️ Security Layers

### Layer 1: Transport Security
- HTTPS enforced by Vercel
- TLS 1.3 for all connections
- Certificate pinning (optional for mobile)

### Layer 2: Authentication
- Firebase Authentication
- JWT tokens with expiration
- Token verification on every API call
- Session management

### Layer 3: Authorization
- Firestore security rules
- Per-user data isolation
- Server-side validation

### Layer 4: Data Encryption
- Client-side encryption before transmission
- Zero-knowledge architecture
- Encrypted data at rest

### Layer 5: Application Security
- Input sanitization
- XSS prevention
- CSRF protection
- Rate limiting

## 🔒 Firestore Security Rules Explained

```javascript
// Only authenticated users can access
allow read, write: if request.auth != null

// Only owner can access their data
allow read: if resource.data.userId == request.auth.uid

// Validate data structure on create
allow create: if request.resource.data.keys().hasAll(['userId', 'encryptedData', 'iv'])

// Prevent userId tampering
allow update: if request.resource.data.userId == request.auth.uid
```

## 🚨 Threat Model

### Threats Mitigated

✅ **Server Compromise**: Server never has plaintext data
✅ **Database Breach**: All data encrypted
✅ **Man-in-the-Middle**: HTTPS + encrypted payloads
✅ **Unauthorized Access**: Authentication + authorization
✅ **Data Tampering**: GCM authentication tag
✅ **Replay Attacks**: Unique IV per encryption

### Threats NOT Mitigated

⚠️ **Client Compromise**: Malware on user's device
⚠️ **Master Password Loss**: No recovery mechanism
⚠️ **Phishing**: User gives credentials to attacker
⚠️ **Keylogger**: Captures master password input
⚠️ **Physical Access**: Unlocked device

## 🔐 Password Security

### Master Password Requirements

- Minimum 8 characters (recommend 16+)
- Mix of uppercase, lowercase, numbers, symbols
- Not stored anywhere
- Cannot be recovered if lost

### Login Password vs Master Password

| Feature | Login Password | Master Password |
|---------|---------------|-----------------|
| Purpose | Firebase authentication | Data encryption |
| Stored | Firebase (hashed) | Never stored |
| Recoverable | Yes (email reset) | No |
| Required | Every login | Every unlock |

## 🛠️ Security Recommendations

### For Users

1. **Use Strong Master Password**: 16+ characters, unique
2. **Enable MFA**: Add second factor to Firebase Auth
3. **Lock When Idle**: Enable auto-lock feature
4. **Secure Device**: Use device encryption, screen lock
5. **Backup Carefully**: Export backups are still encrypted

### For Developers

1. **Regular Updates**: Keep dependencies updated
2. **Security Audits**: Regular code reviews
3. **Penetration Testing**: Test for vulnerabilities
4. **Monitoring**: Log suspicious activities
5. **Incident Response**: Have a plan for breaches

## 🔍 Security Audit Checklist

### Code Review
- [ ] No hardcoded secrets
- [ ] Input validation on all endpoints
- [ ] Output encoding to prevent XSS
- [ ] CSRF tokens on state-changing operations
- [ ] Rate limiting on authentication endpoints

### Encryption
- [ ] Master password never sent to server
- [ ] Unique IV for each encryption
- [ ] Salt stored securely
- [ ] Key derivation uses sufficient iterations
- [ ] Encrypted data includes authentication tag

### Authentication
- [ ] Firebase tokens verified on every request
- [ ] Tokens expire appropriately
- [ ] Session management secure
- [ ] Logout clears all sensitive data

### Authorization
- [ ] Firestore rules enforce per-user access
- [ ] Server validates user ownership
- [ ] No privilege escalation possible

### Infrastructure
- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] Secrets not in version control
- [ ] Logging doesn't expose sensitive data

## 🚀 Production Hardening

### Environment Variables
```bash
# Use Vercel secrets
vercel secrets add firebase-private-key "$(cat private-key.pem)"
```

### Rate Limiting
```javascript
// Add to API routes
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://*.firebaseio.com https://*.googleapis.com">
```

### Security Headers
```javascript
// Add to next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' }
        ]
      }
    ]
  }
}
```

## 📊 Compliance Considerations

### GDPR
- User data encrypted
- Right to deletion (delete user account)
- Data portability (export feature)
- Privacy by design

### HIPAA (if storing health data)
- Encryption at rest and in transit
- Access controls
- Audit logging
- Business Associate Agreement needed

## 🔄 Incident Response

### If Master Password Compromised
1. User must change master password
2. Re-encrypt all vault items with new key
3. Invalidate old sessions

### If Server Compromised
1. Encrypted data remains secure
2. Rotate Firebase credentials
3. Audit access logs
4. Notify users (if required)

### If Database Breached
1. Encrypted data useless without master passwords
2. Rotate salts (requires user re-encryption)
3. Force password resets
4. Investigate breach source

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cryptographic Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
