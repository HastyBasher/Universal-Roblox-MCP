/**
 * Script editing workflow prompts
 *
 * Prompts for editing and managing Roblox scripts.
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const scriptEditingPrompts: Prompt[] = [
  {
    name: 'roblox_edit_script_function',
    description: 'Edit or add a specific function in a script',
    arguments: [
      {
        name: 'script_path',
        description: 'Path to the script to edit',
        required: true,
      },
      {
        name: 'function_name',
        description: 'Name of the function to edit or create',
        required: true,
      },
      {
        name: 'function_purpose',
        description: 'What the function should do',
        required: true,
      },
      {
        name: 'preserve_existing',
        description: 'Whether to preserve existing code in the function',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_refactor_script',
    description: 'Refactor a script to improve code quality and maintainability',
    arguments: [
      {
        name: 'script_path',
        description: 'Path to the script to refactor',
        required: true,
      },
      {
        name: 'focus',
        description: 'What to focus on (performance, readability, modularity, all)',
        required: true,
      },
    ],
  },
  {
    name: 'roblox_add_event_handler',
    description: 'Add an event handler to a script',
    arguments: [
      {
        name: 'script_path',
        description: 'Path to the script',
        required: true,
      },
      {
        name: 'event',
        description: 'The event to handle (e.g., "Touched", "PlayerAdded")',
        required: true,
      },
      {
        name: 'handler_logic',
        description: 'What the event handler should do',
        required: true,
      },
    ],
  },
  {
    name: 'roblox_convert_to_modulescript',
    description: 'Convert a regular script to a ModuleScript with proper exports',
    arguments: [
      {
        name: 'script_path',
        description: 'Path to the script to convert',
        required: true,
      },
      {
        name: 'export_functions',
        description: 'Which functions to export (comma-separated names or "all")',
        required: true,
      },
    ],
  },
  {
    name: 'roblox_add_debugging',
    description: 'Add debugging/output statements to a script',
    arguments: [
      {
        name: 'script_path',
        description: 'Path to the script',
        required: true,
      },
      {
        name: 'debug_points',
        description: 'Where to add debugging (function names, line numbers, or "all")',
        required: true,
      },
    ],
  },
];
