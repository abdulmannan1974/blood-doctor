# Blood Doctor - Claude Code Configuration

## Project Overview

Blood Doctor is a haematology learning web app. Projects live under `projects/`, each as a self-contained HTML/CSS/JS app.

## MCP Tools

This project uses **Kapture Browser Automation** (`kapture-mcp`) for browser automation tasks (screenshots, clicks, DOM inspection).

### Known Issue: Kapture MCP Initialization Timeout

**Symptom**: Claude reports `McpError: MCP error -32001: Request timed out` when using Kapture tools. The Kapture MCP server receives the `initialize` JSON-RPC request but doesn't respond within 60 seconds.

**Root Cause**: `kapture-mcp v2.1.2` `bridge.js` uses a hardcoded 1-second `setTimeout` before connecting to the WebSocket server (`ws://localhost:61822/mcp`). If the Kapture server process hasn't started within that 1-second window, `mcp2websocket` queues the `initialize` message and retries with exponential backoff (1s → 1.5s → 2.25s... up to 30s max). Under slow startup conditions the cumulative reconnect delay can exceed the 60-second MCP client timeout.

**Fix**: Replace the hardcoded 1-second wait with a polling loop that checks the HTTP health endpoint (`GET http://localhost:61822/`) and only starts the WebSocket bridge once the server is confirmed ready.

**Applying the fix**:

```bash
node scripts/patch-kapture-bridge.js
```

This patches the installed `bridge.js` in the npm cache in-place. Re-run it if kapture-mcp is reinstalled (npm cache cleared).

**What the patch does** (see `scripts/patch-kapture-bridge.js`):
- Polls `http://localhost:61822/` every 200ms for up to 15 seconds after spawning the server
- Only starts the `MCPWebSocketBridge` once the HTTP server responds (confirming the WebSocket endpoint is also ready)
- If the server doesn't start within 15 seconds, exits with an error instead of silently hanging

## Development Notes

- All projects are vanilla HTML/CSS/JS, no build step required
- Projects are mobile-first, designed for use with Claude Code on mobile
