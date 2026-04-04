# 🧪 FULL INTEGRATION TEST - EXECUTION GUIDE

## ✅ Prerequisites Confirmed
- Firebase project created
- Authentication enabled
- Firestore database created
- Environment variables configured
- Security rules deployed

---

## 🚀 START TESTING NOW

### STEP 1: Start the Application

```bash
cd obscura
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

✅ **Checkpoint:** Server running without errors

---

## 🧪 TEST SUITE 1: ENCRYPTION VALIDATION (5 min)

### Test 1.1: Browser Console Encryption Tests

1. Open http://localhost:3000
2. Press F12 to open DevTools
3. Go to Console tab
4. Copy and paste this code:

```javascript
console.log('🧪 OBSCURA ENCRYPTION TESTS\n');

// Test 1: Salt Generation
console.log('Test 1: Salt Generation');
const salt = crypto.getRandomValues(new Uint8Array(16));
console.log('✅ Salt:', salt.length, 'bytes');

// Test 2: Key Derivation
console.log('\nTest 2: Key Derivation');
async function testKeyDerivation() {
  const password = 'TestPassword123!';
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  console.log('✅ Key derived:', key.algorithm.name, key.algorithm.length, 'bits');
  return key;
}

// Test 3: Encryption/Decryption
console.log('\nTest 3: Encryption/Decryption');
async function testEncryptDecrypt() {
  const plaintext = 'Secret API Key: sk_test_123456789';
  const password = 'TestPassword123!';
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  
  // Derive key
  const passwordBuffer = encoder.encode(password);
  const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Encrypt
  const data = encoder.encode(plaintext);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, data);
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, encrypted);
  const decoder = new TextDecoder();
  const result = decoder.decode(decrypted);
  
  console.log('✅ Encrypted:', encrypted.byteLength, 'bytes');
  console.log('✅ Decrypted:', result);
  console.log('✅ Match:', result === plaintext);
}

// Run tests
(async () => {
  await testKeyDerivation();
  await testEncryptDecrypt();
  console.log('\n✅ All encryption tests passed!');
})();
```

✅ **Expected Result:** All tests show ✅

---

## 🧪 TEST SUITE 2: USER AUTHENTICATION (10 min)

### Test 2.1: User Signup

1. On http://localhost:3000, click **"Create new account"**
2. Enter:
   - **Email:** `test@obscura.com`
   - **Login Password:** `TestPass123!`
   - **Master Password:** `MasterPass123!`
3. Click **"Create Account"**

✅ **Expected Result:**
- Loading indicator appears
- Redirects to `/dashboard`
- No errors in console

📸 **Screenshot Checkpoint:** Dashboard loads

---

### Test 2.2: Verify User in Firebase

1. Open Firebase Console → Authentication
2. Check Users tab

✅ **Expected Result:**
- User `test@obscura.com` appears in list
- UID is generated
- Created timestamp is recent

---

### Test 2.3: Verify User Document in Firestore

1. Open Firebase Console → Firestore Database
2. Navigate to `users` collection
3. Find document with your user's UID

✅ **Expected Result:**
```
{
  uid: "abc123...",
  email: "test@obscura.com",
  salt: "base64_string_here",
  createdAt: "2024-..."
}
```

📸 **Screenshot Checkpoint:** User document exists with salt

---

### Test 2.4: Logout and Login

1. Click **"Logout"** button
2. Should redirect to login page
3. Enter:
   - **Email:** `test@obscura.com`
   - **Password:** `TestPass123!`
4. Click **"Sign In"**

✅ **Expected Result:**
- Redirects to `/unlock` screen
- Unlock screen shows 🔐 icon

---

### Test 2.5: Master Password Unlock

1. On unlock screen, enter: `MasterPass123!`
2. Click **"Unlock"**

✅ **Expected Result:**
- Redirects to `/dashboard`
- Dashboard loads successfully

---

## 🧪 TEST SUITE 3: VAULT OPERATIONS (20 min)

### Test 3.1: Create API Key

1. On dashboard, click **"+ Add New"**
2. Select **Type:** "API Key"
3. Enter:
   - **Title:** `GitHub API Key`
   - **API Key:** `ghp_1234567890abcdefghijklmnopqrstuvwxyz`
   - **URL:** `https://github.com`
   - **Category:** "Dev"
4. Click **"Save"**

✅ **Expected Result:**
- Modal closes
- New card appears with title "GitHub API Key"
- Value is masked (••••••••••••)
- Card shows 🔑 icon

📸 **Screenshot Checkpoint:** API Key card visible

---

### Test 3.2: Verify Encryption in Firestore

**CRITICAL SECURITY TEST**

1. Open Firebase Console → Firestore
2. Navigate to `vaultItems` collection
3. Find the item you just created
4. Inspect the document

✅ **Expected Result:**
```
{
  id: "auto_generated_id",
  userId: "your_user_id",
  type: "api",
  title: "GitHub API Key",
  encryptedData: "Aw8fK3mN9pQ..." (base64 gibberish - NOT plaintext),
  iv: "xY2zA1bC3..." (base64 string),
  category: "dev",
  createdAt: "2024-...",
  updatedAt: "2024-..."
}
```

