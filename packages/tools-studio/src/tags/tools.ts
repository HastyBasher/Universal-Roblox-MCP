/**
 * Tag (CollectionService) tool implementations
 */

import { StudioClient } from '@roblox-mcp/studio-bridge';
import { ToolBase } from '@roblox-mcp/core';

export class TagTools extends ToolBase {
  private client: StudioClient;

  constructor(client: StudioClient) {
    super({
      name: 'tag-tools',
      description: 'CollectionService tag manipulation tools',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });
    this.client = client;
  }

  async execute(args: unknown): Promise<unknown> {
    return { message: 'Tag manipulation tools' };
  }

  async getTags(instancePath: string) {
    if (!instancePath) {
      throw new Error('Instance path is required');
    }
    const response = await this.client.request('/api/get-tags', { instancePath });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async addTag(instancePath: string, tagName: string) {
    if (!instancePath || !tagName) {
      throw new Error('Instance path and tag name are required');
    }
    const response = await this.client.request('/api/add-tag', { instancePath, tagName });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async removeTag(instancePath: string, tagName: string) {
    if (!instancePath || !tagName) {
      throw new Error('Instance path and tag name are required');
    }
    const response = await this.client.request('/api/remove-tag', { instancePath, tagName });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async getTagged(tagName: string) {
    if (!tagName) {
      throw new Error('Tag name is required');
    }
    const response = await this.client.request('/api/get-tagged', { tagName });
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
