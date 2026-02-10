# Community Plugin

A TypeScript plugin system for extending Roblox MCP with community tools.

## Usage

```typescript
import { CommunityPlugin } from '@roblox-mcp/community-plugin';
import { ExampleCommunityTool } from '@roblox-mcp/community-plugin/tools';

const plugin = new CommunityPlugin();
plugin.register(new ExampleCommunityTool());
```

## Creating Custom Tools

Extend the `ToolBase` class:

```typescript
import { ToolBase } from '@roblox-mcp/core';

export class MyCustomTool extends ToolBase {
  constructor() {
    super({
      name: 'my_custom_tool',
      description: 'My custom tool description',
      inputSchema: {
        type: 'object',
        properties: {
          // Define your input schema
        },
      },
    });
  }

  async execute(args: unknown): Promise<unknown> {
    // Implement your tool logic
    return {
      content: [
        {
          type: 'text',
          text: 'Result',
        },
      ],
    };
  }
}
```
