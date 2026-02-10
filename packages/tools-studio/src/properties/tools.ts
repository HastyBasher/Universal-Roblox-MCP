/**
 * Property manipulation tool implementations
 */

import { StudioClient } from '@roblox-mcp/studio-bridge';
import { ToolBase } from '@roblox-mcp/core';

export class PropertyTools extends ToolBase {
  private client: StudioClient;

  constructor(client: StudioClient) {
    super({
      name: 'property-tools',
      description: 'Property manipulation tools',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });
    this.client = client;
  }

  async execute(args: unknown): Promise<unknown> {
    return { message: 'Property manipulation tools' };
  }

  async setProperty(instancePath: string, propertyName: string, propertyValue: unknown) {
    if (!instancePath || !propertyName) {
      throw new Error('Instance path and property name are required');
    }
    const response = await this.client.request('/api/set-property', {
      instancePath,
      propertyName,
      propertyValue,
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

  async massSetProperty(paths: string[], propertyName: string, propertyValue: unknown) {
    if (!paths || paths.length === 0 || !propertyName) {
      throw new Error('Paths array and property name are required');
    }
    const response = await this.client.request('/api/mass-set-property', {
      paths,
      propertyName,
      propertyValue,
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

  async massGetProperty(paths: string[], propertyName: string) {
    if (!paths || paths.length === 0 || !propertyName) {
      throw new Error('Paths array and property name are required');
    }
    const response = await this.client.request('/api/mass-get-property', {
      paths,
      propertyName,
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

  async searchByProperty(propertyName: string, propertyValue: string) {
    if (!propertyName || !propertyValue) {
      throw new Error('Property name and value are required');
    }
    const response = await this.client.request('/api/search-by-property', {
      propertyName,
      propertyValue,
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

  async setCalculatedProperty(paths: string[], propertyName: string, formula: string, variables?: Record<string, unknown>) {
    if (!paths || paths.length === 0 || !propertyName || !formula) {
      throw new Error('Paths, property name, and formula are required');
    }
    const response = await this.client.request('/api/set-calculated-property', {
      paths,
      propertyName,
      formula,
      variables,
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

  async setRelativeProperty(
    paths: string[],
    propertyName: string,
    operation: 'add' | 'multiply' | 'divide' | 'subtract' | 'power',
    value: unknown,
    component?: 'X' | 'Y' | 'Z' | 'XScale' | 'XOffset' | 'YScale' | 'YOffset'
  ) {
    if (!paths || paths.length === 0 || !propertyName || !operation || value === undefined) {
      throw new Error('Paths, property name, operation, and value are required');
    }
    const response = await this.client.request('/api/set-relative-property', {
      paths,
      propertyName,
      operation,
      value,
      component,
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
}
