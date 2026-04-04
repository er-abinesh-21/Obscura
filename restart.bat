@echo off
echo.
echo ========================================
echo   RESTARTING OBSCURA DEV SERVER
echo ========================================
echo.

echo [1/3] Stopping Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Clearing Next.js cache...
if exist .next rmdir /s /q .next
echo Cache cleared!

echo [3/3] Starting dev server...
echo.
echo ========================================
echo   Server starting...
echo   Visit: http://localhost:3000
echo ========================================
echo.

npm run dev
