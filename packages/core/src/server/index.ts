/**
 * MCP Server implementations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { ServerCapabilities } from '@modelcontextprotocol/sdk/types.js';

export interface ServerConfig {
  name: string;
  version: string;
}

export class MCPServerBase {
  protected server: Server;
  protected config: ServerConfig;

  constructor(config: ServerConfig, capabilities: ServerCapabilities = {}) {
    this.config = config;
    this.server = new Server(
      {
        name: config.name,
        version: config.version,
      },
      {
        capabilities,
      }
    );
  }

  async connect(transport: StdioServerTransport): Promise<void> {
    await this.server.connect(transport);
  }

  getServer(): Server {
    return this.server;
  }

  getConfig(): ServerConfig {
    return this.config;
  }
}

export * from '@modelcontextprotocol/sdk/server/index.js';
export * from '@modelcontextprotocol/sdk/server/stdio.js';
export * from '@modelcontextprotocol/sdk/types.js';
