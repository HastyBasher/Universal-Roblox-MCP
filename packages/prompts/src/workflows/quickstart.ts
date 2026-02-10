/**
 * Quickstart workflow prompts
 *
 * Prompts to help users get started with common Roblox development tasks.
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const quickstartPrompts: Prompt[] = [
  {
    name: 'roblox_quickstart',
    description: 'Get started with Roblox development using MCP tools',
    arguments: [
      {
        name: 'goal',
        description: 'What you want to accomplish (e.g., "create a basic obstacle course", "make a leaderboard system")',
        required: true,
      },
      {
        name: 'experience',
        description: 'Your experience level (beginner, intermediate, advanced)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_understand_project',
    description: 'Understand and analyze an existing Roblox project structure',
    arguments: [
      {
        name: 'focus',
        description: 'What to focus on (e.g., "scripts", "instances", "organization")',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_find_and_fix',
    description: 'Find and fix issues in a Roblox project',
    arguments: [
      {
        name: 'issue',
        description: 'Description of the problem (e.g., "script not working", "performance issues")',
        required: true,
      },
      {
        name: 'context',
        description: 'Any relevant context about when the issue occurs',
        required: false,
      },
    ],
  },
];
