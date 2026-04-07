# Quick Favicon Setup

## If you've copied google.png to the public folder:

1. Rename `google.png` to `favicon.png` in the public folder

2. Update `pages/_document.js` to use the PNG directly:

Replace the favicon section with:

```jsx
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
```

## Better Approach: Use Online Generator

For best results across all devices and browsers:

1. Go to: https://realfavicongenerator.net/
2. Upload your google.png
3. Download the generated package
4. Extract and copy all files to `public` folder
5. The files you'll get:
   - favicon.ico
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png
   - android-chrome-192x192.png
   - android-chrome-512x512.png
   - site.webmanifest (already created)

## After Setup:

```bash
cd C:\Users\76bab\Downloads\My Projects\obscura
git add .
git commit -m "Add custom favicon"
git push
vercel --prod
```

Clear browser cache (Ctrl+Shift+R) to see the new favicon!
