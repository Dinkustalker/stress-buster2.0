/**
 * Server Configuration and Setup Helper
 * Provides multiple server options and configuration
 */

const serverConfig = {
    // Default configuration
    default: {
        port: 5500,
        host: 'localhost',
        root: '.',
        index: 'home.html',
        cors: true,
        cache: false
    },

    // Alternative ports to try if default is busy
    fallbackPorts: [3000, 5000, 8000, 8080, 8888, 9000],

    // MIME types for proper file serving
    mimeTypes: {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    },

    // Security headers
    securityHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    },

    // CORS headers for development
    corsHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
};

// Simple Node.js server implementation
function createSimpleServer() {
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    const url = require('url');

    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url);
        let pathname = parsedUrl.pathname;

        // Default to index file
        if (pathname === '/') {
            pathname = '/' + serverConfig.default.index;
        }

        const filePath = path.join(__dirname, pathname);
        const ext = path.extname(filePath);

        // Set CORS headers
        Object.entries(serverConfig.corsHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        // Set security headers
        Object.entries(serverConfig.securityHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        // Handle OPTIONS requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - File Not Found</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            .error { color: #e74c3c; }
                            .back-link { margin-top: 20px; }
                            .back-link a { color: #3498db; text-decoration: none; }
                        </style>
                    </head>
                    <body>
                        <h1 class="error">404 - File Not Found</h1>
                        <p>The requested file <code>${pathname}</code> was not found.</p>
                        <div class="back-link">
                            <a href="/home.html">← Back to Home</a>
                        </div>
                    </body>
                    </html>
                `);
                return;
            }

            // Set content type
            const contentType = serverConfig.mimeTypes[ext] || 'application/octet-stream';
            res.setHeader('Content-Type', contentType);

            // Set cache headers
            if (!serverConfig.default.cache) {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            }

            // Stream the file
            const readStream = fs.createReadStream(filePath);
            readStream.on('error', (err) => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                console.error('File read error:', err);
            });

            readStream.pipe(res);
        });
    });

    return server;
}

// Port availability checker
async function checkPortAvailability(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();

        server.listen(port, () => {
            server.once('close', () => {
                resolve(true);
            });
            server.close();
        });

        server.on('error', () => {
            resolve(false);
        });
    });
}

// Find available port
async function findAvailablePort(startPort = serverConfig.default.port) {
    const portsToTry = [startPort, ...serverConfig.fallbackPorts];
    
    for (const port of portsToTry) {
        const available = await checkPortAvailability(port);
        if (available) {
            return port;
        }
    }
    
    throw new Error('No available ports found');
}

// Start server with automatic port selection
async function startServer() {
    try {
        const availablePort = await findAvailablePort();
        const server = createSimpleServer();
        
        server.listen(availablePort, serverConfig.default.host, () => {
            console.log(`🚀 Server running at http://${serverConfig.default.host}:${availablePort}/`);
            console.log(`📁 Serving files from: ${path.resolve('.')}`);
            console.log(`🏠 Home page: http://${serverConfig.default.host}:${availablePort}/${serverConfig.default.index}`);
            console.log(`🧪 Test page: http://${serverConfig.default.host}:${availablePort}/test-pages.html`);
            console.log('\n📊 Server Status:');
            console.log(`   Port: ${availablePort}`);
            console.log(`   CORS: ${serverConfig.default.cors ? 'Enabled' : 'Disabled'}`);
            console.log(`   Cache: ${serverConfig.default.cache ? 'Enabled' : 'Disabled'}`);
            console.log('\n🛑 Press Ctrl+C to stop the server');
        });

        // Handle server errors
        server.on('error', (err) => {
            console.error('❌ Server error:', err.message);
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${availablePort} is already in use. Trying another port...`);
                startServer();
            }
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down server...');
            server.close(() => {
                console.log('✅ Server stopped');
                process.exit(0);
            });
        });

        return server;
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.log('\n💡 Alternative options:');
        console.log('   1. Use VS Code Live Server extension');
        console.log('   2. Run: python -m http.server 8000');
        console.log('   3. Run: php -S localhost:8080');
        console.log('   4. Install live-server: npm install -g live-server && live-server');
        process.exit(1);
    }
}

// Export configuration and functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        config: serverConfig,
        createServer: createSimpleServer,
        checkPortAvailability,
        findAvailablePort,
        startServer
    };
}

// Auto-start if run directly
if (require.main === module) {
    startServer();
}
