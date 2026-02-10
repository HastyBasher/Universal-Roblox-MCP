/**
 * Roblox MCP Prompts
 *
 * Workflow prompt templates for common Roblox development tasks.
 */

import { Prompt, PromptMessage } from '@modelcontextprotocol/sdk/types.js';
import { quickstartPrompts } from './workflows/quickstart.js';
import { objectCreationPrompts } from './workflows/object-creation.js';
import { scriptEditingPrompts } from './workflows/script-editing.js';
import { propertyManagementPrompts } from './workflows/property-management.js';
import { massOperationsPrompts } from './workflows/mass-operations.js';
import { projectStructurePrompts } from './workflows/project-structure.js';
import { debuggingPrompts } from './workflows/debugging.js';
import { documentationPrompts } from './workflows/documentation.js';

export interface PromptConfig {
  name: string;
  description: string;
  arguments?: Prompt['arguments'];
}

// Re-export PromptMessage for use in server
export type { PromptMessage };

export class PromptRegistry {
  private prompts: Map<string, Prompt> = new Map();

  register(prompt: Prompt): void {
    this.prompts.set(prompt.name, prompt);
  }

  unregister(name: string): void {
    this.prompts.delete(name);
  }

  get(name: string): Prompt | undefined {
    return this.prompts.get(name);
  }

  has(name: string): boolean {
    return this.prompts.has(name);
  }

  getAll(): Prompt[] {
    return Array.from(this.prompts.values());
  }

  getSchemas(): Prompt[] {
    return this.getAll();
  }
}

export function createRobloxpromptRegistry(): PromptRegistry {
  const registry = new PromptRegistry();

  // Register all workflow prompts
  quickstartPrompts.forEach(p => registry.register(p));
  objectCreationPrompts.forEach(p => registry.register(p));
  scriptEditingPrompts.forEach(p => registry.register(p));
  propertyManagementPrompts.forEach(p => registry.register(p));
  massOperationsPrompts.forEach(p => registry.register(p));
  projectStructurePrompts.forEach(p => registry.register(p));
  debuggingPrompts.forEach(p => registry.register(p));
  documentationPrompts.forEach(p => registry.register(p));

  return registry;
}

export { createRobloxpromptRegistry as default };
