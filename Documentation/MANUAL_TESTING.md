# 🧪 MANUAL TESTING GUIDE

## Prerequisites

Before testing, you need:
1. ✅ Node.js 18+ installed
2. ✅ Firebase project created
3. ✅ Environment variables configured in `.env.local`

---

## 🚀 STEP 1: Install Dependencies

```bash
cd obscura
npm install
```

**Expected Output:**
```
added 300+ packages
```

**✅ Success Criteria:** No errors during installation

---

## 🔥 STEP 2: Setup Firebase (If Not Done)

### Option A: Use Test Mode (Quick Test)
For quick testing without Firebase:
1. The app will show errors but you can test the UI
2. Encryption tests will work in browser console

### Option B: Full Firebase Setup (Recommended)
1. Go to https://console.firebase.google.com/
2. Create new project "obscura-test"
3. Enable Authentication → Email/Password
4. Create Firestore Database (test mode)
5. Copy config to `.env.local`

---

## 🧪 STEP 3: Test Encryption (Browser Console)

### 3.1 Start Dev Server
```bash
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

### 3.2 Open Browser
1. Open http://localhost:3000
2. Open DevTools (F12)
3. Go to Console tab

### 3.3 Run Encryption Tests
Copy and paste the contents of `test-encryption.js` into the console.

**Expected Output:**
```
🧪 Starting Obscura Encryption Tests...

Test 1: Generate Salt
✅ Salt generated: 16 bytes

Test 2: Key Derivation (PBKDF2)
✅ Key derived successfully
   Algorithm: AES-GCM
   Key length: 256 bits

Test 3: AES-256-GCM Encryption
✅ Encryption successful
   Plaintext length: 35 chars
   Encrypted length: 51 bytes
   IV length: 12 bytes

Test 4: AES-256-GCM Decryption
✅ Decryption successful
   Decrypted text: Secret API Key: sk_test_123456789

Test 5: Wrong Password Should Fail
✅ Correctly failed with wrong password

Test 6: Unique IVs for Each Encryption
✅ IVs are unique

Test 7: Base64 Encoding/Decoding
✅ Base64 encoding/decoding works

✅ All encryption tests completed!
```

**✅ Success Criteria:** All tests show ✅

---

## 🎨 STEP 4: Test UI Components

### 4.1 Test Login Page
1. Visit http://localhost:3000
2. Check that you see:
   - 🔒 Obscura logo
   - Email input field
   - Login Password input field
   - Sign In button
   - Create new account button

**✅ Success Criteria:** All elements visible and styled correctly

### 4.2 Test Signup Flow (Without Firebase)
1. Click "Create new account"
2. Check that you see:
   - Master Password field appears
   - Warning message about password recovery
   - Form validation works

**✅ Success Criteria:** UI updates correctly

### 4.3 Test Responsive Design
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**✅ Success Criteria:** Layout adapts to all screen sizes

---

## 🔐 STEP 5: Test With Firebase (Full Integration)

### 5.1 Configure Firebase
Update `.env.local` with your actual Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY\n-----END PRIVATE KEY-----\n"
```

### 5.2 Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 5.3 Test Signup
1. Go to http://localhost:3000
2. Click "Create new account"
3. Enter:
   - Email: test@example.com
   - Password: TestPass123!
   - Master Password: MasterPass123!
4. Click "Create Account"

**Expected Behavior:**
- Loading state appears
- Redirects to dashboard
- No errors in console

**✅ Success Criteria:** Account created successfully

### 5.4 Verify in Firebase Console
1. Go to Firebase Console → Authentication
2. Check that user appears in Users list
3. Go to Firestore Database
4. Check that `users` collection has document with:
   - uid
   - email
   - salt (base64 string)

**✅ Success Criteria:** User data stored correctly

---

## 📦 STEP 6: Test Vault Operations

### 6.1 Test Create API Key
1. On dashboard, click "+ Add New"
2. Select Type: "API Key"
3. Enter:
   - Title: "GitHub API Key"
   - API Key: "ghp_test123456789"
   - URL: "https://github.com"
   - Category: "Dev"
4. Click "Save"

**Expected Behavior:**
- Modal closes
- New card appears in dashboard
- Card shows title and masked value

**✅ Success Criteria:** Item created and displayed

### 6.2 Verify Encryption in Firestore
1. Go to Firebase Console → Firestore
2. Open `vaultItems` collection
3. Find the item you just created
4. Check fields:
   - `encryptedData`: Should be base64 gibberish (NOT plaintext)
   - `iv`: Should be base64 string
   - `title`: "GitHub API Key" (not encrypted)
   - `type`: "api"

**✅ Success Criteria:** Data is encrypted in database

### 6.3 Test Show/Hide Value
1. On the vault card, click the eye icon (👁️)
2. Value should become visible
3. Click again to hide

**✅ Success Criteria:** Toggle works correctly

### 6.4 Test Copy to Clipboard
1. Click the clipboard icon (📋)
2. Icon should change to ✓
3. Paste somewhere (Ctrl+V)
4. Should paste the actual API key value

**✅ Success Criteria:** Copy works correctly

### 6.5 Test Create Password
1. Click "+ Add New"
2. Select Type: "Password"
3. Enter:
   - Title: "Gmail Account"
   - Username: "test@gmail.com"
   - Password: "SecurePass123!"
   - URL: "https://gmail.com"
4. Click "Save"

**✅ Success Criteria:** Password item created

### 6.6 Test Create Note
1. Click "+ Add New"
2. Select Type: "Secure Note"
3. Enter:
   - Title: "Server Credentials"
   - Content: "SSH: user@server.com\nPassword: admin123"
