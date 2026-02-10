/**
 * Tool proxy for mcp-roblox-docs
 *
 * Proxies all 27 documentation tools from the Python MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolBase } from '@roblox-mcp/core';
import { PythonBridge } from '../bridge/index.js';

/**
 * Input schemas for all mcp-roblox-docs tools
 */
const ToolSchemas = {
  // Core API Tools
  roblox_search: {
    type: 'object' as const,
    properties: {
      query: { type: 'string', description: 'Search query for Roblox API' },
      fuzzy: { type: 'boolean', description: 'Enable fuzzy search for typo tolerance', default: true },
    },
    required: ['query'] as string[],
  },
  roblox_get_class: {
    type: 'object' as const,
    properties: {
      className: { type: 'string', description: 'Class name (e.g., TweenService)' },
    },
    required: ['className'] as string[],
  },
  roblox_get_member: {
    type: 'object' as const,
    properties: {
      className: { type: 'string', description: 'Class name' },
      memberName: { type: 'string', description: 'Member name (property/method/event)' },
    },
    required: ['className', 'memberName'] as string[],
  },
  roblox_get_enum: {
    type: 'object' as const,
    properties: {
      enumName: { type: 'string', description: 'Enum name (e.g., EasingStyle)' },
    },
    required: ['enumName'] as string[],
  },
  roblox_check_deprecated: {
    type: 'object' as const,
    properties: {
      apiName: { type: 'string', description: 'API name to check (class or member)' },
    },
    required: ['apiName'] as string[],
  },
  roblox_list_services: {
    type: 'object' as const,
    properties: {},
  },

  // Extended API Tools
  roblox_get_inheritance: {
    type: 'object' as const,
    properties: {
      className: { type: 'string', description: 'Class name' },
    },
    required: ['className'] as string[],
  },
  roblox_search_devforum: {
    type: 'object' as const,
    properties: {
      query: { type: 'string', description: 'DevForum search query' },
    },
    required: ['query'] as string[],
  },
  roblox_recent_changes: {
    type: 'object' as const,
    properties: {},
  },
  roblox_list_enums: {
    type: 'object' as const,
    properties: {},
  },
  roblox_sync: {
    type: 'object' as const,
    properties: {
      language: {
        type: 'string',
        description: 'Language code (e.g., en-us, id-id, ja-jp, ko-kr, zh-cn)',
        default: 'en-us',
      },
    },
  },
  roblox_health: {
    type: 'object' as const,
    properties: {},
  },

  // FastFlags Tools
  roblox_search_fflags: {
    type: 'object' as const,
    properties: {
      query: { type: 'string', description: 'FastFlag search query' },
    },
    required: ['query'] as string[],
  },
  roblox_get_fflag: {
    type: 'object' as const,
    properties: {
      fflagName: { type: 'string', description: 'FastFlag name' },
    },
    required: ['fflagName'] as string[],
  },
  roblox_list_fflag_prefixes: {
    type: 'object' as const,
    properties: {},
  },

  // Luau Globals Tools
  roblox_get_luau_globals: {
    type: 'object' as const,
    properties: {},
  },
  roblox_get_luau_global: {
    type: 'object' as const,
    properties: {
      globalName: { type: 'string', description: 'Global function name (e.g., print, typeof)' },
    },
    required: ['globalName'] as string[],
  },

  // Open Cloud API Tools
  roblox_search_cloud_api: {
    type: 'object' as const,
    properties: {
      query: { type: 'string', description: 'Cloud API search query' },
    },
    required: ['query'] as string[],
  },
  roblox_get_cloud_endpoint: {
    type: 'object' as const,
    properties: {
      endpointPath: { type: 'string', description: 'Endpoint path (e.g., /v1/universes/{universeId}/topics/{topic})' },
    },
    required: ['endpointPath'] as string[],
  },
  roblox_list_cloud_apis: {
    type: 'object' as const,
    properties: {},
  },

  // Luau Language Tools
  roblox_get_luau_topic: {
    type: 'object' as const,
    properties: {
      topic: { type: 'string', description: 'Luau documentation topic' },
    },
    required: ['topic'] as string[],
  },
  roblox_list_luau_topics: {
    type: 'object' as const,
    properties: {},
  },

  // DataType Tools
  roblox_get_datatype: {
    type: 'object' as const,
    properties: {
      datatypeName: { type: 'string', description: 'Datatype name (e.g., Vector3, CFrame, Color3)' },
    },
    required: ['datatypeName'] as string[],
  },
  roblox_list_datatypes: {
    type: 'object' as const,
    properties: {},
  },

  // Library Tools
  roblox_get_library: {
    type: 'object' as const,
    properties: {
      libraryName: { type: 'string', description: 'Library name (e.g., math, string, table)' },
    },
    required: ['libraryName'] as string[],
  },
  roblox_get_library_function: {
    type: 'object' as const,
    properties: {
      libraryName: { type: 'string', description: 'Library name' },
      functionName: { type: 'string', description: 'Function name' },
    },
    required: ['libraryName', 'functionName'] as string[],
  },
  roblox_list_libraries: {
    type: 'object' as const,
    properties: {},
  },
} as const;

