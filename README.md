# Stress Relief Web Application

A fun and interactive web application designed to help users manage stress through games, quizzes, and analysis tools.

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)
```bash
# Windows Command Prompt
start-server.bat

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File start-server.ps1

# Node.js (Cross-platform)
node server-config.js
```

### Option 2: Live Server (VS Code)
1. Install the "Live Server" extension in VS Code
2. Right-click on `home.html`
3. Select "Open with Live Server"

### Option 3: Manual Server Setup
```bash
# Using npm live-server
npm install -g live-server
live-server --port=5500 --open=home.html

# Using Python
python -m http.server 8000
# Then open: http://localhost:8000/home.html

# Using PHP
php -S localhost:8080
# Then open: http://localhost:8080/home.html
```

## 🔧 Troubleshooting Connection Issues

### Common Problems & Solutions

#### 1. Connection Reset Issues
- **Cause**: Port conflicts, firewall blocking, or server crashes
- **Solutions**:
  - Restart your development server
  - Try a different port (3000, 5000, 8000, 8080)
  - Check Windows Firewall settings
  - Run as Administrator
  - Clear browser cache

#### 2. Port Already in Use
- **Check what's using the port**:
  ```bash
  netstat -ano | findstr :5500
  ```
- **Kill the process**:
  ```bash
  taskkill /PID <process_id> /F
  ```
- **Use alternative ports**: The startup scripts automatically try different ports

#### 3. File Loading Issues
- **Cause**: CORS restrictions, incorrect MIME types, or missing files
- **Solutions**:
  - Always use a local server (don't open HTML files directly)
  - Check that all referenced files exist
  - Verify file paths are correct
  - Use the diagnostics page for detailed analysis

## 📊 Diagnostic Tools

### Built-in Diagnostics
- **Diagnostics Page**: Open `diagnostics.html` for comprehensive troubleshooting
- **Test Page**: Open `test-pages.html` to verify all pages load correctly
- **Error Logging**: Automatic error logging with export functionality
- **Connection Monitoring**: Real-time connection status monitoring

### Manual Diagnostics
```javascript
// In browser console:

// Check error logs
errorLogger.getLogs()

// Export logs to file
errorLogger.exportLogs()

// Test connectivity
errorLogger.testConnectivity()

// Run connection diagnostics
connectionMonitor.runDiagnostics()

// Check port availability
connectionMonitor.scanCommonPorts()
```

## 📁 Project Structure

```
stress-relief-app/
├── home.html              # Main landing page
├── game1.html             # Emoji Quiz game
├── game2.html             # Bubble Pop game
├── game3.html             # Tile Sequence game
├── game4.html             # Spinner game
├── s4.html                # Stress Buster Challenge
├── result.html            # Results page
├── stress-quiz.html       # Stress assessment quiz
├── face-stress.html       # Face-based stress detection
├── voice-analysis.html    # Voice stress analysis
├── ex1.html, ex2.html, ex3.html  # Example pages
├── style.css              # Main stylesheet
├── script.js              # Main JavaScript
├── falling-emojis.js      # Emoji animation
├── error-logger.js        # Error logging system
├── connection-monitor.js  # Connection monitoring
├── server-config.js       # Node.js server configuration
├── start-server.bat       # Windows batch startup script
├── start-server.ps1       # PowerShell startup script
├── diagnostics.html       # Diagnostic and troubleshooting page
├── test-pages.html        # Page testing dashboard
├── package.json           # Node.js dependencies
├── 1.jpeg, 2.jpeg         # Image assets
└── README.md              # This file
```

## 🎮 Features

### Games
- **Emoji Quiz**: Guess phrases from emoji clues
- **Bubble Pop**: Pop bubbles for stress relief
- **Tile Sequence**: Memory-based sequence game
- **Spinner Game**: Random task generator

### Analysis Tools
- **Stress Quiz**: Comprehensive stress assessment
- **Face Stress Detection**: AI-powered facial expression analysis
- **Voice Analysis**: Voice-based stress detection

### Utilities
- **Error Logging**: Comprehensive error tracking and reporting
- **Connection Monitoring**: Real-time server connection monitoring
- **Diagnostics**: Built-in troubleshooting tools
- **Multi-server Support**: Multiple server startup options

## 🛠️ Technical Details

### Dependencies
- **Face API**: For facial expression analysis
- **Web Audio API**: For voice analysis
- **Canvas API**: For games and animations
- **Local Storage**: For saving user progress

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Server Requirements
- **Node.js** (recommended): For live-server and advanced features
- **Python 3.x**: Alternative HTTP server
- **PHP 7.x+**: Alternative HTTP server
- **Any static file server**: Basic functionality

## 🔒 Security & Privacy

- All processing is done locally in the browser
- No data is sent to external servers (except for CDN resources)
- Face and voice analysis data is not stored permanently
- Error logs can be exported and cleared by the user

## 📝 Error Logging

The application includes comprehensive error logging:

### Automatic Logging
- JavaScript errors and exceptions
- Network connectivity issues
- Resource loading failures
- User interactions and navigation

### Manual Logging
```javascript
// Log custom errors
errorLogger.logError('Category', 'Error details');

// Log warnings
errorLogger.logWarning('Category', 'Warning message');

// Log information
errorLogger.logInfo('Category', 'Info message');
```

### Log Export
- Logs are automatically saved to localStorage
- Export logs as JSON files for analysis
- Clear logs when needed
- View logs in the diagnostics page

## 🚨 Common Error Messages

### "Connection Reset"
- **Meaning**: The server connection was interrupted
- **Solution**: Restart the server, try a different port, or check firewall settings

### "Port Already in Use"
- **Meaning**: Another application is using the same port
- **Solution**: Use the startup scripts to automatically find an available port

### "Failed to Load Resource"
- **Meaning**: A CSS, JS, or image file couldn't be loaded
- **Solution**: Check file paths, ensure server is running, verify file exists

### "Face Detection Models Failed to Load"
- **Meaning**: External CDN resources couldn't be loaded
- **Solution**:
  - Check internet connection and try refreshing the page
  - Use the robust version (face-stress-robust.html) which tries multiple CDN sources
  - Use the fallback version (face-stress-fallback.html) for offline analysis

## 📞 Support

If you continue to experience issues:

1. Open `diagnostics.html` for detailed troubleshooting
2. Check the browser console for error messages
3. Export error logs using `errorLogger.exportLogs()`
4. Try different server options
5. Ensure all files are in the correct directory structure

## 🔄 Updates

The application includes automatic error detection and logging. Check the diagnostics page regularly for any issues that need attention.

---

**Note**: This application is designed for local development and testing. For production deployment, additional security measures and server configuration may be required.
