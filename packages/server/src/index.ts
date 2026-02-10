#!/usr/bin/env node

/**
 * Roblox Unified MCP Server
 *
 * Main entry point for the unified Roblox MCP server.
 * Provides Model Context Protocol tools for interacting with Roblox Studio.
 *
 * Usage:
 *   roblox-mcp
 *
 * Or add to your MCP configuration:
 *   "roblox": {
 *     "command": "roblox-mcp"
 *   }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createHttpServer } from './http-server.js';
import { StudioTools } from '@roblox-mcp/tools-studio';
import { HTTPBridge } from '@roblox-mcp/studio-bridge';
import { StudioClient } from '@roblox-mcp/studio-bridge';
import {
  PythonBridge,
  DocsToolRegistry,
  DocsToolProxy,
} from '@roblox-mcp/tools-docs';
import { createRobloxpromptRegistry, PromptMessage } from '@roblox-mcp/prompts';
import { createRobloxResourceRegistry } from '@roblox-mcp/resources';

class RobloxMCPServer {
  private server: Server;
  private tools: StudioTools;
  private bridge: HTTPBridge;
  private client: StudioClient;
  private docsBridge: PythonBridge;
  private docsRegistry: DocsToolRegistry;
  private promptRegistry: ReturnType<typeof createRobloxpromptRegistry>;
  private resourceRegistry: ReturnType<typeof createRobloxResourceRegistry>;

  constructor() {
    this.server = new Server(
      {
        name: 'roblox-unified-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
          resources: {},
        },
      }
    );

    this.bridge = new HTTPBridge();
    this.client = new StudioClient(this.bridge);
    this.tools = new StudioTools(this.client);

    // Initialize documentation tools
    this.docsBridge = new PythonBridge();
    this.docsRegistry = new DocsToolRegistry(this.docsBridge);

    // Initialize prompts and resources
    this.promptRegistry = createRobloxpromptRegistry();
    this.resourceRegistry = createRobloxResourceRegistry();

    this.setupToolHandlers();
    this.setupPromptHandlers();
    this.setupResourceHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          ...this.tools.getSchemas(),
          ...this.docsRegistry.getSchemas(),
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Instance Hierarchy Tools
          case 'get_file_tree':
            return await this.tools.getFileTree((args as any)?.path || '');
          case 'search_files':
            return await this.tools.searchFiles((args as any)?.query as string, (args as any)?.searchType || 'name');

          // Studio Context Tools
          case 'get_place_info':
            return await this.tools.getPlaceInfo();
          case 'get_services':
            return await this.tools.getServices((args as any)?.serviceName);
          case 'search_objects':
            return await this.tools.searchObjects((args as any)?.query as string, (args as any)?.searchType || 'name', (args as any)?.propertyName);

          // Property & Instance Tools
          case 'get_instance_properties':
            return await this.tools.getInstanceProperties((args as any)?.instancePath as string);
          case 'get_instance_children':
            return await this.tools.getInstanceChildren((args as any)?.instancePath as string);
          case 'search_by_property':
            return await this.tools.searchByProperty((args as any)?.propertyName as string, (args as any)?.propertyValue as string);
          case 'get_class_info':
            return await this.tools.getClassInfo((args as any)?.className as string);

          // Project Tools
          case 'get_project_structure':
            return await this.tools.getProjectStructure((args as any)?.path, (args as any)?.maxDepth, (args as any)?.scriptsOnly);

          // Property Modification Tools
          case 'set_property':
            return await this.tools.setProperty((args as any)?.instancePath as string, (args as any)?.propertyName as string, (args as any)?.propertyValue);

          // Mass Property Tools
          case 'mass_set_property':
            return await this.tools.massSetProperty((args as any)?.paths as string[], (args as any)?.propertyName as string, (args as any)?.propertyValue);
          case 'mass_get_property':
            return await this.tools.massGetProperty((args as any)?.paths as string[], (args as any)?.propertyName as string);

          // Object Creation/Deletion Tools
          case 'create_object':
            return await this.tools.createObject((args as any)?.className as string, (args as any)?.parent as string, (args as any)?.name);
          case 'create_object_with_properties':
            return await this.tools.createObjectWithProperties((args as any)?.className as string, (args as any)?.parent as string, (args as any)?.name, (args as any)?.properties);
          case 'mass_create_objects':
            return await this.tools.massCreateObjects((args as any)?.objects);
          case 'mass_create_objects_with_properties':
            return await this.tools.massCreateObjectsWithProperties((args as any)?.objects);
          case 'delete_object':
            return await this.tools.deleteObject((args as any)?.instancePath as string);

          // Smart Duplication Tools
          case 'smart_duplicate':
            return await this.tools.smartDuplicate((args as any)?.instancePath as string, (args as any)?.count as number, (args as any)?.options);
          case 'mass_duplicate':
            return await this.tools.massDuplicate((args as any)?.duplications);

          // Calculated Property Tools
          case 'set_calculated_property':
            return await this.tools.setCalculatedProperty((args as any)?.paths as string[], (args as any)?.propertyName as string, (args as any)?.formula as string, (args as any)?.variables);

          // Relative Property Tools
          case 'set_relative_property':
            return await this.tools.setRelativeProperty((args as any)?.paths as string[], (args as any)?.propertyName as string, (args as any)?.operation, (args as any)?.value, (args as any)?.component);

          // Script Management Tools
          case 'get_script_source':
            return await this.tools.getScriptSource((args as any)?.instancePath as string, (args as any)?.startLine, (args as any)?.endLine);
          case 'set_script_source':
            return await this.tools.setScriptSource((args as any)?.instancePath as string, (args as any)?.source as string);

          // Partial Script Editing Tools
          case 'edit_script_lines':
            return await this.tools.editScriptLines((args as any)?.instancePath as string, (args as any)?.startLine as number, (args as any)?.endLine as number, (args as any)?.newContent as string);
          case 'insert_script_lines':
            return await this.tools.insertScriptLines((args as any)?.instancePath as string, (args as any)?.afterLine as number, (args as any)?.newContent as string);
          case 'delete_script_lines':
            return await this.tools.deleteScriptLines((args as any)?.instancePath as string, (args as any)?.startLine as number, (args as any)?.endLine as number);

          // Attribute Tools
          case 'get_attribute':
            return await this.tools.getAttribute((args as any)?.instancePath as string, (args as any)?.attributeName as string);
          case 'set_attribute':
            return await this.tools.setAttribute((args as any)?.instancePath as string, (args as any)?.attributeName as string, (args as any)?.attributeValue, (args as any)?.valueType);
          case 'get_attributes':
            return await this.tools.getAttributes((args as any)?.instancePath as string);
          case 'delete_attribute':
            return await this.tools.deleteAttribute((args as any)?.instancePath as string, (args as any)?.attributeName as string);

          // Tag Tools (CollectionService)
          case 'get_tags':
            return await this.tools.getTags((args as any)?.instancePath as string);
          case 'add_tag':
            return await this.tools.addTag((args as any)?.instancePath as string, (args as any)?.tagName as string);
          case 'remove_tag':
            return await this.tools.removeTag((args as any)?.instancePath as string, (args as any)?.tagName as string);
          case 'get_tagged':
            return await this.tools.getTagged((args as any)?.tagName as string);

          // Selection Tools
          case 'get_selection':
            return await this.tools.getSelection();

          // Documentation Tools (delegated to docs registry)
          default: {
            // Check if this is a documentation tool
            const docsTool = this.docsRegistry.getTool(name);
            if (docsTool) {
              return await docsTool.execute(args) as any;
            }

            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
          }
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private setupPromptHandlers() {
    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: this.promptRegistry.getSchemas(),
      };
    });

    // Get prompt content
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const prompt = this.promptRegistry.get(name);

      if (!prompt) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Prompt not found: ${name}`
        );
      }

      // Build messages based on prompt arguments
      const messages: PromptMessage[] = [
        {
          role: 'user',
          content: {
            type: 'text',
            text: this.buildPromptText(prompt, args || {}),
          },
        },
      ];

      return {
        messages,
      };
    });
  }

  private buildPromptText(prompt: { name: string; description?: string }, args: Record<string, string>): string {
    // Build a helpful prompt based on the prompt name and arguments
    const promptGuides: Record<string, (args: Record<string, string>) => string> = {
      roblox_quickstart: (a) => `# Getting Started with Roblox Development

You want to: ${a.goal}

${a.experience ? `Experience Level: ${a.experience}` : ''}

## Recommended Approach

1. **Start by understanding the project structure**
   - Use the 'roblox_analyze_project_structure' prompt to get an overview

2. **Use the available tools:**
   - Studio tools for creating and modifying instances
   - Documentation tools for API reference
   - Search tools for finding specific objects

3. **Common workflows:**
   - Use 'roblox_understand_project' to analyze existing code
   - Use 'roblox_create_model_structure' for new objects
   - Use 'roblox_edit_script_function' to modify scripts

What would you like to do first?`,

      roblox_understand_project: (a) => `# Understanding Your Roblox Project

${a.focus ? `Focus: ${a.focus}` : 'Focus: General overview'}

## Steps to Analyze the Project

1. Get the project structure:
   - Use tool: 'get_project_structure' to see the hierarchy

2. Identify key scripts:
   - Use tool: 'search_files' with searchType 'script' to find scripts

3. Check for important services:
   - Use tool: 'get_services' to see what services are available

4. Look for patterns:
   - Check for CollectionService tags
   - Look for RemoteEvents/RemoteFunctions

Would you like me to start the analysis?`,

      roblox_create_model_structure: (a) => `# Creating Model Structure

**Model Name:** ${a.model_name}
**Structure:** ${a.structure}
**Parent:** ${a.parent || 'Workspace'}

## Implementation Steps

1. Create the main model using 'create_object'
2. Add child instances based on structure description
3. Set appropriate properties for each instance

## Suggested Properties
Based on the structure "${a.structure}", I recommend:
- Set Model.PrimaryPart if it contains parts
- Use 'mass_create_objects_with_properties' for efficiency

Shall I proceed with creating this structure?`,

      roblox_edit_script_function: (a) => `# Editing Script Function

**Script:** ${a.script_path}
**Function:** ${a.function_name}
**Purpose:** ${a.function_purpose}

${a.preserve_existing !== 'false' ? 'Will preserve existing code where possible.' : 'Will replace the function entirely.'}

## Steps
1. Get current script source using 'get_script_source'
2. Locate or create the function
3. Modify with the new logic

Ready to proceed?`,

      roblox_mass_create_grid: (a) => `# Creating Object Grid

**Object Type:** ${a.object_type}
**Grid Size:** ${a.grid_size}
**Spacing:** ${a.spacing}
**Parent:** ${a.parent}

## Plan
I will create a ${a.grid_size} grid with ${a.spacing} spacing between objects.
Total objects: [calculated based on grid size]

${a.properties ? `Properties to apply: ${a.properties}` : ''}

Shall I create the grid using 'mass_create_objects'?`,

      roblox_debug_script_not_running: (a) => `# Debugging Script Not Running

**Script:** ${a.script_path}
**Expected Behavior:** ${a.expected_behavior}

## Diagnostic Steps

1. **Check script exists and is enabled**
   - Verify instance path is correct
   - Check script.Disabled property

2. **Check script parent**
   - Scripts in Workspace won't run (use ServerScriptService)
   - LocalScripts need proper parent (StarterPlayer, player character, etc.)

3. **Check for errors**
   - Look for output errors in Studio
   - Verify syntax is correct

4. **Common issues:**
   - Script in wrong container (needs replication)
   - WaitForChild timing out
   - Service not found

Let me start by checking the script properties and location.`,

      roblox_explain_class: (a) => `# Roblox Class: ${a.class_name}

${a.include_examples !== 'false' ? 'Will include code examples.' : 'Reference only.'}

## What I'll Look Up
Using documentation tools to find:
- Class description and purpose
- Common properties
- Important methods
- Key events
- Usage examples

Let me retrieve this information for you.`,

      roblox_find_best_practice: (a) => `# Best Practices for: ${a.task}

${a.search_devforum !== 'false' ? 'Will search DevForum for community solutions.' : 'Documentation only.'}

## Research Plan
1. Check internal best practices reference
2. Look up relevant API documentation
3. Find code examples if available

Starting search...`,

      roblox_solve_error: (a) => `# Solving Roblox Error

**Error:** ${a.error_message}
${a.context ? `Context: ${a.context}` : ''}

## Troubleshooting Steps

1. **Parse the error message** - identify error type
2. **Check common causes** for this error
3. **Look at documentation** for the affected API
4. **Search DevForum** for similar issues

Let me start by analyzing the error message.`,
    };

    const guide = promptGuides[prompt.name as keyof typeof promptGuides];
    if (guide) {
      return guide(args);
    }

    // Default prompt text
    return `# Prompt: ${prompt.description || 'No description'}

## Arguments Provided
${Object.entries(args).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Next Steps
This prompt will guide you through a workflow using the available Roblox MCP tools.
The tools can help you interact with Roblox Studio and access documentation.`;
  }

  private setupResourceHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: this.resourceRegistry.getSchemas(),
      };
    });

    // Read resource content
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      const content = this.resourceRegistry.getContent(uri);

      if (!content) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Resource not found: ${uri}`
        );
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: content,
          },
        ],
      };
    });
  }

  async run() {
    // Start the documentation bridge (skip if SKIP_DOCS is set)
    if (!process.env.SKIP_DOCS) {
      try {
        console.error('Starting documentation bridge (mcp-roblox-docs)...');
        await this.docsBridge.start();
        console.error('Documentation bridge started successfully');
      } catch (error) {
        console.error('Failed to start documentation bridge:', error);
        console.error('Documentation tools will not be available');
        // Continue without docs tools
      }
    } else {
      console.error('Skipping documentation bridge (SKIP_DOCS=1)');
    }

    const port = process.env.ROBLOX_STUDIO_PORT ? parseInt(process.env.ROBLOX_STUDIO_PORT) : 3002;
    const host = process.env.ROBLOX_STUDIO_HOST || '0.0.0.0';
    const httpServer = createHttpServer(this.tools, this.bridge);

    await new Promise<void>((resolve) => {
      httpServer.listen(port, host, () => {
        console.error(`HTTP server listening on ${host}:${port} for Studio plugin`);
        resolve();
      });
    });

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Roblox Unified MCP server running on stdio');

    (httpServer as any).setMCPServerActive(true);
    console.error('MCP server marked as active');

    console.error('Waiting for Studio plugin to connect...');

    setInterval(() => {
      const pluginConnected = (httpServer as any).isPluginConnected();
      const mcpActive = (httpServer as any).isMCPServerActive();

      if (pluginConnected && mcpActive) {
        // All good
      } else if (pluginConnected && !mcpActive) {
        console.error('Studio plugin connected, but MCP server inactive');
      } else if (!pluginConnected && mcpActive) {
        console.error('MCP server active, waiting for Studio plugin...');
      } else {
        console.error('Waiting for connections...');
      }
    }, 5000);

    setInterval(() => {
      (this.bridge as any).cleanupOldRequests();
    }, 5000);

    // Handle shutdown
    process.on('SIGINT', async () => {
      console.error('Shutting down...');
      await this.docsBridge.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.error('Shutting down...');
      await this.docsBridge.stop();
      process.exit(0);
    });
  }
}

const server = new RobloxMCPServer();

export async function startServer() {
  await server.run();
}

// Start the server if this is the main module
// Normalize paths for Windows compatibility
const normalizedArgv1 = process.argv[1]?.replace(/\\/g, '/');
const normalizedImportUrl = import.meta.url.replace(/\\/g, '/');
if (normalizedImportUrl === `file://${normalizedArgv1}` ||
    import.meta.url.endsWith('/src/index.ts') ||
    import.meta.url.endsWith('/dist/index.js')) {
  server.run().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
  });
}