/**
 * Tool definitions for all 27 mcp-roblox-docs tools
 */
const ToolDefinitions: Record<string, { name: string; description: string; inputSchema: Tool['inputSchema'] }> = {
  // Core API Tools
  roblox_search: {
    name: 'roblox_search',
    description: 'Full-text search across all Roblox API (850+ classes, 35,000+ members). Supports fuzzy search for typo tolerance.',
    inputSchema: ToolSchemas.roblox_search,
  },
  roblox_get_class: {
    name: 'roblox_get_class',
    description: 'Get complete class information including all members, metadata, category, and preferred parent.',
    inputSchema: ToolSchemas.roblox_get_class,
  },
  roblox_get_member: {
    name: 'roblox_get_member',
    description: 'Get detailed member information (property/method/event) including parameters, return types, and descriptions.',
    inputSchema: ToolSchemas.roblox_get_member,
  },
  roblox_get_enum: {
    name: 'roblox_get_enum',
    description: 'Get enum with all possible values and their descriptions.',
    inputSchema: ToolSchemas.roblox_get_enum,
  },
  roblox_check_deprecated: {
    name: 'roblox_check_deprecated',
    description: 'Check if an API is deprecated and get recommended alternatives.',
    inputSchema: ToolSchemas.roblox_check_deprecated,
  },
  roblox_list_services: {
    name: 'roblox_list_services',
    description: 'List all 290+ Roblox services that can be accessed via GetService().',
    inputSchema: ToolSchemas.roblox_list_services,
  },

  // Extended API Tools
  roblox_get_inheritance: {
    name: 'roblox_get_inheritance',
    description: 'Get class hierarchy (superclass) and all subclasses.',
    inputSchema: ToolSchemas.roblox_get_inheritance,
  },
  roblox_search_devforum: {
    name: 'roblox_search_devforum',
    description: 'Search DevForum threads with intelligent caching (1 hour TTL).',
    inputSchema: ToolSchemas.roblox_search_devforum,
  },
  roblox_recent_changes: {
    name: 'roblox_recent_changes',
    description: 'Get API version information and recent changes.',
    inputSchema: ToolSchemas.roblox_recent_changes,
  },
  roblox_list_enums: {
    name: 'roblox_list_enums',
    description: 'List all 500+ available enums in the Roblox API.',
    inputSchema: ToolSchemas.roblox_list_enums,
  },
  roblox_sync: {
    name: 'roblox_sync',
    description: 'Force sync data from Roblox sources or change documentation language. Supports 15 languages.',
    inputSchema: ToolSchemas.roblox_sync,
  },
  roblox_health: {
    name: 'roblox_health',
    description: 'Get server status, statistics, cache information, and diagnostics.',
    inputSchema: ToolSchemas.roblox_health,
  },

  // FastFlags Tools
  roblox_search_fflags: {
    name: 'roblox_search_fflags',
    description: 'Search 14,000+ FastFlags by name (FFlag, FInt, DFFlag, etc.).',
    inputSchema: ToolSchemas.roblox_search_fflags,
  },
  roblox_get_fflag: {
    name: 'roblox_get_fflag',
    description: 'Get specific FastFlag details including type and default value.',
    inputSchema: ToolSchemas.roblox_get_fflag,
  },
  roblox_list_fflag_prefixes: {
    name: 'roblox_list_fflag_prefixes',
    description: 'Explain FastFlag prefix types (FFlag, FInt, DFFlag, DFInt, SFInt, SFFlag, FFlagDebugGame).',
    inputSchema: ToolSchemas.roblox_list_fflag_prefixes,
  },

  // Luau Globals Tools
  roblox_get_luau_globals: {
    name: 'roblox_get_luau_globals',
    description: 'List all 87 Luau global functions and types (print, warn, typeof, pairs, etc.).',
    inputSchema: ToolSchemas.roblox_get_luau_globals,
  },
  roblox_get_luau_global: {
    name: 'roblox_get_luau_global',
    description: 'Get specific global function details with signature and description.',
    inputSchema: ToolSchemas.roblox_get_luau_global,
  },

  // Open Cloud API Tools
  roblox_search_cloud_api: {
    name: 'roblox_search_cloud_api',
    description: 'Search 865 Open Cloud REST API endpoints.',
    inputSchema: ToolSchemas.roblox_search_cloud_api,
  },
  roblox_get_cloud_endpoint: {
    name: 'roblox_get_cloud_endpoint',
    description: 'Get endpoint details including authentication, parameters, and response schemas.',
    inputSchema: ToolSchemas.roblox_get_cloud_endpoint,
  },
  roblox_list_cloud_apis: {
    name: 'roblox_list_cloud_apis',
    description: 'List all Open Cloud API categories and endpoints.',
    inputSchema: ToolSchemas.roblox_list_cloud_apis,
  },

  // Luau Language Tools
  roblox_get_luau_topic: {
    name: 'roblox_get_luau_topic',
    description: 'Get Luau language documentation (type-annotations, operators, tables, etc.).',
    inputSchema: ToolSchemas.roblox_get_luau_topic,
  },
  roblox_list_luau_topics: {
    name: 'roblox_list_luau_topics',
    description: 'List all available Luau documentation topics.',
    inputSchema: ToolSchemas.roblox_list_luau_topics,
  },

  // DataType Tools
  roblox_get_datatype: {
    name: 'roblox_get_datatype',
    description: 'Get datatype documentation (Vector3, CFrame, Color3, UDim2, TweenInfo, etc.).',
    inputSchema: ToolSchemas.roblox_get_datatype,
  },
  roblox_list_datatypes: {
    name: 'roblox_list_datatypes',
    description: 'List all 44 available Roblox datatypes.',
    inputSchema: ToolSchemas.roblox_list_datatypes,
  },

  // Library Tools
  roblox_get_library: {
    name: 'roblox_get_library',
    description: 'Get Luau library documentation (math, string, table, task, coroutine, etc.).',
    inputSchema: ToolSchemas.roblox_get_library,
  },
  roblox_get_library_function: {
    name: 'roblox_get_library_function',
    description: 'Get specific library function details (math.clamp, string.split, table.find, etc.).',
    inputSchema: ToolSchemas.roblox_get_library_function,
  },
  roblox_list_libraries: {
    name: 'roblox_list_libraries',
    description: 'List all 11 Luau standard libraries.',
    inputSchema: ToolSchemas.roblox_list_libraries,
  },
};

