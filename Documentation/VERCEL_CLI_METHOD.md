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
vercel env add key
```
paste the Values for the Key.

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
