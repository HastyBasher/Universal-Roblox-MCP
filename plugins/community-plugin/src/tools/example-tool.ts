/**
 * Example community tool
 */

import { ToolBase } from '@roblox-mcp/core';

export class ExampleCommunityTool extends ToolBase {
  constructor() {
    super({
      name: 'example_community_tool',
      description: 'An example community tool',
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'A message to process',
          },
        },
        required: ['message'],
      },
    });
  }

  async execute(args: unknown): Promise<unknown> {
    const { message } = args as { message: string };

    return {
      content: [
        {
          type: 'text',
          text: `Community tool received: ${message}`,
        },
      ],
    };
  }
}

export { ExampleCommunityTool };
