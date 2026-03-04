#!/usr/bin/env node
/**
 * Patches the kapture-mcp bridge.js to fix MCP initialization timeouts.
 *
 * ROOT CAUSE:
 *   kapture-mcp v2.1.2 bridge.js uses a hardcoded 1-second setTimeout before
 *   connecting to the WebSocket server. If the server isn't ready within that
 *   window, mcp2websocket queues the MCP `initialize` message and retries with
 *   exponential backoff (1s → 1.5s → 2.25s... up to 30s). Under slow startup
 *   conditions, the cumulative reconnect time can exceed the 60-second MCP
 *   client timeout, causing: McpError: MCP error -32001: Request timed out.
 *
 * FIX:
 *   Replace the hardcoded setTimeout with a polling loop that checks the HTTP
 *   health endpoint (GET http://localhost:61822/) and only starts the bridge
 *   once the server is confirmed ready. This guarantees the WebSocket connection
 *   is established before the first MCP message needs a response.
 *
 * USAGE:
 *   node scripts/patch-kapture-bridge.js
 *
 * Run this after reinstalling kapture-mcp via npx (e.g. after clearing npm cache).
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Find the kapture-mcp installation
function findKaptureBridge() {
    try {
        // Try npm list to find the package in npx cache
        const result = execSync('find /root/.npm/_npx -name "bridge.js" -path "*/kapture-mcp/dist/*" 2>/dev/null', { encoding: 'utf8' });
        const paths = result.trim().split('\n').filter(Boolean);
        if (paths.length > 0) return paths[0];
    } catch (_) {}

    // Fallback: check common locations
    const candidates = [
        '/root/.npm/_npx/fb86d621eaeabc65/node_modules/kapture-mcp/dist/bridge.js',
    ];
    for (const p of candidates) {
        if (existsSync(p)) return p;
    }
    return null;
}

const bridgePath = findKaptureBridge();
if (!bridgePath) {
    console.error('Could not find kapture-mcp bridge.js. Is kapture-mcp installed?');
    console.error('Run: npx kapture-mcp once to install it, then re-run this script.');
    process.exit(1);
}

console.log(`Found bridge.js at: ${bridgePath}`);

const original = readFileSync(bridgePath, 'utf8');

// Check if already patched
if (original.includes('waitForServer')) {
    console.log('bridge.js is already patched. Nothing to do.');
    process.exit(0);
}

// Check that it has the expected setTimeout pattern
if (!original.includes('setTimeout(')) {
    console.error('bridge.js does not have the expected setTimeout pattern. It may have changed in a newer version.');
    console.error('Manual inspection required.');
    process.exit(1);
}

const patched = `#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';
import http from 'http';
process.title = 'Kapture MCP Bridge';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MCPWebSocketBridge = require('mcp2websocket');
const serverPath = join(__dirname, 'index.js');
const serverProcess = spawn(process.execPath, [serverPath], {
    detached: true,
    stdio: 'ignore'
});
serverProcess.unref();

// Poll the HTTP health endpoint until the server is ready, then start the bridge.
// This replaces the hardcoded 1-second setTimeout which was insufficient and caused
// MCP initialize requests to queue and miss the 60-second client timeout.
async function waitForServer(url, maxWaitMs = 15000, intervalMs = 200) {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
        try {
            await new Promise((resolve, reject) => {
                const req = http.get(url, (res) => {
                    res.resume();
                    resolve();
                });
                req.on('error', reject);
                req.setTimeout(1000, () => {
                    req.destroy();
                    reject(new Error('timeout'));
                });
            });
            return true;
        } catch (_) {
            await new Promise(r => setTimeout(r, intervalMs));
        }
    }
    return false;
}

waitForServer('http://localhost:61822/').then((ready) => {
    if (!ready) {
        console.error('Kapture MCP server did not start within 15 seconds');
        process.exit(1);
    }
    try {
        const bridge = new MCPWebSocketBridge('ws://localhost:61822/mcp', {});
        bridge.start();
        // Keep the process alive
        process.stdin.resume();
    }
    catch (error) {
        console.error('Failed to start bridge:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=bridge.js.map
`;

writeFileSync(bridgePath, patched, 'utf8');
console.log('Successfully patched bridge.js.');
console.log('The bridge will now wait up to 15 seconds for the Kapture server to be ready');
console.log('before starting the WebSocket connection, preventing MCP initialization timeouts.');
