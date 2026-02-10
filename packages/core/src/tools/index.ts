/**
 * Tool registry and base classes
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export interface ToolConfig {
  name: string;
  description: string;
  inputSchema: Tool['inputSchema'];
}

export abstract class ToolBase {
  protected config: ToolConfig;

  constructor(config: ToolConfig) {
    this.config = config;
  }

  abstract execute(args: unknown): Promise<unknown>;

  getSchema(): Tool {
    return {
      name: this.config.name,
      description: this.config.description,
      inputSchema: this.config.inputSchema,
    };
  }

  getName(): string {
    return this.config.name;
  }

  getDescription(): string {
    return this.config.description;
  }
}

export class ToolRegistry {
  private tools: Map<string, ToolBase> = new Map();

  register(tool: ToolBase): void {
    this.tools.set(tool.getName(), tool);
  }

  unregister(name: string): void {
    this.tools.delete(name);
  }

  get(name: string): ToolBase | undefined {
    return this.tools.get(name);
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  getAll(): ToolBase[] {
    return Array.from(this.tools.values());
  }

  getSchemas(): Tool[] {
    return this.getAll().map((tool) => tool.getSchema());
  }

  async execute(name: string, args: unknown): Promise<unknown> {
    const tool = this.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    return tool.execute(args);
  }
}

