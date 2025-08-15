@echo off
echo ========================================
echo    Stress Relief App - Server Startup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    goto :alternatives
)

echo [INFO] Node.js detected: 
node --version

:: Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not available
    goto :alternatives
)

echo [INFO] npm detected: 
npm --version
echo.

:: Check if live-server is installed globally
live-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] live-server not found globally
    echo [INFO] Installing live-server locally...
    npm install live-server
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install live-server
        goto :alternatives
    )
)

:: Try to start live-server
echo [INFO] Starting live-server...
echo [INFO] Server will open at: http://localhost:5500/home.html
echo [INFO] Press Ctrl+C to stop the server
echo.

:: Try different ports if 5500 is busy
npx live-server --port=5500 --host=localhost --open=home.html --watch=. --wait=200 --cors
if %errorlevel% neq 0 (
    echo [WARNING] Port 5500 might be busy, trying port 3000...
    npx live-server --port=3000 --host=localhost --open=home.html --watch=. --wait=200 --cors
    if %errorlevel% neq 0 (
        echo [WARNING] Port 3000 might be busy, trying port 8000...
        npx live-server --port=8000 --host=localhost --open=home.html --watch=. --wait=200 --cors
        if %errorlevel% neq 0 (
            echo [ERROR] All common ports seem to be busy
            goto :alternatives
        )
    )
)

goto :end

:alternatives
echo.
echo ========================================
echo         Alternative Server Options
echo ========================================
echo.
echo 1. Python HTTP Server (if Python is installed):
echo    python -m http.server 8000
echo    Then open: http://localhost:8000/home.html
echo.
echo 2. PHP Built-in Server (if PHP is installed):
echo    php -S localhost:8080
echo    Then open: http://localhost:8080/home.html
echo.
echo 3. VS Code Live Server Extension:
echo    - Install "Live Server" extension in VS Code
echo    - Right-click on home.html and select "Open with Live Server"
echo.
echo 4. Simple Node.js Server:
echo    node server-config.js
echo.
echo 5. Manual file opening:
echo    - Double-click on home.html to open in browser
echo    - Note: Some features may not work without a server
echo.

:: Try Python server as fallback
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Python detected, would you like to start Python HTTP server? (y/n)
    set /p choice=
    if /i "%choice%"=="y" (
        echo [INFO] Starting Python HTTP server on port 8000...
        echo [INFO] Open http://localhost:8000/home.html in your browser
        python -m http.server 8000
    )
)

:end
echo.
echo ========================================
echo    Troubleshooting Tips
echo ========================================
echo.
echo If you're experiencing connection issues:
echo 1. Check Windows Firewall settings
echo 2. Disable antivirus temporarily
echo 3. Try running as Administrator
echo 4. Check if ports are blocked by corporate firewall
echo 5. Open diagnostics.html for detailed troubleshooting
echo.
echo For more help, open: diagnostics.html
echo.
pause
