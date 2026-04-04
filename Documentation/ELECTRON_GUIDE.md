# Electron Desktop App Setup Guide

## Quick Setup

### 1. Install Electron Dependencies

```bash
cd obscura
npm install electron electron-builder concurrently wait-on --save-dev
```

### 2. Create Electron Directory

```bash
mkdir electron
```

### 3. Create electron/main.js

```javascript
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    },
    icon: path.join(__dirname, '../public/icon.png'),
    backgroundColor: '#0f172a'
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Lock Vault',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              sessionStorage.clear();
              window.location.href = '/unlock';
            `);
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:3000' && !navigationUrl.startsWith('file://')) {
      event.preventDefault();
    }
  });
});
```

### 4. Create electron/preload.js (Optional Security Layer)

```javascript
const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform
});
```

### 5. Update package.json

```json
{
  "name": "obscura",
  "version": "1.0.0",
  "description": "Secure vault application",
  "main": "electron/main.js",
  "homepage": "./",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "electron": "electron .",
    "electron-dev": "concurrently \"npm run dev\" \"wait-on http://localhost:3000 && NODE_ENV=development electron .\"",
    "electron-build": "next build && next export && electron-builder",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  },
  "build": {
    "appId": "com.obscura.vault",
    "productName": "Obscura",
    "copyright": "Copyright © 2024",
    "files": [
      "electron/**/*",
      "out/**/*",
      "public/**/*"
    ],
    "directories": {
      "output": "dist",
      "buildResources": "public"
    },
    "mac": {
      "category": "public.app-category.productivity",
      "icon": "public/icon.icns",
      "target": ["dmg", "zip"]
    },
    "win": {
      "icon": "public/icon.ico",
      "target": ["nsis", "portable"]
    },
    "linux": {
      "icon": "public/icon.png",
      "target": ["AppImage", "deb"],
      "category": "Utility"
    }
  }
}
```

### 6. Update next.config.js for Static Export

```javascript
module.exports = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
};
```

### 7. Development

```bash
# Run in development mode
npm run electron-dev
```

### 8. Build for Production

```bash
# Build for current platform
npm run electron-build

# Or build for specific platform
npm run dist -- --mac
npm run dist -- --win
npm run dist -- --linux
```

### 9. Create App Icons

Place icons in `public/` directory:
- `icon.png` (512x512) - Linux
- `icon.icns` - macOS (use `png2icns` tool)
- `icon.ico` - Windows (use online converter)

### 10. Code Signing (Production)

#### macOS
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAM_ID)"
    }
  }
}
```

#### Windows
```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/cert.pfx",
      "certificatePassword": "password"
    }
  }
}
```

## Features

### Auto-Update (Optional)

```bash
npm install electron-updater
```

```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

### System Tray Icon

```javascript
const { Tray } = require('electron');

let tray;

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/tray-icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Obscura', click: () => mainWindow.show() },
    { label: 'Lock Vault', click: () => lockVault() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Obscura Vault');
}
```

### Global Shortcuts

```javascript
const { globalShortcut } = require('electron');

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+O', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
});
```

## Security Best Practices

1. **Disable Node Integration**: Already done in webPreferences
2. **Enable Context Isolation**: Already done
3. **Use Content Security Policy**: Add to HTML
4. **Validate All Input**: Sanitize user input
5. **Keep Electron Updated**: Regular updates
6. **Code Signing**: Sign your app for distribution

## Distribution

### macOS
- DMG installer created in `dist/`
- Notarize for Gatekeeper

### Windows
- NSIS installer created in `dist/`
- Sign with certificate

### Linux
- AppImage and .deb created in `dist/`
- Publish to Snap Store or Flathub

## Troubleshooting

### Issue: White screen on launch
- Check if Next.js export completed successfully
- Verify `out/` directory exists
- Check console for errors

### Issue: API calls fail
- Ensure Firebase config is in environment variables
- Check CORS settings
- Verify network connectivity

### Issue: App won't build
- Clear `out/` and `dist/` directories
- Run `npm run build` separately first
- Check electron-builder logs
