# Favicon Setup Instructions

## Quick Setup

You need to generate favicon files. Here are two options:

### Option 1: Use Online Generator (Recommended)

1. Go to https://favicon.io/favicon-generator/
2. Settings:
   - Text: 🔒 (or just "O")
   - Background: #000000 (black)
   - Font: Inter
   - Font Size: 80
   - Shape: Rounded
3. Click "Download"
4. Extract the zip file
5. Copy these files to the `public` folder:
   - favicon.ico
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png
   - android-chrome-192x192.png
   - android-chrome-512x512.png

### Option 2: Use Emoji as Favicon

Create a simple SVG favicon with the lock emoji:

1. Create `public/favicon.svg` with this content:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y="75" font-size="75">🔒</text>
</svg>
```

2. Then update `pages/_document.js` to use SVG:

```jsx
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

### Option 3: Use Existing Logo

If you have a logo image:

1. Go to https://realfavicongenerator.net/
2. Upload your logo
3. Download the generated package
4. Copy all files to `public` folder

## Files Needed

Place these in the `public` folder:
- favicon.ico (16x16, 32x32, 48x48)
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png
- android-chrome-512x512.png

## Current Status

✅ site.webmanifest created
✅ _document.js configured
⏳ Favicon images need to be generated

## After Adding Favicons

1. Commit changes:
```bash
git add .
git commit -m "Add favicon and page titles"
git push
```

2. Deploy:
```bash
vercel --prod
```

3. Clear browser cache to see new favicon (Ctrl+Shift+R)
