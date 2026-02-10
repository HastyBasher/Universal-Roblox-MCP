/**
 * Main Studio tools class
 * Based on robloxstudio-mcp tools implementation
 */

import { StudioClient } from '@roblox-mcp/studio-bridge';
import { ToolBase } from '@roblox-mcp/core';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export class StudioTools extends ToolBase {
  private client: StudioClient;

  constructor(client: StudioClient) {
    super({
      name: 'studio-tools',
      description: 'Roblox Studio interaction tools',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });
    this.client = client;
  }

  async execute(args: unknown): Promise<unknown> {
    // This is a container for all studio tools
    return { message: 'Studio tools container' };
  }

  // File System Tools
  async getFileTree(path: string = '') {
    const response = await this.client.request('/api/file-tree', { path });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async searchFiles(query: string, searchType: string = 'name') {
    const response = await this.client.request('/api/search-files', { query, searchType });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  // Studio Context Tools
  async getPlaceInfo() {
    const response = await this.client.request('/api/place-info', {});
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async getServices(serviceName?: string) {
    const response = await this.client.request('/api/services', { serviceName });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async searchObjects(query: string, searchType: string = 'name', propertyName?: string) {
    const response = await this.client.request('/api/search-objects', {
      query,
      searchType,
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

  // Property & Instance Tools
  async getInstanceProperties(instancePath: string) {
    if (!instancePath) {
      throw new Error('Instance path is required for get_instance_properties');
    }
    const response = await this.client.request('/api/instance-properties', { instancePath });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  async getInstanceChildren(instancePath: string) {
    if (!instancePath) {
      throw new Error('Instance path is required for get_instance_children');
    }
    const response = await this.client.request('/api/instance-children', { instancePath });
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
      throw new Error('Property name and value are required for search_by_property');
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

  async getClassInfo(className: string) {
    if (!className) {
      throw new Error('Class name is required for get_class_info');
    }
    const response = await this.client.request('/api/class-info', { className });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  // Project Tools
  async getProjectStructure(path?: string, maxDepth?: number, scriptsOnly?: boolean) {
    const response = await this.client.request('/api/project-structure', {
      path,
      maxDepth,
      scriptsOnly,
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

  // Property Modification Tools
  async setProperty(instancePath: string, propertyName: string, propertyValue: unknown) {
    if (!instancePath || !propertyName) {
      throw new Error('Instance path and property name are required for set_property');
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
      throw new Error('Paths array and property name are required for mass_set_property');
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
      throw new Error('Paths array and property name are required for mass_get_property');
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

  // Object Creation Tools
  async createObject(className: string, parent: string, name?: string) {
    if (!className || !parent) {
      throw new Error('Class name and parent are required for create_object');
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
      throw new Error('Class name and parent are required for create_object_with_properties');
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
      throw new Error('Objects array is required for mass_create_objects');
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
      throw new Error('Objects array is required for mass_create_objects_with_properties');
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
      throw new Error('Instance path is required for delete_object');
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

  // Smart Duplication Tools
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
      throw new Error('Instance path and count > 0 are required for smart_duplicate');
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
      throw new Error('Duplications array is required for mass_duplicate');
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

  // Calculated Property Tools
  async setCalculatedProperty(paths: string[], propertyName: string, formula: string, variables?: Record<string, unknown>) {
    if (!paths || paths.length === 0 || !propertyName || !formula) {
      throw new Error('Paths, property name, and formula are required for set_calculated_property');
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

  // Relative Property Tools
  async setRelativeProperty(
    paths: string[],
    propertyName: string,
    operation: 'add' | 'multiply' | 'divide' | 'subtract' | 'power',
    value: unknown,
    component?: 'X' | 'Y' | 'Z' | 'XScale' | 'XOffset' | 'YScale' | 'YOffset'
  ) {
    if (!paths || paths.length === 0 || !propertyName || !operation || value === undefined) {
      throw new Error('Paths, property name, operation, and value are required for set_relative_property');
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

  // Script Management Tools
  async getScriptSource(instancePath: string, startLine?: number, endLine?: number) {
    if (!instancePath) {
      throw new Error('Instance path is required for get_script_source');
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
      throw new Error('Instance path and source code string are required for set_script_source');
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

  // Partial Script Editing Tools
  async editScriptLines(instancePath: string, startLine: number, endLine: number, newContent: string) {
    if (!instancePath || !startLine || !endLine || typeof newContent !== 'string') {
      throw new Error('Instance path, startLine, endLine, and newContent are required for edit_script_lines');
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
      throw new Error('Instance path and newContent are required for insert_script_lines');
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
      throw new Error('Instance path, startLine, and endLine are required for delete_script_lines');
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

  // Attribute Tools
  async getAttribute(instancePath: string, attributeName: string) {
    if (!instancePath || !attributeName) {
      throw new Error('Instance path and attribute name are required for get_attribute');
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
      throw new Error('Instance path and attribute name are required for set_attribute');
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
      throw new Error('Instance path is required for get_attributes');
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
      throw new Error('Instance path and attribute name are required for delete_attribute');
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

  // Tag Tools (CollectionService)
  async getTags(instancePath: string) {
    if (!instancePath) {
      throw new Error('Instance path is required for get_tags');
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
      throw new Error('Instance path and tag name are required for add_tag');
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
      throw new Error('Instance path and tag name are required for remove_tag');
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
      throw new Error('Tag name is required for get_tagged');
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

  // Get all tool schemas for MCP registration
  getSchemas(): Tool[] {
    return [
      // Instance Hierarchy Tools
      {
        name: 'get_file_tree',
        description: 'Get the Roblox instance hierarchy tree from Roblox Studio. Returns game instances (Parts, Scripts, Models, Folders, etc.) as a tree structure. NOTE: This operates on Roblox Studio instances, NOT local filesystem files.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Roblox instance path to start from using dot notation (e.g., "game.Workspace", "game.ServerScriptService"). Defaults to game root if empty.',
              default: '',
            },
          },
        },
      },
      {
        name: 'search_files',
        description: 'Search for Roblox instances by name, class type, or script content. NOTE: This searches Roblox Studio instances, NOT local filesystem files.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query - instance name, class type (e.g., "Script", "Part"), or Lua code pattern',
            },
            searchType: {
              type: 'string',
              enum: ['name', 'type', 'content'],
              description: 'Type of search: "name" for instance names, "type" for class names, "content" for script source code',
              default: 'name',
            },
          },
          required: ['query'],
        },
      },
      // Studio Context Tools
      {
        name: 'get_place_info',
        description: 'Get place ID, name, and game settings',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_services',
        description: 'Get available Roblox services and their children',
        inputSchema: {
          type: 'object',
          properties: {
            serviceName: {
              type: 'string',
              description: 'Optional specific service name to query',
            },
          },
        },
      },
      {
        name: 'search_objects',
        description: 'Find instances by name, class, or properties',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            searchType: {
              type: 'string',
              enum: ['name', 'class', 'property'],
              description: 'Type of search to perform',
              default: 'name',
            },
            propertyName: {
              type: 'string',
              description: 'Property name when searchType is "property"',
            },
          },
          required: ['query'],
        },
      },
      // Property & Instance Tools
      {
        name: 'get_instance_properties',
        description: 'Get all properties of a specific Roblox instance in Studio',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace.Part", "game.ServerScriptService.MainScript", "game.ReplicatedStorage.ModuleScript")',
            },
          },
          required: ['instancePath'],
        },
      },
      {
        name: 'get_instance_children',
        description: 'Get child instances and their class types from a Roblox parent instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace", "game.ServerScriptService")',
            },
          },
          required: ['instancePath'],
        },
      },
      {
        name: 'search_by_property',
        description: 'Find objects with specific property values',
        inputSchema: {
          type: 'object',
          properties: {
            propertyName: {
              type: 'string',
              description: 'Name of the property to search',
            },
            propertyValue: {
              type: 'string',
              description: 'Value to search for',
            },
          },
          required: ['propertyName', 'propertyValue'],
        },
      },
      {
        name: 'get_class_info',
        description: 'Get available properties/methods for Roblox classes',
        inputSchema: {
          type: 'object',
          properties: {
            className: {
              type: 'string',
              description: 'Roblox class name',
            },
          },
          required: ['className'],
        },
      },
      // Project Tools
      {
        name: 'get_project_structure',
        description: 'Get complete game hierarchy. IMPORTANT: Use maxDepth parameter (default: 3) to explore deeper levels of the hierarchy. Set higher values like 5-10 for comprehensive exploration',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Optional path to start from (defaults to workspace root)',
              default: '',
            },
            maxDepth: {
              type: 'number',
              description: 'Maximum depth to traverse (default: 3). RECOMMENDED: Use 5-10 for thorough exploration. Higher values provide more complete structure',
              default: 3,
            },
            scriptsOnly: {
              type: 'boolean',
              description: 'Show only scripts and script containers',
              default: false,
            },
          },
        },
      },
      // Property Modification Tools
      {
        name: 'set_property',
        description: 'Set a property on any Roblox instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Path to the instance (e.g., "game.Workspace.Part")',
            },
            propertyName: {
              type: 'string',
              description: 'Name of the property to set',
            },
            propertyValue: {
              description: 'Value to set the property to (any type)',
            },
          },
          required: ['instancePath', 'propertyName', 'propertyValue'],
        },
      },
      {
        name: 'mass_set_property',
        description: 'Set the same property on multiple instances at once',
        inputSchema: {
          type: 'object',
          properties: {
            paths: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of instance paths to modify',
            },
            propertyName: {
              type: 'string',
              description: 'Name of the property to set',
            },
            propertyValue: {
              description: 'Value to set the property to (any type)',
            },
          },
          required: ['paths', 'propertyName', 'propertyValue'],
        },
      },
      {
        name: 'mass_get_property',
        description: 'Get the same property from multiple instances at once',
        inputSchema: {
          type: 'object',
          properties: {
            paths: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of instance paths to read from',
            },
            propertyName: {
              type: 'string',
              description: 'Name of the property to get',
            },
          },
          required: ['paths', 'propertyName'],
        },
      },
      // Object Creation/Deletion Tools
      {
        name: 'create_object',
        description: 'Create a new Roblox object instance (basic, without properties)',
        inputSchema: {
          type: 'object',
          properties: {
            className: {
              type: 'string',
              description: 'Roblox class name (e.g., "Part", "Script", "Folder")',
            },
            parent: {
              type: 'string',
              description: 'Path to the parent instance (e.g., "game.Workspace")',
            },
            name: {
              type: 'string',
              description: 'Optional name for the new object',
            },
          },
          required: ['className', 'parent'],
        },
      },
      {
        name: 'create_object_with_properties',
        description: 'Create a new Roblox object instance with initial properties',
        inputSchema: {
          type: 'object',
          properties: {
            className: {
              type: 'string',
              description: 'Roblox class name (e.g., "Part", "Script", "Folder")',
            },
            parent: {
              type: 'string',
              description: 'Path to the parent instance (e.g., "game.Workspace")',
            },
            name: {
              type: 'string',
              description: 'Optional name for the new object',
            },
            properties: {
              type: 'object',
              description: 'Properties to set on creation',
            },
          },
          required: ['className', 'parent'],
        },
      },
      {
        name: 'mass_create_objects',
        description: 'Create multiple objects at once (basic, without properties)',
        inputSchema: {
          type: 'object',
          properties: {
            objects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  className: {
                    type: 'string',
                    description: 'Roblox class name',
                  },
                  parent: {
                    type: 'string',
                    description: 'Path to the parent instance',
                  },
                  name: {
                    type: 'string',
                    description: 'Optional name for the object',
                  },
                },
                required: ['className', 'parent'],
              },
              description: 'Array of objects to create',
            },
          },
          required: ['objects'],
        },
      },
      {
        name: 'mass_create_objects_with_properties',
        description: 'Create multiple objects at once with initial properties',
        inputSchema: {
          type: 'object',
          properties: {
            objects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  className: {
                    type: 'string',
                    description: 'Roblox class name',
                  },
                  parent: {
                    type: 'string',
                    description: 'Path to the parent instance',
                  },
                  name: {
                    type: 'string',
                    description: 'Optional name for the object',
                  },
                  properties: {
                    type: 'object',
                    description: 'Properties to set on creation',
                  },
                },
                required: ['className', 'parent'],
              },
              description: 'Array of objects to create with properties',
            },
          },
          required: ['objects'],
        },
      },
      {
        name: 'delete_object',
        description: 'Delete a Roblox object instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Path to the instance to delete',
            },
          },
          required: ['instancePath'],
        },
      },
      // Smart Duplication Tools
      {
        name: 'smart_duplicate',
        description: 'Smart duplication with automatic naming, positioning, and property variations',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Path to the instance to duplicate',
            },
            count: {
              type: 'number',
              description: 'Number of duplicates to create',
            },
            options: {
              type: 'object',
              properties: {
                namePattern: {
                  type: 'string',
                  description: 'Name pattern with {n} placeholder (e.g., "Button{n}")',
                },
                positionOffset: {
                  type: 'array',
                  items: { type: 'number' },
                  minItems: 3,
                  maxItems: 3,
                  description: 'X, Y, Z offset per duplicate',
                },
                rotationOffset: {
                  type: 'array',
                  items: { type: 'number' },
                  minItems: 3,
                  maxItems: 3,
                  description: 'X, Y, Z rotation offset per duplicate',
                },
                scaleOffset: {
                  type: 'array',
                  items: { type: 'number' },
                  minItems: 3,
                  maxItems: 3,
                  description: 'X, Y, Z scale multiplier per duplicate',
                },
                propertyVariations: {
                  type: 'object',
                  description: 'Property name to array of values',
                },
                targetParents: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Different parent for each duplicate',
                },
              },
            },
          },
          required: ['instancePath', 'count'],
        },
      },
      {
        name: 'mass_duplicate',
        description: 'Perform multiple smart duplications at once',
        inputSchema: {
          type: 'object',
          properties: {
            duplications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  instancePath: {
                    type: 'string',
                    description: 'Path to the instance to duplicate',
                  },
                  count: {
                    type: 'number',
                    description: 'Number of duplicates to create',
                  },
                  options: {
                    type: 'object',
                    properties: {
                      namePattern: {
                        type: 'string',
                        description: 'Name pattern with {n} placeholder',
                      },
                      positionOffset: {
                        type: 'array',
                        items: { type: 'number' },
                        minItems: 3,
                        maxItems: 3,
                        description: 'X, Y, Z offset per duplicate',
                      },
                      rotationOffset: {
                        type: 'array',
                        items: { type: 'number' },
                        minItems: 3,
                        maxItems: 3,
                        description: 'X, Y, Z rotation offset per duplicate',
                      },
                      scaleOffset: {
                        type: 'array',
                        items: { type: 'number' },
                        minItems: 3,
                        maxItems: 3,
                        description: 'X, Y, Z scale multiplier per duplicate',
                      },
                      propertyVariations: {
                        type: 'object',
                        description: 'Property name to array of values',
                      },
                      targetParents: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Different parent for each duplicate',
                      },
                    },
                  },
                },
                required: ['instancePath', 'count'],
              },
              description: 'Array of duplication operations',
            },
          },
          required: ['duplications'],
        },
      },
      // Calculated Property Tools
      {
        name: 'set_calculated_property',
        description: 'Set properties using mathematical formulas and variables',
        inputSchema: {
          type: 'object',
          properties: {
            paths: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of instance paths to modify',
            },
            propertyName: {
              type: 'string',
              description: 'Name of the property to set',
            },
            formula: {
              type: 'string',
              description: 'Mathematical formula (e.g., "Position.magnitude * 2", "index * 50")',
            },
            variables: {
              type: 'object',
              description: 'Additional variables for the formula',
            },
          },
          required: ['paths', 'propertyName', 'formula'],
        },
      },
      // Relative Property Tools
      {
        name: 'set_relative_property',
        description: 'Modify properties relative to their current values',
        inputSchema: {
          type: 'object',
          properties: {
            paths: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of instance paths to modify',
            },
            propertyName: {
              type: 'string',
              description: 'Name of the property to modify',
            },
            operation: {
              type: 'string',
              enum: ['add', 'multiply', 'divide', 'subtract', 'power'],
              description: 'Mathematical operation to perform',
            },
            value: {
              description: 'Value to use in the operation',
            },
            component: {
              type: 'string',
              enum: ['X', 'Y', 'Z', 'XScale', 'XOffset', 'YScale', 'YOffset'],
              description: 'For Vector3: X, Y, Z. For UDim2: XScale, XOffset, YScale, YOffset (value must be a number)',
            },
          },
          required: ['paths', 'propertyName', 'operation', 'value'],
        },
      },
      // Script Management Tools
      {
        name: 'get_script_source',
        description: 'Get the source code of a Roblox script (LocalScript, Script, or ModuleScript). Returns both "source" (raw code) and "numberedSource" (with line numbers prefixed like "1: code"). Use numberedSource to accurately identify line numbers for editing. For large scripts (>1500 lines), use startLine/endLine to read specific sections.',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path to the script using dot notation (e.g., "game.ServerScriptService.MainScript", "game.StarterPlayer.StarterPlayerScripts.LocalScript")',
            },
            startLine: {
              type: 'number',
              description: 'Optional: Start line number (1-indexed). Use for reading specific sections of large scripts.',
            },
            endLine: {
              type: 'number',
              description: 'Optional: End line number (inclusive). Use for reading specific sections of large scripts.',
            },
          },
          required: ['instancePath'],
        },
      },
      {
        name: 'set_script_source',
        description: 'Replace the entire source code of a Roblox script. Uses ScriptEditorService:UpdateSourceAsync (works with open editors). For partial edits, prefer edit_script_lines, insert_script_lines, or delete_script_lines.',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path to the script (e.g., "game.ServerScriptService.MainScript")',
            },
            source: {
              type: 'string',
              description: 'New source code for the script',
            },
          },
          required: ['instancePath', 'source'],
        },
      },
      // Partial Script Editing Tools
      {
        name: 'edit_script_lines',
        description: 'Replace specific lines in a Roblox script without rewriting the entire source. IMPORTANT: Use the "numberedSource" field from get_script_source to identify the correct line numbers. Lines are 1-indexed and ranges are inclusive.',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path to the script (e.g., "game.ServerScriptService.MainScript")',
            },
            startLine: {
              type: 'number',
              description: 'First line to replace (1-indexed). Get this from the "numberedSource" field.',
            },
            endLine: {
              type: 'number',
              description: 'Last line to replace (inclusive). Get this from the "numberedSource" field.',
            },
            newContent: {
              type: 'string',
              description: 'New content to replace the specified lines (can be multiple lines separated by newlines)',
            },
          },
          required: ['instancePath', 'startLine', 'endLine', 'newContent'],
        },
      },
      {
        name: 'insert_script_lines',
        description: 'Insert new lines into a Roblox script at a specific position. IMPORTANT: Use the "numberedSource" field from get_script_source to identify the correct line numbers.',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path to the script (e.g., "game.ServerScriptService.MainScript")',
            },
            afterLine: {
              type: 'number',
              description: 'Insert after this line number (0 = insert at very beginning, 1 = after first line). Get line numbers from "numberedSource".',
              default: 0,
            },
            newContent: {
              type: 'string',
              description: 'Content to insert (can be multiple lines separated by newlines)',
            },
          },
          required: ['instancePath', 'newContent'],
        },
      },
      {
        name: 'delete_script_lines',
        description: 'Delete specific lines from a Roblox script. IMPORTANT: Use the "numberedSource" field from get_script_source to identify the correct line numbers.',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path to the script (e.g., "game.ServerScriptService.MainScript")',
            },
            startLine: {
              type: 'number',
              description: 'First line to delete (1-indexed). Get this from the "numberedSource" field.',
            },
            endLine: {
              type: 'number',
              description: 'Last line to delete (inclusive). Get this from the "numberedSource" field.',
            },
          },
          required: ['instancePath', 'startLine', 'endLine'],
        },
      },
      // Attribute Tools
      {
        name: 'get_attribute',
        description: 'Get a single attribute value from a Roblox instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace.Part", "game.ServerStorage.DataStore")',
            },
            attributeName: {
              type: 'string',
              description: 'Name of the attribute to get',
            },
          },
          required: ['instancePath', 'attributeName'],
        },
      },
      {
        name: 'set_attribute',
        description: 'Set an attribute value on a Roblox instance. Supports string, number, boolean, Vector3, Color3, UDim2, and BrickColor.',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace.Part")',
            },
            attributeName: {
              type: 'string',
              description: 'Name of the attribute to set',
            },
            attributeValue: {
              description: 'Value to set. For Vector3: {X, Y, Z}, Color3: {R, G, B}, UDim2: {X: {Scale, Offset}, Y: {Scale, Offset}}',
            },
            valueType: {
              type: 'string',
              description: 'Optional type hint: "Vector3", "Color3", "UDim2", "BrickColor"',
            },
          },
          required: ['instancePath', 'attributeName', 'attributeValue'],
        },
      },
      {
        name: 'get_attributes',
        description: 'Get all attributes on a Roblox instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace.Part")',
            },
          },
          required: ['instancePath'],
        },
      },
      {
        name: 'delete_attribute',
        description: 'Delete an attribute from a Roblox instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace.Part")',
            },
            attributeName: {
              type: 'string',
              description: 'Name of the attribute to delete',
            },
          },
          required: ['instancePath', 'attributeName'],
        },
      },
      // Tag Tools (CollectionService)
      {
        name: 'get_tags',
        description: 'Get all CollectionService tags on a Roblox instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace.Part")',
            },
          },
          required: ['instancePath'],
        },
      },
      {
        name: 'add_tag',
        description: 'Add a CollectionService tag to a Roblox instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace.Part")',
            },
            tagName: {
              type: 'string',
              description: 'Name of the tag to add',
            },
          },
          required: ['instancePath', 'tagName'],
        },
      },
      {
        name: 'remove_tag',
        description: 'Remove a CollectionService tag from a Roblox instance',
        inputSchema: {
          type: 'object',
          properties: {
            instancePath: {
              type: 'string',
              description: 'Roblox instance path using dot notation (e.g., "game.Workspace.Part")',
            },
            tagName: {
              type: 'string',
              description: 'Name of the tag to remove',
            },
          },
          required: ['instancePath', 'tagName'],
        },
      },
      {
        name: 'get_tagged',
        description: 'Get all instances with a specific tag',
        inputSchema: {
          type: 'object',
          properties: {
            tagName: {
              type: 'string',
              description: 'Name of the tag to search for',
            },
          },
          required: ['tagName'],
        },
      },
      {
        name: 'get_selection',
        description: 'Get all currently selected objects',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }
}
