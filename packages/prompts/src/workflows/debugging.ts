/**
 * Debugging workflow prompts
 *
 * Prompts for debugging and troubleshooting Roblox projects.
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const debuggingPrompts: Prompt[] = [
  {
    name: 'roblox_debug_script_not_running',
    description: 'Debug why a script is not executing',
    arguments: [
      {
        name: 'script_path',
        description: 'Path to the script that\'s not working',
        required: true,
      },
      {
        name: 'expected_behavior',
        description: 'What the script should do',
        required: true,
      },
    ],
  },
  {
    name: 'roblox_debug_performance',
    description: 'Identify and fix performance issues',
    arguments: [
      {
        name: 'symptoms',
        description: 'Performance symptoms (lag, low FPS, memory issues)',
        required: true,
      },
      {
        name: 'scope',
        description: 'Area of the game to investigate (optional)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_debug_event_not_firing',
    description: 'Debug why an event is not firing or not being handled',
    arguments: [
      {
        name: 'event_description',
        description: 'The event that\'s not working (e.g., "Touched event on Part")',
        required: true,
      },
      {
        name: 'handler_location',
        description: 'Location of the event handler script (if known)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_debug_instance_reference',
    description: 'Debug issues with instance references and paths',
    arguments: [
      {
        name: 'problem_path',
        description: 'The path that\'s causing issues',
        required: true,
      },
      {
        name: 'error_message',
        description: 'Any error message received',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_debug_attribute_issue',
    description: 'Debug issues with attributes not persisting or being read',
    arguments: [
      {
        name: 'instance_path',
        description: 'Path to the instance with attribute issues',
        required: true,
      },
      {
        name: 'attribute_name',
        description: 'Name of the problematic attribute',
        required: true,
      },
    ],
  },
];
