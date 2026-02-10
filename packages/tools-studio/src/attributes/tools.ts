/**
 * Attribute tool implementations
 */

import { StudioClient } from '@roblox-mcp/studio-bridge';
import { ToolBase } from '@roblox-mcp/core';

export class AttributeTools extends ToolBase {
  private client: StudioClient;

  constructor(client: StudioClient) {
    super({
      name: 'attribute-tools',
      description: 'Attribute manipulation tools',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });
    this.client = client;
  }

  async execute(args: unknown): Promise<unknown> {
    return { message: 'Attribute manipulation tools' };
  }

  async getAttribute(instancePath: string, attributeName: string) {
    if (!instancePath || !attributeName) {
      throw new Error('Instance path and attribute name are required');
    }
    const response = await this.client.request('/api/get-attribute', { instancePath, attributeName });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async setAttribute(instancePath: string, attributeName: string, attributeValue: unknown, valueType?: string) {
    if (!instancePath || !attributeName) {
      throw new Error('Instance path and attribute name are required');
    }
    const response = await this.client.request('/api/set-attribute', { instancePath, attributeName, attributeValue, valueType });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async getAttributes(instancePath: string) {
    if (!instancePath) {
      throw new Error('Instance path is required');
    }
    const response = await this.client.request('/api/get-attributes', { instancePath });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async deleteAttribute(instancePath: string, attributeName: string) {
    if (!instancePath || !attributeName) {
      throw new Error('Instance path and attribute name are required');
    }
    const response = await this.client.request('/api/delete-attribute', { instancePath, attributeName });
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
