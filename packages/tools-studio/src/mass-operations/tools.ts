/**
 * Mass operation tool implementations
 */

import { StudioClient } from '@roblox-mcp/studio-bridge';
import { ToolBase } from '@roblox-mcp/core';

export class MassOperationTools extends ToolBase {
  private client: StudioClient;

  constructor(client: StudioClient) {
    super({
      name: 'mass-operation-tools',
      description: 'Mass operation tools for bulk changes',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });
    this.client = client;
  }

  async execute(args: unknown): Promise<unknown> {
    return { message: 'Mass operation tools' };
  }

  async createObject(className: string, parent: string, name?: string) {
    if (!className || !parent) {
      throw new Error('Class name and parent are required');
    }
    const response = await this.client.request('/api/create-object', {
      className,
      parent,
      name,
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async createObjectWithProperties(className: string, parent: string, name?: string, properties?: Record<string, unknown>) {
    if (!className || !parent) {
      throw new Error('Class name and parent are required');
    }
    const response = await this.client.request('/api/create-object', {
      className,
      parent,
      name,
      properties,
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async massCreateObjects(objects: Array<{ className: string; parent: string; name?: string }>) {
    if (!objects || objects.length === 0) {
      throw new Error('Objects array is required');
    }
    const response = await this.client.request('/api/mass-create-objects', { objects });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async massCreateObjectsWithProperties(objects: Array<{ className: string; parent: string; name?: string; properties?: Record<string, unknown> }>) {
    if (!objects || objects.length === 0) {
      throw new Error('Objects array is required');
    }
    const response = await this.client.request('/api/mass-create-objects-with-properties', { objects });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async deleteObject(instancePath: string) {
    if (!instancePath) {
      throw new Error('Instance path is required');
    }
    const response = await this.client.request('/api/delete-object', { instancePath });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async smartDuplicate(
    instancePath: string,
    count: number,
    options?: {
      namePattern?: string;
      positionOffset?: [number, number, number];
      rotationOffset?: [number, number, number];
      scaleOffset?: [number, number, number];
      propertyVariations?: Record<string, unknown[]>;
      targetParents?: string[];
    }
  ) {
    if (!instancePath || count < 1) {
      throw new Error('Instance path and count > 0 are required');
    }
    const response = await this.client.request('/api/smart-duplicate', {
      instancePath,
      count,
      options,
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async massDuplicate(
    duplications: Array<{
      instancePath: string;
      count: number;
      options?: {
        namePattern?: string;
        positionOffset?: [number, number, number];
        rotationOffset?: [number, number, number];
        scaleOffset?: [number, number, number];
        propertyVariations?: Record<string, unknown[]>;
        targetParents?: string[];
      };
    }>
  ) {
    if (!duplications || duplications.length === 0) {
      throw new Error('Duplications array is required');
    }
    const response = await this.client.request('/api/mass-duplicate', { duplications });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async getSelection() {
    const response = await this.client.request('/api/get-selection', {});
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
