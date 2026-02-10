/**
 * HTTP Server for Studio plugin communication
 * Based on robloxstudio-mcp HTTP server
 */

import express, { Express } from 'express';
import cors from 'cors';
import { StudioTools } from '@roblox-mcp/tools-studio';
import { HTTPBridge } from '@roblox-mcp/studio-bridge';

export interface HttpServerOptions {
  port?: number;
  host?: string;
}

export function createHttpServer(tools: StudioTools, bridge: HTTPBridge, options: HttpServerOptions = {}): Express {
  const app: Express = express();
  let pluginConnected = false;
  let mcpServerActive = false;
  let lastMCPActivity = 0;
  let mcpServerStartTime = 0;
  let lastPluginActivity = 0;

  // Track MCP server lifecycle
  const setMCPServerActive = (active: boolean) => {
    mcpServerActive = active;
    if (active) {
      mcpServerStartTime = Date.now();
      lastMCPActivity = Date.now();
    } else {
      mcpServerStartTime = 0;
      lastMCPActivity = 0;
    }
  };

  const trackMCPActivity = () => {
    if (mcpServerActive) {
      lastMCPActivity = Date.now();
    }
  };

  const isMCPServerActive = () => {
    if (!mcpServerActive) return false;
    const now = Date.now();
    const mcpRecent = (now - lastMCPActivity) < 15000;
    const pluginPollingRecent = (now - lastPluginActivity) < 15000;
    return mcpRecent || pluginPollingRecent;
  };

  const isPluginConnected = () => {
    return pluginConnected && (Date.now() - lastPluginActivity < 10000);
  };

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'roblox-unified-mcp',
      pluginConnected,
      mcpServerActive: isMCPServerActive(),
      uptime: mcpServerActive ? Date.now() - mcpServerStartTime : 0,
    });
  });

  // Plugin readiness endpoint
  app.post('/ready', (req, res) => {
    pluginConnected = true;
    lastPluginActivity = Date.now();
    res.json({ success: true });
  });

  // Plugin disconnect endpoint
  app.post('/disconnect', (req, res) => {
    pluginConnected = false;
    // Don't call private method, let the bridge handle it internally
    res.json({ success: true });
  });

  // Enhanced status endpoint
  app.get('/status', (req, res) => {
    res.json({
      pluginConnected,
      mcpServerActive: isMCPServerActive(),
      lastMCPActivity,
      uptime: mcpServerActive ? Date.now() - mcpServerStartTime : 0,
    });
  });

  // Enhanced polling endpoint for Studio plugin
  app.get('/poll', (req, res) => {
    if (!pluginConnected) {
      pluginConnected = true;
    }
    lastPluginActivity = Date.now();
    trackMCPActivity();

    if (!isMCPServerActive()) {
      res.status(503).json({
        error: 'MCP server not connected',
        pluginConnected: true,
        mcpConnected: false,
        request: null,
      });
      return;
    }

    trackMCPActivity();

    const pendingRequest = (bridge as any).getPendingRequest?.();
    if (pendingRequest) {
      res.json({
        request: pendingRequest.request,
        requestId: pendingRequest.requestId,
        mcpConnected: true,
        pluginConnected: true,
      });
    } else {
      res.json({
        request: null,
        mcpConnected: true,
        pluginConnected: true,
      });
    }
  });

  // Response endpoint for Studio plugin
  app.post('/response', (req, res) => {
    const { requestId, response, error } = req.body;

    if (error) {
      (bridge as any).rejectRequest?.(requestId, error);
    } else {
      (bridge as any).resolveRequest?.(requestId, response);
    }

    res.json({ success: true });
  });

  // Middleware to track MCP activity for all MCP endpoints
  app.use('/mcp/*', (req, res, next) => {
    trackMCPActivity();
    next();
  });

  // Add methods to control and check server status
  (app as any).isPluginConnected = isPluginConnected;
  (app as any).setMCPServerActive = setMCPServerActive;
  (app as any).isMCPServerActive = isMCPServerActive;
  (app as any).trackMCPActivity = trackMCPActivity;

  return app;
}
