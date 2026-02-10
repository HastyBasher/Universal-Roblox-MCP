/**
 * @roblox-mcp/community-plugin
 *
 * TypeScript plugin for Roblox MCP community tools
 */

import { ToolBase, ToolRegistry } from '@roblox-mcp/core';

export class CommunityPlugin {
  private registry: ToolRegistry;

  constructor() {
    this.registry = new ToolRegistry();
  }

  register(tool: ToolBase): void {
    this.registry.register(tool);
  }

  unregister(name: string): void {
    this.registry.unregister(name);
  }

  getRegistry(): ToolRegistry {
    return this.registry;
  }
}

export * from './tools/index.js';