/**
 * Registry class for all Roblox documentation tools
 */
export class DocsToolRegistry {
  private tools: Map<string, DocsToolProxy>;

  constructor(bridge: PythonBridge) {
    this.tools = new Map();
    for (const [key, definition] of Object.entries(ToolDefinitions)) {
      this.tools.set(key, new DocsToolProxy(bridge, definition));
    }
  }

  getTool(name: string): DocsToolProxy | undefined {
    return this.tools.get(name);
  }

  getAllTools(): DocsToolProxy[] {
    return Array.from(this.tools.values());
  }

  getSchemas(): Tool[] {
    return this.getAllTools().map((tool) => tool.getSchema()) as Tool[];
  }

  getToolNames(): string[] {
    return Object.keys(ToolDefinitions);
  }
}

/**
 * Individual tool proxy for mcp-roblox-docs
 */
export class DocsToolProxy extends ToolBase {
  private bridge: PythonBridge;

  constructor(bridge: PythonBridge, definition: { name: string; description: string; inputSchema: Tool['inputSchema'] }) {
    super(definition);
    this.bridge = bridge;
  }

  async execute(args: unknown): Promise<unknown> {
    if (!this.bridge.isRunning()) {
      throw new Error(`Documentation bridge not running. Cannot execute tool: ${this.getName()}`);
    }

    try {
      const normalizedArgs = this.normalizeArgs(args as Record<string, any>);
      const response = await this.bridge.callTool(this.getName(), normalizedArgs);

      // Transform the MCP response content to the expected format
      if (response?.content) {
        return response;
      }

      // If the response is just text, wrap it in content format
      return {
        content: [
          {
            type: 'text',
            text: typeof response === 'string' ? response : JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Documentation tool ${this.getName()} failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Map unified server argument names to the Python docs server argument names.
   * This keeps backward compatibility with existing camelCase tool schemas.
   */
  private normalizeArgs(args: Record<string, any>): Record<string, any> {
    const rawArgs = args || {};
    const normalized = { ...rawArgs };
    const toolName = this.getName();

    const aliasMap: Record<string, Record<string, string>> = {
      roblox_get_class: { className: 'class_name' },
      roblox_get_member: { className: 'class_name', memberName: 'member_name' },
      roblox_get_enum: { enumName: 'enum_name' },
      roblox_check_deprecated: { apiName: 'name' },
      roblox_get_inheritance: { className: 'class_name' },
      roblox_get_fflag: { fflagName: 'flag_name' },
      roblox_get_luau_global: { globalName: 'name' },
      roblox_get_cloud_endpoint: { endpointPath: 'operation_id' },
      roblox_get_datatype: { datatypeName: 'name' },
      roblox_get_library: { libraryName: 'name' },
      roblox_get_library_function: { libraryName: 'library', functionName: 'function' },
    };

    const aliases = aliasMap[toolName];
    if (!aliases) {
      return normalized;
    }

    for (const [sourceKey, targetKey] of Object.entries(aliases)) {
      if (normalized[sourceKey] !== undefined && normalized[targetKey] === undefined) {
        normalized[targetKey] = normalized[sourceKey];
      }
    }

    return normalized;
  }
}

// Export tool definitions and schemas for type checking
export type RobloxDocsToolName = keyof typeof ToolDefinitions;
export type RobloxDocsToolSchema = typeof ToolSchemas;
export { ToolSchemas, ToolDefinitions };