🚨 **CRITICAL CHECK:**
- `encryptedData` should be **base64 gibberish**, NOT plaintext
- You should NOT see `ghp_1234567890abcdefghijklmnopqrstuvwxyz` anywhere
- `iv` should be a different base64 string

✅ **If you see plaintext:** ❌ ENCRYPTION FAILED - DO NOT PROCEED
✅ **If you see encrypted data:** ✅ ENCRYPTION WORKING

📸 **Screenshot Checkpoint:** Encrypted data in Firestore

---

### Test 3.3: Verify Network Security

**CRITICAL SECURITY TEST**

1. Open DevTools (F12) → Network tab
2. Click **"+ Add New"** on dashboard
3. Create another API key:
   - **Title:** `Stripe API Key`
   - **API Key:** `sk_test_abcdefghijklmnopqrstuvwxyz`
   - **Category:** "Work"
4. Click **"Save"**
5. In Network tab, find the POST request to `/api/vault`
6. Click on it → Go to **Payload** or **Request** tab

✅ **Expected Result:**
```json
{
  "type": "api",
  "title": "Stripe API Key",
  "encryptedData": "Bx9gL4nO0qR..." (base64 - NOT plaintext),
  "iv": "yZ3aB2cD4..." (base64),
  "category": "work"
}
```

🚨 **CRITICAL CHECK:**
- Request payload should contain `encryptedData` (base64)
- Should NOT contain `sk_test_abcdefghijklmnopqrstuvwxyz` in plaintext
- Master password should NOT be in any request

✅ **If you see plaintext in network:** ❌ SECURITY BREACH
✅ **If you see only encrypted data:** ✅ SECURE

📸 **Screenshot Checkpoint:** Network request shows encrypted data

---

### Test 3.4: Show/Hide Value

1. On the "GitHub API Key" card, click the **eye icon** (👁️)
2. Value should become visible
3. Click again to hide

✅ **Expected Result:**
- First click: Shows `ghp_1234567890abcdefghijklmnopqrstuvwxyz`
- Second click: Hides value (••••••••••••)

---

### Test 3.5: Copy to Clipboard

1. On any vault card, click the **clipboard icon** (📋)
2. Icon should change to ✓
3. Open a text editor and paste (Ctrl+V)

✅ **Expected Result:**
- Copied value matches the actual API key
- Icon shows ✓ for 2 seconds

---

### Test 3.6: Create Password

1. Click **"+ Add New"**
2. Select **Type:** "Password"
3. Enter:
   - **Title:** `Gmail Account`
   - **Username:** `test@gmail.com`
   - **Password:** `SecurePass123!@#`
   - **URL:** `https://gmail.com`
   - **Category:** "Personal"
4. Click **"Save"**

✅ **Expected Result:**
- Password card appears with 🔐 icon
- Shows username and masked password
- URL displayed below

---

### Test 3.7: Create Secure Note

1. Click **"+ Add New"**
2. Select **Type:** "Secure Note"
3. Enter:
   - **Title:** `Server Credentials`
   - **Content:** 
     ```
     SSH: user@server.com
     Password: admin123
     Port: 22
     ```
   - **Category:** "Work"
4. Click **"Save"**

✅ **Expected Result:**
- Note card appears with 📝 icon
- Shows content preview

---

### Test 3.8: Edit Item

1. Click **edit icon** (✏️) on "Gmail Account" card
2. Change:
   - **Title:** `Gmail Work Account`
   - **Username:** `work@gmail.com`
3. Click **"Save"**

✅ **Expected Result:**
- Card updates with new title
- Username changes
- `updatedAt` timestamp updates in Firestore

---

### Test 3.9: Delete Item

1. Click **delete icon** (🗑️) on "Stripe API Key" card
2. Confirmation dialog appears
3. Click **"OK"**

✅ **Expected Result:**
- Card disappears from dashboard
- Item removed from Firestore
- Other items remain

---

## 🧪 TEST SUITE 4: SEARCH & FILTER (5 min)

### Test 4.1: Search Functionality

1. In search box, type: `GitHub`

✅ **Expected Result:**
- Only "GitHub API Key" card visible
- Other cards hidden

2. Clear search box

✅ **Expected Result:**
- All cards reappear

---

### Test 4.2: Filter by Type

1. Select **"API Keys"** from dropdown

✅ **Expected Result:**
- Only API key cards visible
- Password and note cards hidden

2. Select **"Passwords"**

✅ **Expected Result:**
- Only password cards visible

3. Select **"Notes"**

✅ **Expected Result:**
- Only note cards visible

4. Select **"All Types"**

✅ **Expected Result:**
- All cards visible again

---

### Test 4.3: Combined Search and Filter

1. Select **"API Keys"** from dropdown
2. Type `GitHub` in search

✅ **Expected Result:**
- Only "GitHub API Key" visible
- Filters work together

---

## 🧪 TEST SUITE 5: SECURITY TESTS (10 min)

