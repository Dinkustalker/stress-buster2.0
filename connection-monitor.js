/**
 * Connection Monitor and Port Checker
 * Monitors live server connection and checks for port conflicts
 */

class ConnectionMonitor {
    constructor() {
        this.isMonitoring = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
        this.commonPorts = [3000, 5000, 5500, 8000, 8080, 8888, 9000];
        this.currentPort = null;
        this.connectionStatus = 'unknown';
        this.init();
    }

    init() {
        this.detectCurrentPort();
        this.startMonitoring();
        this.setupEventListeners();
        this.logInfo('Connection Monitor initialized');
    }

    detectCurrentPort() {
        const port = window.location.port;
        if (port) {
            this.currentPort = parseInt(port);
            this.logInfo(`Detected current port: ${this.currentPort}`);
        } else {
            this.logInfo('No specific port detected (using default HTTP/HTTPS)');
        }
    }

    async checkPortAvailability(port) {
        try {
            // Try to connect to the port
            const response = await fetch(`http://localhost:${port}`, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            return { port, available: true, status: 'accessible' };
        } catch (error) {
            // Port might be in use or inaccessible
            return { 
                port, 
                available: false, 
                status: 'inaccessible',
                error: error.message 
            };
        }
    }

    async scanCommonPorts() {
        this.logInfo('Scanning common development ports...');
        const results = [];
        
        for (const port of this.commonPorts) {
            const result = await this.checkPortAvailability(port);
            results.push(result);
            
            if (result.available) {
                this.logInfo(`Port ${port}: Available`);
            } else {
                this.logWarning(`Port ${port}: ${result.status} - ${result.error}`);
            }
        }
        
        return results;
    }

    async testLiveServerConnection() {
        try {
            // Test if we can reach the current page
            const response = await fetch(window.location.href, {
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                this.connectionStatus = 'connected';
                this.reconnectAttempts = 0;
                this.logInfo('Live server connection: OK');
                return true;
            } else {
                this.connectionStatus = 'error';
                this.logError(`Live server connection failed: ${response.status} ${response.statusText}`);
                return false;
            }
        } catch (error) {
            this.connectionStatus = 'disconnected';
            this.logError(`Live server connection error: ${error.message}`);
            return false;
        }
    }

    async attemptReconnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.logError('Max reconnection attempts reached. Please restart the live server.');
            return false;
        }

        this.reconnectAttempts++;
        this.logInfo(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);

        // Wait before attempting reconnection
        await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));

        const connected = await this.testLiveServerConnection();
        
        if (connected) {
            this.logInfo('Reconnection successful!');
            this.showConnectionStatus('Connected', 'success');
            return true;
        } else {
            this.logWarning(`Reconnection attempt ${this.reconnectAttempts} failed`);
            // Try again with exponential backoff
            this.reconnectDelay *= 1.5;
            return this.attemptReconnection();
        }
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.logInfo('Starting connection monitoring...');

        // Check connection every 10 seconds
        this.monitoringInterval = setInterval(async () => {
            const connected = await this.testLiveServerConnection();
            
            if (!connected && this.connectionStatus !== 'reconnecting') {
                this.connectionStatus = 'reconnecting';
                this.showConnectionStatus('Reconnecting...', 'warning');
                this.attemptReconnection();
            }
        }, 10000);

        // Initial connection test
        this.testLiveServerConnection();
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.isMonitoring = false;
        this.logInfo('Connection monitoring stopped');
    }

    setupEventListeners() {
        // Monitor page load events
        window.addEventListener('load', () => {
            this.logInfo('Page loaded successfully');
            this.showConnectionStatus('Connected', 'success');
        });

        // Monitor beforeunload to detect navigation issues
        window.addEventListener('beforeunload', () => {
            this.logInfo('Page unloading...');
        });

        // Monitor fetch errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    this.logWarning(`Fetch failed: ${args[0]} - ${response.status} ${response.statusText}`);
                }
                return response;
            } catch (error) {
                this.logError(`Fetch error: ${args[0]} - ${error.message}`);
                throw error;
            }
        };
    }

    showConnectionStatus(message, type = 'info') {
        // Create or update status indicator
        let statusDiv = document.getElementById('connection-status');
        
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'connection-status';
            statusDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 10px 15px;
                border-radius: 5px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                font-weight: bold;
                z-index: 10000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusDiv);
        }

        statusDiv.textContent = message;
        
        // Set colors based on type
        switch (type) {
            case 'success':
                statusDiv.style.backgroundColor = '#d4edda';
                statusDiv.style.color = '#155724';
                statusDiv.style.border = '1px solid #c3e6cb';
                break;
            case 'warning':
                statusDiv.style.backgroundColor = '#fff3cd';
                statusDiv.style.color = '#856404';
                statusDiv.style.border = '1px solid #ffeaa7';
                break;
            case 'error':
                statusDiv.style.backgroundColor = '#f8d7da';
                statusDiv.style.color = '#721c24';
                statusDiv.style.border = '1px solid #f5c6cb';
                break;
            default:
                statusDiv.style.backgroundColor = '#d1ecf1';
                statusDiv.style.color = '#0c5460';
                statusDiv.style.border = '1px solid #bee5eb';
        }

        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (statusDiv && statusDiv.textContent === message) {
                    statusDiv.style.opacity = '0';
                    setTimeout(() => {
                        if (statusDiv && statusDiv.style.opacity === '0') {
                            statusDiv.remove();
                        }
                    }, 300);
                }
            }, 3000);
        }
    }

    // Diagnostic methods
    async runDiagnostics() {
        this.logInfo('Running connection diagnostics...');
        
        const diagnostics = {
            timestamp: new Date().toISOString(),
            currentUrl: window.location.href,
            currentPort: this.currentPort,
            connectionStatus: this.connectionStatus,
            userAgent: navigator.userAgent,
            onlineStatus: navigator.onLine,
            portScan: await this.scanCommonPorts(),
            connectivityTest: await this.testLiveServerConnection()
        };

        this.logInfo('Diagnostics completed', diagnostics);
        return diagnostics;
    }

    exportDiagnostics() {
        this.runDiagnostics().then(diagnostics => {
            const data = JSON.stringify(diagnostics, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `connection-diagnostics-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Logging methods (delegate to error logger if available)
    logInfo(message, data = null) {
        if (window.errorLogger) {
            window.errorLogger.logInfo('Connection Monitor', data ? `${message}: ${JSON.stringify(data)}` : message);
        } else {
            console.info(`[Connection Monitor] ${message}`, data || '');
        }
    }

    logWarning(message, data = null) {
        if (window.errorLogger) {
            window.errorLogger.logWarning('Connection Monitor', data ? `${message}: ${JSON.stringify(data)}` : message);
        } else {
            console.warn(`[Connection Monitor] ${message}`, data || '');
        }
    }

    logError(message, data = null) {
        if (window.errorLogger) {
            window.errorLogger.logError('Connection Monitor', data ? `${message}: ${JSON.stringify(data)}` : message);
        } else {
            console.error(`[Connection Monitor] ${message}`, data || '');
        }
    }
}

// Initialize the connection monitor
const connectionMonitor = new ConnectionMonitor();

// Make it globally available
window.connectionMonitor = connectionMonitor;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConnectionMonitor;
}
