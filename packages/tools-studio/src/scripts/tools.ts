/**
 * Script editing tool implementations
 */

import { StudioClient } from '@roblox-mcp/studio-bridge';
import { ToolBase } from '@roblox-mcp/core';

export class ScriptTools extends ToolBase {
  private client: StudioClient;

  constructor(client: StudioClient) {
    super({
      name: 'script-tools',
      description: 'Script editing tools',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });
    this.client = client;
  }

  async execute(args: unknown): Promise<unknown> {
    return { message: 'Script editing tools' };
  }

  async getScriptSource(instancePath: string, startLine?: number, endLine?: number) {
    if (!instancePath) {
      throw new Error('Instance path is required');
    }
    const response = await this.client.request('/api/get-script-source', { instancePath, startLine, endLine });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async setScriptSource(instancePath: string, source: string) {
    if (!instancePath || typeof source !== 'string') {
      throw new Error('Instance path and source code string are required');
    }
    const response = await this.client.request('/api/set-script-source', { instancePath, source });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async editScriptLines(instancePath: string, startLine: number, endLine: number, newContent: string) {
    if (!instancePath || !startLine || !endLine || typeof newContent !== 'string') {
      throw new Error('Instance path, startLine, endLine, and newContent are required');
    }
    const response = await this.client.request('/api/edit-script-lines', { instancePath, startLine, endLine, newContent });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async insertScriptLines(instancePath: string, afterLine: number, newContent: string) {
    if (!instancePath || typeof newContent !== 'string') {
      throw new Error('Instance path and newContent are required');
    }
    const response = await this.client.request('/api/insert-script-lines', { instancePath, afterLine: afterLine || 0, newContent });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async deleteScriptLines(instancePath: string, startLine: number, endLine: number) {
    if (!instancePath || !startLine || !endLine) {
      throw new Error('Instance path, startLine, and endLine are required');
    }
    const response = await this.client.request('/api/delete-script-lines', { instancePath, startLine, endLine });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }
}
