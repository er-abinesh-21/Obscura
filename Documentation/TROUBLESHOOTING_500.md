# 🔧 TROUBLESHOOTING: 500 Internal Server Error

## Issue
Getting 500 error when accessing `/api/vault` after signup.

## Root Cause
Next.js API routes require CommonJS syntax, not ES6 imports.

## ✅ FIXES APPLIED

All API files have been converted to CommonJS:
- ✅ `utils/firebaseAdmin.js` - Uses `require()` and `module.exports`
- ✅ `api/middleware/auth.js` - Uses `require()` and `module.exports`
- ✅ `api/vault/index.js` - Uses `require()` and `module.exports`
- ✅ `api/vault/[id].js` - Uses `require()` and `module.exports`
- ✅ `api/user.js` - Uses `require()` and `module.exports`

## 🚀 RESTART SERVER

**IMPORTANT:** You must restart the dev server for changes to take effect.

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## 🧪 TEST THE FIX

### Step 1: Test API Endpoint
Open browser and go to:
```
http://localhost:3000/api/test
```

**Expected Response:**
```json
{
  "message": "API is working",
  "timestamp": "2024-..."
}
```

If you see this, the API is working!

### Step 2: Check Server Logs
Look at your terminal where `npm run dev` is running.

**Look for:**
```
Test endpoint hit
Environment check: { hasProjectId: true, hasClientEmail: true, hasPrivateKey: true }
```

All three should be `true`.

### Step 3: Try Signup Again
1. Go to http://localhost:3000
2. Click "Create new account"
3. Enter:
   - Email: `test2@obscura.com` (use different email)
   - Password: `TestPass123!`
   - Master Password: `MasterPass123!`
4. Click "Create Account"

**Expected:** Should redirect to dashboard without errors

## 🔍 IF STILL GETTING ERRORS

### Check 1: Environment Variables
Verify `.env.local` exists and has all variables:
```bash
# In terminal:
cd "C:\Users\76bab\Downloads\My Projects\obscura"
type .env.local
```

Should show all Firebase variables.

### Check 2: Server Logs
Look at terminal for specific error messages:
```
Vault API error: [error details here]
```

### Check 3: Firebase Admin SDK
Test if Firebase Admin is initialized:

Open http://localhost:3000/api/test

If you get error, check:
- Private key format (should have `\n` not `\\n`)
- Project ID matches Firebase Console
- Client email is correct

## 🔧 COMMON FIXES

### Fix 1: Private Key Format
The private key in `.env.local` should look like:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...\n-----END PRIVATE KEY-----\n"
```

Note: Use `\n` not `\\n`

### Fix 2: Restart Server
Always restart after changing `.env.local`:
```bash
# Ctrl+C to stop
npm run dev
```

### Fix 3: Clear Next.js Cache
```bash
# Stop server
# Delete cache
rmdir /s /q .next
# Restart
npm run dev
```

## ✅ VERIFICATION CHECKLIST

After restart, verify:
- [ ] Server starts without errors
- [ ] http://localhost:3000/api/test returns JSON
- [ ] Terminal shows "Environment check: { hasProjectId: true, ... }"
- [ ] Signup redirects to dashboard
- [ ] No 500 errors in browser console

## 🎯 NEXT STEPS

Once server restarts successfully:
1. Try signup again with new email
2. Should redirect to dashboard
3. Continue with Test 3.1 (Create API Key)

## 📞 STILL STUCK?

Check terminal output and share:
1. The exact error message
2. Server logs from terminal
3. Response from http://localhost:3000/api/test

---

**Action Required:** RESTART SERVER NOW
```bash
# Press Ctrl+C in terminal
# Then run:
npm run dev
```
