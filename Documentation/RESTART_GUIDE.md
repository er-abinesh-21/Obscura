# 🔄 RESTART REQUIRED - Fix 404/500 Errors

## Current Issue
- ❌ GET /api/user → 404 (Not Found)
- ❌ POST /api/user → 500 (Internal Server Error)

## Why This Happens
Next.js cached the old API routes location. We need to clear the cache and restart.

---

## 🚀 QUICK FIX (30 seconds)

### Step 1: Stop the Server
In your terminal where `npm run dev` is running:
```
Press: Ctrl + C
```

### Step 2: Clear Next.js Cache
```bash
rmdir /s /q .next
```

### Step 3: Restart Server
```bash
npm run dev
```

### Step 4: Hard Refresh Browser
```
Press: Ctrl + Shift + R
```

---

## ✅ Verify It Works

### Option 1: Test API Routes
Visit: **http://localhost:3000/test-api**

Should show:
- ✅ /api/user: Route exists (401 Unauthorized - expected)
- ✅ /api/vault: Route exists (401 Unauthorized - expected)

### Option 2: Try Registration
1. Go to http://localhost:3000
2. Click "Create new account"
3. Fill in details
4. Should work now! ✅

---

## 🐛 Still Getting Errors?

### If 404 persists:

**Check 1: Files exist?**
```bash
dir pages\api\user.js
```
Should show the file exists.

**Check 2: Correct export?**
Open `pages/api/user.js` and verify it has:
```javascript
export default async function handler(req, res) {
```

**Check 3: Server fully restarted?**
Make sure you:
1. Stopped server (Ctrl+C)
2. Deleted .next folder
3. Started server again

### If 500 persists:

**Check 1: Firebase Admin SDK configured?**
Verify `.env.local` has:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Check 2: Private key format?**
The private key must:
- Be wrapped in quotes
- Have `\n` for newlines (not actual newlines)
- Include BEGIN and END markers

**Example:**
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"
```

---

## 📋 Complete Restart Checklist

- [ ] Stop dev server (Ctrl+C)
- [ ] Delete .next folder: `rmdir /s /q .next`
- [ ] Restart server: `npm run dev`
- [ ] Hard refresh browser: Ctrl+Shift+R
- [ ] Test API routes: http://localhost:3000/test-api
- [ ] Try registration: http://localhost:3000

---

## 🎯 Expected Behavior After Restart

### Before Restart:
```
❌ GET /api/user → 404
❌ POST /api/user → 500
❌ Can't register
❌ Can't sign in
```

### After Restart:
```
✅ GET /api/user → 401 (Unauthorized - correct!)
✅ POST /api/user → Works with auth token
✅ Can register (if Firebase Auth enabled)
✅ Can sign in (if Firebase Auth enabled)
```

---

## 🔥 One-Line Fix

```bash
taskkill /F /IM node.exe & rmdir /s /q .next & npm run dev
```

This will:
1. Kill all Node processes
2. Delete .next cache
3. Restart dev server

---

## 📞 Still Not Working?

### Check Terminal Output
Look for errors like:
- "Module not found" → Import path issue
- "Cannot find module" → Missing dependency
- "Syntax error" → Code syntax issue

### Check Browser Console (F12)
Look for:
- Exact error messages
- Request/Response details
- Network tab for API calls

### Verify File Structure
```
pages/
  api/
    user.js          ← Must exist
    vault/
      index.js       ← Must exist
      [id].js        ← Must exist
    middleware/
      auth.js        ← Must exist
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Terminal shows:**
   ```
   ✓ Compiled /api/user
   ✓ Compiled /api/vault
   ```

2. **Test page shows:**
   ```
   ✅ /api/user: Route exists (401)
   ✅ /api/vault: Route exists (401)
   ```

3. **Registration works:**
   - No 404 errors
   - No 500 errors
   - Creates user successfully

---

## 🎉 After This Works

You still need to:
1. ✅ Enable Firebase Authentication (see VISUAL_GUIDE.md)
2. ✅ Create Firestore Database
3. ✅ Test Google Sign-In

But the API routes will be working! 🚀
