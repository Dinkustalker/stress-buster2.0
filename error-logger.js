/**
 * Error Logger and Connection Monitor
 * Logs errors to console and creates log files for debugging
 */

class ErrorLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.logToConsole = true;
        this.init();
    }

    init() {
        // Capture all JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });

        // Monitor network connectivity
        window.addEventListener('online', () => {
            this.logInfo('Network Status', 'Connection restored');
        });

        window.addEventListener('offline', () => {
            this.logError('Network Status', 'Connection lost');
        });

        // Monitor page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logInfo('Page Visibility', 'Page hidden');
            } else {
                this.logInfo('Page Visibility', 'Page visible');
            }
        });

        this.logInfo('Error Logger', 'Initialized successfully');
    }

    logError(category, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            category: category,
            details: details,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.addLog(logEntry);
        
        if (this.logToConsole) {
            console.error(`[${logEntry.timestamp}] ${category}:`, details);
        }
    }

    logWarning(category, message) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: 'WARNING',
            category: category,
            message: message,
            url: window.location.href
        };

        this.addLog(logEntry);
        
        if (this.logToConsole) {
            console.warn(`[${logEntry.timestamp}] ${category}: ${message}`);
        }
    }

    logInfo(category, message) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: 'INFO',
            category: category,
            message: message,
            url: window.location.href
        };

        this.addLog(logEntry);
        
        if (this.logToConsole) {
            console.info(`[${logEntry.timestamp}] ${category}: ${message}`);
        }
    }

    addLog(logEntry) {
        this.logs.push(logEntry);
        
        // Keep only the last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // Store in localStorage for persistence
        try {
            localStorage.setItem('errorLogs', JSON.stringify(this.logs.slice(-100))); // Keep last 100 in storage
        } catch (e) {
            console.warn('Could not save logs to localStorage:', e);
        }
    }

    getLogs(level = null) {
        if (level) {
            return this.logs.filter(log => log.level === level);
        }
        return this.logs;
    }

    exportLogs() {
        const logData = JSON.stringify(this.logs, null, 2);
        const blob = new Blob([logData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearLogs() {
        this.logs = [];
        localStorage.removeItem('errorLogs');
        this.logInfo('Error Logger', 'Logs cleared');
    }

    // Load previous logs from localStorage
    loadPreviousLogs() {
        try {
            const savedLogs = localStorage.getItem('errorLogs');
            if (savedLogs) {
                const parsedLogs = JSON.parse(savedLogs);
                this.logs = [...parsedLogs, ...this.logs];
                this.logInfo('Error Logger', `Loaded ${parsedLogs.length} previous log entries`);
            }
        } catch (e) {
            this.logWarning('Error Logger', 'Could not load previous logs: ' + e.message);
        }
    }

    // Test network connectivity
    async testConnectivity() {
        const testUrls = [
            'https://www.google.com/favicon.ico',
            'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js',
            'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&display=swap'
        ];

        const results = [];
        
        for (const url of testUrls) {
            try {
                const startTime = Date.now();
                const response = await fetch(url, { 
                    method: 'HEAD', 
                    mode: 'no-cors',
                    cache: 'no-cache'
                });
                const endTime = Date.now();
                
                results.push({
                    url: url,
                    status: 'success',
                    responseTime: endTime - startTime
                });
                
                this.logInfo('Connectivity Test', `${url} - OK (${endTime - startTime}ms)`);
            } catch (error) {
                results.push({
                    url: url,
                    status: 'failed',
                    error: error.message
                });
                
                this.logError('Connectivity Test', `${url} - Failed: ${error.message}`);
            }
        }

        return results;
    }

    // Monitor resource loading
    monitorResourceLoading() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('.css') || entry.name.includes('.js') || entry.name.includes('.jpeg')) {
                    if (entry.transferSize === 0 && entry.decodedBodySize === 0) {
                        this.logError('Resource Loading', `Failed to load: ${entry.name}`);
                    } else {
                        this.logInfo('Resource Loading', `Loaded: ${entry.name} (${entry.transferSize} bytes)`);
                    }
                }
            }
        });

        observer.observe({ entryTypes: ['resource'] });
    }
}

// Initialize the error logger
const errorLogger = new ErrorLogger();
errorLogger.loadPreviousLogs();
errorLogger.monitorResourceLoading();

// Make it globally available
window.errorLogger = errorLogger;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorLogger;
}
