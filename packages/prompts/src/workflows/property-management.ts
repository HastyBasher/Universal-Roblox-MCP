/**
 * Property management workflow prompts
 *
 * Prompts for managing properties on Roblox instances.
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const propertyManagementPrompts: Prompt[] = [
  {
    name: 'roblox_apply_theme',
    description: 'Apply a visual theme to multiple GUI elements or parts',
    arguments: [
      {
        name: 'target_objects',
        description: 'Which objects to style (description or paths)',
        required: true,
      },
      {
        name: 'theme',
        description: 'Theme description (e.g., "dark mode with neon accents", "medieval fantasy")',
        required: true,
      },
      {
        name: 'properties',
        description: 'Specific properties to modify (optional)',
        required: false,
      },
    ],
  },
  {
    name: 'roblos_setup_physics',
    description: 'Configure physics properties for parts or models',
    arguments: [
      {
        name: 'target_objects',
        description: 'Which objects to configure',
        required: true,
      },
      {
        name: 'physics_type',
        description: 'Physics behavior (anchored, unanchored, kinematic, etc.)',
        required: true,
      },
      {
        name: 'material',
        description: 'Material to apply (optional)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_configure_constraints',
    description: 'Set up constraints between parts',
    arguments: [
      {
        name: 'constraint_type',
        description: 'Type of constraint (Weld, Motor6D, AlignPosition, etc.)',
        required: true,
      },
      {
        name: 'parts',
        description: 'Parts to connect (description or paths)',
        required: true,
      },
      {
        name: 'properties',
        description: 'Constraint properties to configure',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_calculated_properties',
    description: 'Apply calculated values to properties across multiple instances',
    arguments: [
      {
        name: 'target_paths',
        description: 'Array of instance paths to modify',
        required: true,
      },
      {
        name: 'property',
        description: 'Property to modify',
        required: true,
      },
      {
        name: 'formula',
        description: 'Formula to calculate values (e.g., "index * 2", "position + offset")',
        required: true,
      },
    ],
  },
];
