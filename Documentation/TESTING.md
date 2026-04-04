# Testing & Validation Guide

## 🧪 Manual Testing Checklist

### Authentication Flow

#### Signup
- [ ] Create account with valid email/password
- [ ] Set master password (min 8 chars)
- [ ] Verify user created in Firebase Auth
- [ ] Verify user document created in Firestore with salt
- [ ] Redirect to dashboard after signup

#### Login
- [ ] Login with correct credentials
- [ ] Verify redirect to unlock screen
- [ ] Login with incorrect password fails
- [ ] Login with non-existent email fails

#### Unlock
- [ ] Enter correct master password unlocks vault
- [ ] Enter incorrect master password shows error
- [ ] Unlock screen appears after login
- [ ] Session persists on page refresh

#### Logout
- [ ] Logout clears session
- [ ] Logout redirects to login
- [ ] Cannot access dashboard after logout

### Vault Operations

#### Create Items
- [ ] Create API key with title and key value
- [ ] Create password with username/password/URL
- [ ] Create secure note with content
- [ ] Verify item appears in dashboard
- [ ] Verify item stored encrypted in Firestore
- [ ] Verify IV is unique for each item

#### Read Items
- [ ] All items load on dashboard
- [ ] Items decrypt correctly
- [ ] Show/hide toggle works
- [ ] Copy to clipboard works
- [ ] Copy shows confirmation

#### Update Items
- [ ] Edit item opens modal with existing data
- [ ] Update saves changes
- [ ] Updated timestamp changes
- [ ] Changes persist after refresh

#### Delete Items
- [ ] Delete confirmation appears
- [ ] Delete removes item from dashboard
- [ ] Delete removes item from Firestore
- [ ] Cannot access deleted item

### Search & Filter

- [ ] Search by title works
- [ ] Search is case-insensitive
- [ ] Filter by type (API/Password/Note) works
- [ ] Filter "All Types" shows everything
- [ ] Empty state shows when no results

### Security

#### Encryption
- [ ] Data encrypted before sending to server
- [ ] Master password never in network requests
- [ ] Each item has unique IV
- [ ] Decryption fails with wrong master password
- [ ] Firestore contains only encrypted data

#### Authorization
- [ ] Cannot access other users' items
- [ ] API returns 401 without auth token
- [ ] API returns 403 for unauthorized access
- [ ] Firestore rules prevent unauthorized reads

#### Session Management
- [ ] Session expires appropriately
- [ ] Locked vault requires master password
- [ ] Cannot bypass unlock screen
- [ ] Session data cleared on logout

## 🔍 Security Testing

### Encryption Validation

```javascript
// Test in browser console
const { encryptData, decryptData, generateSalt } = require('./utils/encryption');

// Test encryption/decryption
const salt = generateSalt();
const masterPassword = 'TestPassword123!';
const plaintext = 'Secret data';

const { encryptedData, iv } = await encryptData(plaintext, masterPassword, salt);
console.log('Encrypted:', encryptedData);

const decrypted = await decryptData(encryptedData, iv, masterPassword, salt);
console.log('Decrypted:', decrypted);
console.assert(decrypted === plaintext, 'Decryption failed');

// Test with wrong password
try {
  await decryptData(encryptedData, iv, 'WrongPassword', salt);
  console.error('Should have failed with wrong password');
} catch (e) {
  console.log('Correctly failed with wrong password');
}
```

### Network Inspection

1. Open browser DevTools → Network tab
2. Perform vault operations
3. Inspect requests to `/api/vault`
4. Verify:
   - ✅ Only encrypted data in request body
   - ✅ No plaintext passwords/keys
   - ✅ Authorization header present
   - ✅ HTTPS used

### Firestore Inspection

1. Open Firebase Console → Firestore
2. Navigate to `vaultItems` collection
3. Verify:
   - ✅ `encryptedData` is base64 gibberish
   - ✅ No plaintext visible
   - ✅ `iv` present and unique
   - ✅ `userId` matches authenticated user

### Authentication Testing

```bash
# Test without auth token
curl https://your-app.vercel.app/api/vault

# Should return 401 Unauthorized

# Test with invalid token
curl -H "Authorization: Bearer invalid_token" \
     https://your-app.vercel.app/api/vault

# Should return 401 Unauthorized
```

## 🚀 Performance Testing

### Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] Encryption/decryption is fast (< 100ms per item)
- [ ] No UI freezing during operations

### Scalability
- [ ] Test with 100+ vault items
- [ ] Test with large notes (10KB+)
- [ ] Test with long API keys

### Memory
- [ ] No memory leaks on repeated operations
- [ ] Session storage cleared properly
- [ ] No sensitive data in memory after logout

## 🐛 Error Handling

### Network Errors
- [ ] Offline mode shows error
- [ ] Failed API calls show user-friendly message
- [ ] Retry mechanism for transient failures

### Validation Errors
- [ ] Empty fields show validation errors
- [ ] Invalid email format rejected
- [ ] Short passwords rejected
- [ ] XSS attempts sanitized

### Edge Cases
- [ ] Very long titles handled
- [ ] Special characters in passwords work
- [ ] Unicode characters supported
- [ ] Concurrent edits handled

## 📊 Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 🔐 Penetration Testing

### SQL Injection
- [ ] Try SQL injection in all input fields
- [ ] Firestore is NoSQL (not vulnerable)

### XSS (Cross-Site Scripting)
```javascript
// Test in title field
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>

// Should be sanitized/escaped
```

### CSRF (Cross-Site Request Forgery)
- [ ] Firebase tokens prevent CSRF
- [ ] State-changing operations require auth

### Session Hijacking
- [ ] Tokens expire appropriately
- [ ] Cannot reuse old tokens
- [ ] Logout invalidates session

### Brute Force
- [ ] Rate limiting on login attempts
- [ ] Account lockout after failures
- [ ] CAPTCHA for repeated failures

## 📱 Mobile Testing (React Native)

- [ ] Touch interactions work
- [ ] Keyboard doesn't cover inputs
- [ ] Biometric authentication works
- [ ] Secure storage persists
- [ ] App works offline (cached data)
- [ ] Push notifications (if implemented)

## 🖥️ Desktop Testing (Electron)

- [ ] App launches successfully
- [ ] Menu bar works
- [ ] Keyboard shortcuts work
- [ ] Auto-update works (if implemented)
- [ ] System tray icon works
- [ ] Window state persists

## 🔄 Regression Testing

After each update:
- [ ] All existing features still work
- [ ] No new security vulnerabilities
- [ ] Performance not degraded
- [ ] UI not broken

## 📝 Test Data

### Valid Test Accounts
```
Email: test@example.com
Password: TestPassword123!
Master Password: MasterPass123!
```

### Test Vault Items

**API Key:**
```
Title: GitHub API Key
Key: ghp_1234567890abcdefghijklmnopqrstuvwxyz
URL: https://github.com
```

**Password:**
```
Title: Gmail Account
Username: test@gmail.com
Password: SecurePass123!@#
URL: https://gmail.com
```

**Note:**
```
Title: Server Credentials
Content: SSH: user@server.com
Password: admin123
Port: 22
```

## 🎯 Acceptance Criteria

### Must Have
- ✅ User can signup and login
- ✅ User can create/read/update/delete vault items
- ✅ All data encrypted end-to-end
- ✅ Master password never sent to server
- ✅ Search and filter work
- ✅ Copy to clipboard works

### Should Have
- ✅ Show/hide sensitive values
- ✅ Categories for organization
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

### Nice to Have
- ⏳ Auto-lock after inactivity
- ⏳ Export/import backup
- ⏳ Password strength indicator
- ⏳ Biometric unlock (mobile)
- ⏳ Dark mode

## 🚨 Critical Issues (Block Release)

- [ ] Data loss on operations
- [ ] Encryption not working
- [ ] Unauthorized access possible
- [ ] Master password exposed
- [ ] App crashes on launch

## ⚠️ Major Issues (Fix Before Release)

- [ ] Slow performance (> 5s load)
- [ ] UI completely broken
- [ ] Cannot create/edit items
- [ ] Search not working
- [ ] Memory leaks

## 📋 Minor Issues (Can Release)

- [ ] UI alignment issues
- [ ] Typos in text
- [ ] Missing tooltips
- [ ] Inconsistent styling
- [ ] Minor UX improvements

## ✅ Release Checklist

- [ ] All critical tests pass
- [ ] Security audit completed
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Firebase rules deployed
- [ ] Vercel deployment successful
- [ ] SSL certificate valid
- [ ] Monitoring enabled
- [ ] Backup strategy in place
