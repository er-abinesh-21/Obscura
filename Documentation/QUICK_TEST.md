# ✅ PRE-FLIGHT CHECK - VERIFY SETUP

## Your Firebase Configuration

✅ **Firebase Project ID:** obscura-23926  
✅ **Auth Domain:** obscura-23926.firebaseapp.com  
✅ **Environment Variables:** Configured  

---

## 🚀 START TESTING NOW

### STEP 1: Install Dependencies (if not done)

```bash
cd "C:\Users\76bab\Downloads\My Projects\obscura"
npm install
```

---

### STEP 2: Start Development Server

```bash
npm run dev
```

**Wait for:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

---

### STEP 3: Open Application

Open your browser and go to:
```
http://localhost:3000
```

---

## 🧪 QUICK TEST SEQUENCE (30 minutes)

### ✅ TEST 1: Encryption (5 min)

1. Open browser console (F12)
2. Paste this code:

```javascript
console.log('🧪 Testing Encryption...\n');

async function quickEncryptionTest() {
  const plaintext = 'Secret: sk_test_123456789';
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
  
  console.log('✅ Plaintext:', plaintext);
  console.log('✅ Encrypted:', encrypted.byteLength, 'bytes');
  console.log('✅ Decrypted:', result);
  console.log('✅ Match:', result === plaintext ? 'YES' : 'NO');
  
  if (result === plaintext) {
    console.log('\n🎉 ENCRYPTION TEST PASSED!');
  } else {
    console.error('\n❌ ENCRYPTION TEST FAILED!');
  }
}

quickEncryptionTest();
```

**Expected:** `🎉 ENCRYPTION TEST PASSED!`

---

### ✅ TEST 2: Create Account (3 min)

1. Click **"Create new account"**
2. Enter:
   - Email: `test@obscura.com`
   - Password: `TestPass123!`
   - Master Password: `MasterPass123!`
3. Click **"Create Account"**

**Expected:** Redirects to dashboard

---

### ✅ TEST 3: Create API Key (2 min)

1. Click **"+ Add New"**
2. Select Type: **"API Key"**
3. Enter:
   - Title: `GitHub API Key`
   - API Key: `ghp_test123456789abcdefghijklmnop`
   - URL: `https://github.com`
   - Category: **"Dev"**
4. Click **"Save"**

**Expected:** Card appears with 🔑 icon

---

### ✅ TEST 4: CRITICAL - Verify Encryption in Firestore (5 min)

**THIS IS THE MOST IMPORTANT TEST!**

1. Open new tab: https://console.firebase.google.com/
2. Select project: **obscura-23926**
3. Go to **Firestore Database**
4. Click on **vaultItems** collection
5. Click on the document you just created
6. Look at the **encryptedData** field

**CRITICAL CHECK:**

❌ **FAIL if you see:** `ghp_test123456789abcdefghijklmnop` (plaintext)

✅ **PASS if you see:** Something like `Aw8fK3mN9pQ2rS5tU...` (base64 gibberish)

**Screenshot this!**

---

### ✅ TEST 5: Verify Network Security (5 min)

1. Open DevTools (F12) → **Network** tab
2. Click **"+ Add New"**
3. Create another item:
   - Type: **"Password"**
   - Title: `Gmail`
   - Username: `test@gmail.com`
   - Password: `SecurePass123!`
4. Click **"Save"**
5. In Network tab, find POST to `/api/vault`
6. Click it → View **Payload**

**CRITICAL CHECK:**

❌ **FAIL if you see:** `SecurePass123!` in plaintext

✅ **PASS if you see:** `encryptedData: "Bx9gL4nO0qR..."` (base64)

**Screenshot this!**

---

### ✅ TEST 6: Show/Hide & Copy (2 min)

1. On GitHub API Key card, click **eye icon** (👁️)
2. Should show: `ghp_test123456789abcdefghijklmnop`
3. Click **clipboard icon** (📋)
4. Paste in notepad (Ctrl+V)

**Expected:** Copied value matches

---

### ✅ TEST 7: Search & Filter (2 min)

1. Type `GitHub` in search box
2. Should show only GitHub card
3. Clear search
4. Select **"API Keys"** from dropdown
5. Should show only API keys

**Expected:** Filtering works

---

### ✅ TEST 8: Edit Item (2 min)

1. Click **edit icon** (✏️) on Gmail card
2. Change title to: `Gmail Work`
3. Click **"Save"**

**Expected:** Title updates

---

### ✅ TEST 9: Delete Item (2 min)

1. Click **delete icon** (🗑️) on any card
2. Click **"OK"** on confirmation
3. Check Firestore - item should be gone

**Expected:** Item deleted

---

### ✅ TEST 10: Logout & Re-login (2 min)

1. Click **"Logout"**
2. Login again with same credentials
3. Enter master password: `MasterPass123!`
4. Click **"Unlock"**

**Expected:** Vault unlocks, items visible

---

## 📊 QUICK RESULTS CHECKLIST

Mark each as you complete:

- [ ] ✅ Encryption test passed
- [ ] ✅ Account created
- [ ] ✅ API key created
- [ ] ✅ **Data encrypted in Firestore** (CRITICAL)
- [ ] ✅ **Only encrypted data in network** (CRITICAL)
- [ ] ✅ Show/hide works
- [ ] ✅ Copy works
- [ ] ✅ Search works
- [ ] ✅ Filter works
- [ ] ✅ Edit works
- [ ] ✅ Delete works
- [ ] ✅ Logout/login works

---

## 🎉 SUCCESS!

If all tests pass:

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              ✅ ALL TESTS PASSED!                            ║
║                                                              ║
║         Your Obscura vault is working perfectly!             ║
║                                                              ║
║         Ready for production deployment!                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Next Step:** Deploy to Vercel
```bash
npm install -g vercel
vercel
```

---

## 🚨 IF TESTS FAIL

### Issue: "Module not found"
```bash
npm install
```

### Issue: "Firebase not initialized"
- Check `.env.local` exists
- Restart dev server

### Issue: "Decryption failed"
- Check master password is correct
- Clear browser cache

### Issue: "Unauthorized"
- Check Firebase Admin SDK credentials
- Verify private key format

---

## 📞 NEED HELP?

1. Check browser console for errors
2. Check terminal for server errors
3. Review `INTEGRATION_TEST_GUIDE.md` for detailed steps
4. Check Firebase Console for data

---

**Ready? Start with STEP 1! 🚀**

**Time Required:** 30 minutes  
**Difficulty:** Easy  
**Prerequisites:** ✅ Complete
