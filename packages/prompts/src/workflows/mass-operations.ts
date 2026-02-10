/**
 * Mass operations workflow prompts
 *
 * Prompts for batch operations on multiple Roblox instances.
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const massOperationsPrompts: Prompt[] = [
  {
    name: 'roblox_mass_create_grid',
    description: 'Create a grid of objects with calculated positions',
    arguments: [
      {
        name: 'object_type',
        description: 'Type of object to create (e.g., "Part", "Frame")',
        required: true,
      },
      {
        name: 'grid_size',
        description: 'Grid dimensions (e.g., "5x5x3", "10x10")',
        required: true,
      },
      {
        name: 'spacing',
        description: 'Spacing between objects (e.g., "5 studs")',
        required: true,
      },
      {
        name: 'parent',
        description: 'Parent path where objects should be created',
        required: true,
      },
      {
        name: 'properties',
        description: 'Common properties to apply to all objects',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_mass_duplicate_with_variation',
    description: 'Duplicate objects with calculated variations in properties',
    arguments: [
      {
        name: 'source_path',
        description: 'Path to the object to duplicate',
        required: true,
      },
      {
        name: 'count',
        description: 'Number of duplicates to create',
        required: true,
      },
      {
        name: 'variations',
        description: 'Property variations to apply (e.g., "position offset by 5", "color gradient")',
        required: true,
      },
      {
        name: 'parent',
        description: 'Parent path for duplicates',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_mass_rename',
    description: 'Rename multiple objects following a pattern',
    arguments: [
      {
        name: 'target_paths',
        description: 'Paths to objects to rename',
        required: true,
      },
      {
        name: 'pattern',
        description: 'Naming pattern (e.g., "Wall_{index}", "Enemy_{index}")',
        required: true,
      },
      {
        name: 'start_index',
        description: 'Starting index for pattern',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_mass_apply_attributes',
    description: 'Apply attributes to multiple objects for game logic',
    arguments: [
      {
        name: 'target_paths',
        description: 'Paths to objects to modify',
        required: true,
      },
      {
        name: 'attributes',
        description: 'Attributes to apply (format: "name:value,type")',
        required: true,
      },
    ],
  },
  {
    name: 'roblox_mass_setup_collisions',
    description: 'Configure collision groups for multiple parts',
    arguments: [
      {
        name: 'target_paths',
        description: 'Paths to parts to configure',
        required: true,
      },
      {
        name: 'collision_group',
        description: 'Collision group to assign',
        required: true,
      },
      {
        name: 'can_collide',
        description: 'Whether parts should collide with each other',
        required: false,
      },
    ],
  },
];