### Test 5.1: Wrong Master Password

1. Logout
2. Login with email/password
3. On unlock screen, enter: `WrongPassword123!`
4. Click **"Unlock"**

✅ **Expected Result:**
- Decryption fails
- Error message appears
- Dashboard does not load

---

### Test 5.2: Session Persistence

1. Unlock vault with correct master password
2. Refresh page (F5)

✅ **Expected Result:**
- Vault remains unlocked
- Items still visible
- No need to re-enter master password

---

### Test 5.3: Session Clearing on Logout

1. Click **"Logout"**
2. Open DevTools → Application → Session Storage
3. Check `sessionStorage`

✅ **Expected Result:**
- `masterPassword` removed
- `salt` removed
- All session data cleared

---

### Test 5.4: Unauthorized Access Test

1. Logout completely
2. Try to access: `http://localhost:3000/dashboard`

✅ **Expected Result:**
- Redirects to login page
- Cannot access dashboard without authentication

---

### Test 5.5: Cross-User Isolation Test

**If you have time, create a second user:**

1. Logout
2. Create new account: `test2@obscura.com`
3. Create some vault items
4. Check Firestore

✅ **Expected Result:**
- User 1 items have `userId: user1_id`
- User 2 items have `userId: user2_id`
- Users cannot see each other's items

---

## 🧪 TEST SUITE 6: UI/UX TESTS (5 min)

### Test 6.1: Responsive Design

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these sizes:
   - **iPhone SE:** 375x667
   - **iPad:** 768x1024
   - **Desktop:** 1920x1080

✅ **Expected Result:**
- Layout adapts to all screen sizes
- No horizontal scrolling
- Buttons remain accessible

---

### Test 6.2: Loading States

1. Create a new vault item
2. Observe loading state

✅ **Expected Result:**
- Button shows "Saving..." during save
- Loading indicator appears
- Button returns to normal after save

---

### Test 6.3: Error Handling

1. Turn off internet connection
2. Try to create a vault item

✅ **Expected Result:**
- Error message appears
- User-friendly error text
- No app crash

---

## 📊 TEST RESULTS SUMMARY

### ✅ PASS/FAIL CHECKLIST

#### Encryption Tests
- [ ] Salt generation works
- [ ] Key derivation works
- [ ] Encryption works
- [ ] Decryption works
- [ ] Data encrypted in Firestore (**CRITICAL**)
- [ ] Only encrypted data in network requests (**CRITICAL**)

#### Authentication Tests
- [ ] User signup works
- [ ] User login works
- [ ] Master password unlock works
- [ ] Logout works
- [ ] Session management works

#### Vault Operations
- [ ] Create API key works
- [ ] Create password works
- [ ] Create note works
- [ ] Edit item works
- [ ] Delete item works
- [ ] Show/hide value works
- [ ] Copy to clipboard works

#### Search & Filter
- [ ] Search works
- [ ] Filter by type works
- [ ] Combined search/filter works

#### Security Tests
- [ ] Wrong master password fails (**CRITICAL**)
- [ ] Data encrypted in database (**CRITICAL**)
- [ ] Master password not in network (**CRITICAL**)
- [ ] Session clears on logout
- [ ] Unauthorized access blocked
- [ ] Cross-user isolation works

#### UI/UX Tests
- [ ] Responsive design works
- [ ] Loading states work
- [ ] Error handling works

---

## 🎉 SUCCESS CRITERIA

**Application is PRODUCTION READY if:**

✅ All encryption tests pass  
✅ Data is encrypted in Firestore  
✅ Only encrypted data sent over network  
✅ Master password never transmitted  
✅ All CRUD operations work  
✅ Search and filter work  
✅ Security tests pass  
✅ UI is responsive  

---

## 🚨 CRITICAL FAILURES

**DO NOT DEPLOY if:**

❌ Plaintext data visible in Firestore  
❌ Plaintext data in network requests  
❌ Master password transmitted to server  
❌ Wrong password allows decryption  
❌ Users can access other users' data  

---

## 📸 REQUIRED SCREENSHOTS

Take screenshots of:
1. ✅ Dashboard with vault items
2. ✅ Encrypted data in Firestore
3. ✅ Network request with encrypted payload
4. ✅ Successful decryption in UI
5. ✅ Responsive design on mobile

---

## 🎯 NEXT STEPS AFTER TESTING

If all tests pass:
1. ✅ Deploy to Vercel: `vercel --prod`
2. ✅ Test on production URL
3. ✅ Monitor logs
4. ✅ Share with users

If tests fail:
1. ❌ Review error messages
2. ❌ Check Firebase configuration
3. ❌ Review DEPLOYMENT.md
4. ❌ Check environment variables

---

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🧪 INTEGRATION TESTING COMPLETE                 ║
║                                                              ║
║         Follow each test step carefully                      ║
║         Mark checkboxes as you complete tests                ║
║                                                              ║
║         CRITICAL: Verify encryption in Firestore!            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Start testing now! Report any failures immediately. 🚀**
