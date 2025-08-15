# Stress Relief App - PowerShell Server Startup Script
# Run with: powershell -ExecutionPolicy Bypass -File start-server.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Stress Relief App - Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to check if a port is available
function Test-Port($port) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
        $listener.Start()
        $listener.Stop()
        return $true
    }
    catch {
        return $false
    }
}

# Function to find available port
function Find-AvailablePort($startPort = 5500) {
    $portsToTry = @($startPort, 3000, 5000, 8000, 8080, 8888, 9000)
    
    foreach ($port in $portsToTry) {
        if (Test-Port $port) {
            return $port
        }
    }
    return $null
}

# Function to kill processes on a port
function Stop-ProcessOnPort($port) {
    try {
        $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
                    Select-Object -ExpandProperty OwningProcess | 
                    Sort-Object | Get-Unique
        
        foreach ($processId in $processes) {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Stopping process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Yellow
                Stop-Process -Id $processId -Force
            }
        }
        return $true
    }
    catch {
        Write-Host "Could not stop processes on port $port" -ForegroundColor Red
        return $false
    }
}

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "[INFO] Node.js detected: $nodeVersion" -ForegroundColor Green
    
    # Check npm
    if (Test-Command "npm") {
        $npmVersion = npm --version
        Write-Host "[INFO] npm detected: $npmVersion" -ForegroundColor Green
        
        # Check for live-server
        $liveServerInstalled = $false
        try {
            npx live-server --version | Out-Null
            $liveServerInstalled = $true
            Write-Host "[INFO] live-server is available" -ForegroundColor Green
        }
        catch {
            Write-Host "[WARNING] live-server not found, installing..." -ForegroundColor Yellow
            npm install live-server
            if ($LASTEXITCODE -eq 0) {
                $liveServerInstalled = $true
                Write-Host "[INFO] live-server installed successfully" -ForegroundColor Green
            }
        }
        
        if ($liveServerInstalled) {
            # Find available port
            $availablePort = Find-AvailablePort
            
            if ($availablePort) {
                Write-Host "[INFO] Starting live-server on port $availablePort..." -ForegroundColor Green
                Write-Host "[INFO] Server will open at: http://localhost:$availablePort/home.html" -ForegroundColor Cyan
                Write-Host "[INFO] Press Ctrl+C to stop the server" -ForegroundColor Yellow
                Write-Host ""
                
                # Start live-server
                npx live-server --port=$availablePort --host=localhost --open=home.html --watch=. --wait=200 --cors
            }
            else {
                Write-Host "[ERROR] No available ports found. Checking for processes..." -ForegroundColor Red
                
                # Try to free up common ports
                $commonPorts = @(5500, 3000, 8000)
                foreach ($port in $commonPorts) {
                    Write-Host "Checking port $port..." -ForegroundColor Yellow
                    if (-not (Test-Port $port)) {
                        $choice = Read-Host "Port $port is busy. Kill processes on this port? (y/n)"
                        if ($choice -eq "y" -or $choice -eq "Y") {
                            if (Stop-ProcessOnPort $port) {
                                Start-Sleep -Seconds 2
                                if (Test-Port $port) {
                                    Write-Host "[INFO] Port $port is now available. Starting server..." -ForegroundColor Green
                                    npx live-server --port=$port --host=localhost --open=home.html --watch=. --wait=200 --cors
                                    exit
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    else {
        Write-Host "[ERROR] npm is not available" -ForegroundColor Red
    }
}
else {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
}

# Alternative server options
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "        Alternative Server Options" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Try Python server
if (Test-Command "python") {
    $pythonVersion = python --version
    Write-Host "[INFO] Python detected: $pythonVersion" -ForegroundColor Green
    $choice = Read-Host "Would you like to start Python HTTP server on port 8000? (y/n)"
    if ($choice -eq "y" -or $choice -eq "Y") {
        if (Test-Port 8000) {
            Write-Host "[INFO] Starting Python HTTP server on port 8000..." -ForegroundColor Green
            Write-Host "[INFO] Open http://localhost:8000/home.html in your browser" -ForegroundColor Cyan
            python -m http.server 8000
            exit
        }
        else {
            Write-Host "[ERROR] Port 8000 is busy" -ForegroundColor Red
        }
    }
}

# Try PHP server
if (Test-Command "php") {
    $phpVersion = php --version | Select-Object -First 1
    Write-Host "[INFO] PHP detected: $phpVersion" -ForegroundColor Green
    $choice = Read-Host "Would you like to start PHP built-in server on port 8080? (y/n)"
    if ($choice -eq "y" -or $choice -eq "Y") {
        if (Test-Port 8080) {
            Write-Host "[INFO] Starting PHP built-in server on port 8080..." -ForegroundColor Green
            Write-Host "[INFO] Open http://localhost:8080/home.html in your browser" -ForegroundColor Cyan
            php -S localhost:8080
            exit
        }
        else {
            Write-Host "[ERROR] Port 8080 is busy" -ForegroundColor Red
        }
    }
}

# Manual options
Write-Host ""
Write-Host "Manual Options:" -ForegroundColor Yellow
Write-Host "1. VS Code Live Server Extension:" -ForegroundColor White
Write-Host "   - Install 'Live Server' extension in VS Code" -ForegroundColor Gray
Write-Host "   - Right-click on home.html and select 'Open with Live Server'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Simple Node.js Server:" -ForegroundColor White
Write-Host "   node server-config.js" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Manual file opening:" -ForegroundColor White
Write-Host "   - Double-click on home.html to open in browser" -ForegroundColor Gray
Write-Host "   - Note: Some features may not work without a server" -ForegroundColor Gray
Write-Host ""

# Troubleshooting tips
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           Troubleshooting Tips" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you're experiencing connection issues:" -ForegroundColor Yellow
Write-Host "1. Check Windows Firewall settings" -ForegroundColor White
Write-Host "2. Disable antivirus temporarily" -ForegroundColor White
Write-Host "3. Try running as Administrator" -ForegroundColor White
Write-Host "4. Check if ports are blocked by corporate firewall" -ForegroundColor White
Write-Host "5. Open diagnostics.html for detailed troubleshooting" -ForegroundColor White
Write-Host ""
Write-Host "For detailed diagnostics, open: diagnostics.html" -ForegroundColor Cyan
Write-Host ""

# Open diagnostics page
$choice = Read-Host "Would you like to open the diagnostics page? (y/n)"
if ($choice -eq "y" -or $choice -eq "Y") {
    Start-Process "diagnostics.html"
}

Read-Host "Press Enter to exit"
