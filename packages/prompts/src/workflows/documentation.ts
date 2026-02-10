/**
 * Documentation workflow prompts
 *
 * Prompts for accessing and using Roblox API documentation.
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const documentationPrompts: Prompt[] = [
  {
    name: 'roblox_explain_class',
    description: 'Get detailed explanation of a Roblox class and its usage',
    arguments: [
      {
        name: 'class_name',
        description: 'Name of the Roblox class (e.g., "Part", "Humanoid", "TweenService")',
        required: true,
      },
      {
        name: 'include_examples',
        description: 'Whether to include code examples',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_explain_datatype',
    description: 'Get detailed explanation of a Roblox datatype (Vector3, CFrame, etc.)',
    arguments: [
      {
        name: 'datatype_name',
        description: 'Name of the datatype (e.g., "Vector3", "CFrame", "UDim2")',
        required: true,
      },
      {
        name: 'focus',
        description: 'What to focus on (constructors, methods, operations, all)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_find_best_practice',
    description: 'Find best practices for a specific Roblox development task',
    arguments: [
      {
        name: 'task',
        description: 'The task or feature you\'re implementing',
        required: true,
      },
      {
        name: 'search_devforum',
        description: 'Whether to search DevForum for community solutions',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_check_deprecation',
    description: 'Check if an API is deprecated and find alternatives',
    arguments: [
      {
        name: 'api_name',
        description: 'Name of the class, member, or API to check',
        required: true,
      },
      {
        name: 'class_context',
        description: 'Class name if checking a member',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_learn_pattern',
    description: 'Learn common Roblox development patterns',
    arguments: [
      {
        name: 'pattern_type',
        description: 'Type of pattern (client-server, data_store, OOP, state_machine)',
        required: true,
      },
      {
        name: 'experience_level',
        description: 'Your experience level for appropriate explanation depth',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_solve_error',
    description: 'Find solutions for specific Roblox errors',
    arguments: [
      {
        name: 'error_message',
        description: 'The error message or error code',
        required: true,
      },
      {
        name: 'context',
        description: 'What code was running when the error occurred',
        required: false,
      },
    ],
  },
];