4. Click "Save"

**✅ Success Criteria:** Note item created

### 6.7 Test Search
1. Type "GitHub" in search box
2. Should filter to show only GitHub item
3. Clear search
4. All items should appear again

**✅ Success Criteria:** Search filters correctly

### 6.8 Test Filter
1. Select "API Keys" from dropdown
2. Should show only API key items
3. Select "Passwords"
4. Should show only password items
5. Select "All Types"
6. Should show all items

**✅ Success Criteria:** Filter works correctly

### 6.9 Test Edit
1. Click edit icon (✏️) on any item
2. Modal opens with existing data
3. Change title to "Updated Title"
4. Click "Save"
5. Card updates with new title

**✅ Success Criteria:** Edit works correctly

### 6.10 Test Delete
1. Click delete icon (🗑️) on any item
2. Confirmation dialog appears
3. Click "OK"
4. Item disappears from dashboard
5. Check Firestore - item should be deleted

**✅ Success Criteria:** Delete works correctly

---

## 🔒 STEP 7: Test Security

### 7.1 Test Master Password Lock
1. Close browser tab
2. Open new tab to http://localhost:3000
3. Should redirect to unlock screen
4. Enter master password
5. Should unlock vault

**✅ Success Criteria:** Unlock works correctly

### 7.2 Test Wrong Master Password
1. Logout and login again
2. On unlock screen, enter wrong password
3. Should show decryption error

**✅ Success Criteria:** Wrong password fails

### 7.3 Test Network Security
1. Open DevTools → Network tab
2. Create a new vault item
3. Find the POST request to `/api/vault`
4. Check request payload:
   - Should contain `encryptedData` (base64)
   - Should contain `iv` (base64)
   - Should NOT contain plaintext

**✅ Success Criteria:** Only encrypted data sent

### 7.4 Test Logout
1. Click "Logout" button
2. Should redirect to login page
3. Try to access http://localhost:3000/dashboard
4. Should redirect to login

**✅ Success Criteria:** Session cleared properly

---

## 🌐 STEP 8: Test Cross-Browser

Test in multiple browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari (if on Mac)

**✅ Success Criteria:** Works in all browsers

---

## 📱 STEP 9: Test Mobile Responsive

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on:
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - Samsung Galaxy S20 (360x800)

**✅ Success Criteria:** UI works on all devices

---

## ⚡ STEP 10: Test Performance

### 10.1 Test Load Time
1. Open DevTools → Network tab
2. Reload page
3. Check load time (should be < 2 seconds)

**✅ Success Criteria:** Fast load time

### 10.2 Test Encryption Speed
1. Create 10 vault items quickly
2. Should not freeze UI
3. Each operation should complete in < 1 second

**✅ Success Criteria:** Fast encryption/decryption

---

## 🐛 STEP 11: Test Error Handling

### 11.1 Test Network Error
1. Turn off internet
2. Try to create vault item
3. Should show error message

**✅ Success Criteria:** Error handled gracefully

### 11.2 Test Invalid Input
1. Try to create item with empty title
2. Should show validation error

**✅ Success Criteria:** Validation works

---

## 📊 TEST RESULTS CHECKLIST

### Encryption Tests
- [ ] Salt generation works
- [ ] Key derivation works
- [ ] Encryption works
- [ ] Decryption works
- [ ] Wrong password fails
- [ ] Unique IVs generated
- [ ] Base64 encoding works

### UI Tests
- [ ] Login page displays correctly
- [ ] Signup flow works
- [ ] Responsive design works
- [ ] All components render

### Integration Tests (With Firebase)
- [ ] User signup works
- [ ] User login works
- [ ] Master password unlock works
- [ ] Create API key works
- [ ] Create password works
- [ ] Create note works
- [ ] Search works
- [ ] Filter works
- [ ] Edit works
- [ ] Delete works
- [ ] Copy to clipboard works
- [ ] Show/hide works

### Security Tests
- [ ] Data encrypted in Firestore
- [ ] Only encrypted data sent over network
- [ ] Master password never transmitted
- [ ] Wrong password fails
- [ ] Logout clears session
- [ ] Unauthorized access blocked

### Performance Tests
- [ ] Fast load time (< 2s)
- [ ] Fast encryption (< 1s)
- [ ] No UI freezing

### Cross-Platform Tests
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Edge
- [ ] Works in Safari
- [ ] Works on mobile

---

## 🎉 SUCCESS CRITERIA

**All tests pass if:**
- ✅ All encryption tests show ✅
- ✅ All UI components work
- ✅ All CRUD operations work
- ✅ Data is encrypted in database
- ✅ Only encrypted data sent over network
- ✅ Master password never transmitted
- ✅ Works in all browsers
- ✅ Responsive on all devices

---

## 🚨 Common Issues & Solutions

### Issue: "Module not found"
**Solution:** Run `npm install`

### Issue: "Firebase not configured"
**Solution:** Check `.env.local` has correct values

### Issue: "Decryption failed"
**Solution:** Check master password is correct

### Issue: "Unauthorized"
**Solution:** Check Firebase Admin SDK credentials

### Issue: "CORS error"
**Solution:** Ensure API routes are on same domain

---

## 📞 Need Help?

1. Check browser console for errors
2. Check `.env.local` configuration
3. Check Firebase Console for data
4. Review DEPLOYMENT.md for setup steps
5. Review SECURITY.md for encryption details

---

**Ready to test? Start with STEP 1! 🚀**
