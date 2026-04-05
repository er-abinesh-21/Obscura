# Vercel CLI Deployment Method

If the web interface keeps failing, use Vercel CLI instead:

## Step 1: Install Vercel CLI

Open Command Prompt and run:
```cmd
npm install -g vercel
```

## Step 2: Login to Vercel

```cmd
vercel login
```

Follow the prompts to authenticate.

## Step 3: Navigate to Your Project

```cmd
cd C:\Users\76bab\Downloads\My Projects\obscura
```

## Step 4: Link to Vercel Project

```cmd
vercel link
```

Select your existing project or create a new one.

## Step 5: Add Environment Variables via CLI

Run these commands one by one:

```cmd
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
```
When prompted, paste: `AIzaSyAGqtKBqd5RFXlkUNX-MC3O28VzreWslvg`

```cmd
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
```
Paste: `obscura-23926.firebaseapp.com`

```cmd
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
```
Paste: `obscura-23926`

```cmd
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
```
Paste: `obscura-23926.firebasestorage.app`

```cmd
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
```
Paste: `861104204973`

```cmd
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
```
Paste: `1:861104204973:web:def2b6b20621940a14aa24`

```cmd
vercel env add FIREBASE_PROJECT_ID production
```
Paste: `obscura-23926`

```cmd
vercel env add FIREBASE_CLIENT_EMAIL production
```
Paste: `firebase-adminsdk-fbsvc@obscura-23926.iam.gserviceaccount.com`

```cmd
vercel env add FIREBASE_PRIVATE_KEY production
```
When prompted, paste the ENTIRE private key (all lines from BEGIN to END).

## Step 6: Deploy

```cmd
vercel --prod
```

This will deploy your application with all environment variables set correctly.

## Advantages of CLI Method:
- ✅ No truncation issues
- ✅ Handles multi-line values correctly
- ✅ More reliable for complex values
- ✅ Can script the deployment

## After Deployment:

Check your deployment at the URL provided by the CLI.
