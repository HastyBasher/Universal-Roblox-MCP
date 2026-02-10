/**
 * Object creation workflow prompts
 *
 * Prompts for creating and managing Roblox instances.
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const objectCreationPrompts: Prompt[] = [
  {
    name: 'roblox_create_model_structure',
    description: 'Create a complete model structure with proper hierarchy and properties',
    arguments: [
      {
        name: 'model_name',
        description: 'Name of the model to create',
        required: true,
      },
      {
        name: 'structure',
        description: 'Description of the desired internal structure (e.g., "a house with rooms and furniture")',
        required: true,
      },
      {
        name: 'parent',
        description: 'Parent path where the model should be created (optional, defaults to Workspace)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_create_gui',
    description: 'Create a GUI with proper hierarchy and properties',
    arguments: [
      {
        name: 'gui_type',
        description: 'Type of GUI (ScreenGui, BillboardGui, SurfaceGui, etc.)',
        required: true,
      },
      {
        name: 'elements',
        description: 'Description of UI elements needed (buttons, labels, frames, etc.)',
        required: true,
      },
      {
        name: 'styling',
        description: 'Styling preferences (colors, sizes, fonts)',
        required: false,
      },
    ],
  },
  {
    name: 'roblox_create_script_template',
    description: 'Create a script with proper template and structure',
    arguments: [
      {
        name: 'script_type',
        description: 'Type of script (Script, LocalScript, ModuleScript)',
        required: true,
      },
      {
        name: 'purpose',
        description: 'What the script should do',
        required: true,
      },
      {
        name: 'parent',
        description: 'Where the script should be placed',
        required: true,
      },
    ],
  },
  {
    name: 'roblos_setup_collectionservice_tags',
    description: 'Set up CollectionService tags for organized object management',
    arguments: [
      {
        name: 'tag_name',
        description: 'The tag name to use',
        required: true,
      },
      {
        name: 'target_objects',
        description: 'Description of which objects should receive this tag',
        required: true,
      },
      {
        name: 'create_handler',
        description: 'Whether to create a script that handles tagged objects',
        required: false,
      },
    ],
  },
];
