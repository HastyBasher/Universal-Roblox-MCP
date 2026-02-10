/**
 * Project structure workflow prompts
 *
 * Prompts for analyzing and managing project structure.
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const projectStructurePrompts: Prompt[] = [
  {
    name: 'roblox_analyze_structure',
    description: 'Analyze the entire project structure and identify patterns',
    arguments: [
      {
        name: 'depth',
        description: 'How deep to analyze (1-10, default: 5)',
        required: false,
      },
      {
        name: 'focus',
        description: 'Focus area (scripts, instances, organization, all)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_find_similar_objects',
    description: 'Find objects with similar properties or naming patterns',
    arguments: [
      {
        name: 'reference_path',
        description: 'Path to the reference object',
        required: true,
      },
      {
        name: 'criteria',
        description: 'Similarity criteria (class, properties, tags, name pattern)',
        required: true,
      },
      {
        name: 'search_scope',
        description: 'Where to search (path or "game" for entire place)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_cleanup_organization',
    description: 'Reorganize a messy project structure',
    arguments: [
      {
        name: 'strategy',
        description: 'Organization strategy (by_type, by_function, flat)',
        required: true,
      },
      {
        name: 'scope',
        description: 'Path to reorganize (defaults to entire Workspace)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_document_structure',
    description: 'Generate documentation for the project structure',
    arguments: [
      {
        name: 'format',
        description: 'Output format (markdown, json, tree)',
        required: false,
      },
      {
        name: 'include_scripts',
        description: 'Whether to include script content in documentation',
        required: false,
      },
    ],
  },
];
