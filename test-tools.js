#!/usr/bin/env node

/**
 * Roblox Unified MCP Tool Tester
 *
 * Tests tools in logical order with timeouts and incremental feedback
 * Run with: node test-tools.js
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Tool test definitions grouped by category and risk level
const TOOL_TESTS = {
  // Phase 1: Documentation Tools (No Studio connection needed)
  docs: {
    name: 'Documentation Tools',
    tests: [
      { name: 'roblox_health', args: {} },
      { name: 'roblox_search', args: { query: 'Part' } },
      { name: 'roblox_list_services', args: {} },
      { name: 'roblox_get_class', args: { class_name: 'Part' } },
      { name: 'roblox_get_datatype', args: { name: 'Vector3' } },
      { name: 'roblox_get_enum', args: { enum_name: 'Material' } },
      { name: 'roblox_list_datatypes', args: {} },
      { name: 'roblox_list_enums', args: {} },
      { name: 'roblox_list_libraries', args: {} },
      { name: 'roblox_get_library', args: { name: 'math' } },
      { name: 'roblox_get_luau_globals', args: {} },
      { name: 'roblox_search_devforum', args: { query: 'performance', limit: 5 } },
    ],
  },

  // Phase 2: Read-only Studio Tools (Safe, no modification)
  readonly: {
    name: 'Read-Only Studio Tools',
    requiresStudio: true,
    tests: [
      { name: 'get_place_info', args: {} },
      { name: 'get_file_tree', args: { path: '' } },
      { name: 'get_project_structure', args: { path: 'Workspace' } },
      { name: 'get_services', args: {} },
      { name: 'search_objects', args: { query: 'Part', searchType: 'name' } },
      { name: 'get_selection', args: {} },
    ],
  },

  // Phase 3: Property Read Tools
  propertyRead: {
    name: 'Property Read Tools',
    requiresStudio: true,
    setup: async () => {
      // Create a test part first
      log('Setup: Creating test Part for property tests...');
      await callTool('create_object', {
        className: 'Part',
        parent: 'Workspace',
        name: 'TestPart'
      });
    },
    tests: [
      { name: 'get_instance_properties', args: { instancePath: 'Workspace.TestPart' } },
      { name: 'get_instance_children', args: { instancePath: 'Workspace' } },
      { name: 'get_class_info', args: { className: 'Part' } },
    ],
  },

  // Phase 4: Property Modification Tools (Reversible changes)
  propertyWrite: {
    name: 'Property Modification Tools',
    requiresStudio: true,
    tests: [
      { name: 'set_property', args: { instancePath: 'Workspace.TestPart', propertyName: 'Name', propertyValue: 'ModifiedPart' } },
      { name: 'set_property', args: { instancePath: 'Workspace.ModifiedPart', propertyName: 'Name', propertyValue: 'TestPart' } }, // Revert
      { name: 'set_property', args: { instancePath: 'Workspace.TestPart', propertyName: 'Anchored', propertyValue: true } },
      { name: 'mass_set_property', args: { paths: ['Workspace.TestPart'], propertyName: 'BrickColor', propertyValue: 'Bright red' } },
      { name: 'set_relative_property', args: { paths: ['Workspace.TestPart'], propertyName: 'Size', operation: 'add', value: '1,1,1' } },
    ],
  },

  // Phase 5: Attribute Tools
  attributes: {
    name: 'Attribute Tools',
    requiresStudio: true,
    tests: [
      { name: 'set_attribute', args: { instancePath: 'Workspace.TestPart', attributeName: 'TestAttr', attributeValue: 42 } },
      { name: 'get_attribute', args: { instancePath: 'Workspace.TestPart', attributeName: 'TestAttr' } },
      { name: 'get_attributes', args: { instancePath: 'Workspace.TestPart' } },
      { name: 'delete_attribute', args: { instancePath: 'Workspace.TestPart', attributeName: 'TestAttr' } },
    ],
  },

  // Phase 6: Tag Tools
  tags: {
    name: 'Tag Tools',
    requiresStudio: true,
    tests: [
      { name: 'add_tag', args: { instancePath: 'Workspace.TestPart', tagName: 'TestTag' } },
      { name: 'get_tags', args: { instancePath: 'Workspace.TestPart' } },
      { name: 'get_tagged', args: { tagName: 'TestTag' } },
      { name: 'remove_tag', args: { instancePath: 'Workspace.TestPart', tagName: 'TestTag' } },
    ],
  },

  // Phase 7: Script Tools (Read)
  scriptRead: {
    name: 'Script Read Tools',
    requiresStudio: true,
    setup: async () => {
      log('Setup: Creating test Script...');
      await callTool('create_object', {
        className: 'Script',
        parent: 'ServerScriptService',
        name: 'TestScript'
      });
      await callTool('set_script_source', {
        instancePath: 'ServerScriptService.TestScript',
        source: '-- Test script\nprint("Hello from MCP!")'
      });
    },
    tests: [
      { name: 'get_script_source', args: { instancePath: 'ServerScriptService.TestScript' } },
    ],
  },

  // Phase 8: Script Modification Tools
  scriptWrite: {
    name: 'Script Modification Tools',
    requiresStudio: true,
    tests: [
      { name: 'edit_script_lines', args: { instancePath: 'ServerScriptService.TestScript', startLine: 1, endLine: 1, newContent: '-- Modified test script' } },
      { name: 'insert_script_lines', args: { instancePath: 'ServerScriptService.TestScript', afterLine: 2, newContent: 'print("Inserted line")' } },
    ],
  },

  // Phase 9: Object Creation Tools
  creation: {
    name: 'Object Creation Tools',
    requiresStudio: true,
    tests: [
      { name: 'create_object', args: { className: 'Folder', parent: 'Workspace', name: 'TestFolder' } },
      { name: 'create_object_with_properties', args: { className: 'Part', parent: 'Workspace.TestFolder', name: 'NestedPart', properties: { Size: '2,2,2', Anchored: true } } },
      { name: 'mass_create_objects', args: { objects: [
        { className: 'Part', parent: 'Workspace.TestFolder', name: 'MassPart1' },
        { className: 'Part', parent: 'Workspace.TestFolder', name: 'MassPart2' },
      ]}},
    ],
  },

  // Phase 10: Duplication Tools
  duplication: {
    name: 'Duplication Tools',
    requiresStudio: true,
    tests: [
      { name: 'smart_duplicate', args: { instancePath: 'Workspace.TestPart', count: 2, options: { offset: '5,0,0' } } },
    ],
  },

  // Phase 11: Deletion Tools (Highest risk - test last)
  deletion: {
    name: 'Deletion Tools (Cleanup)',
    requiresStudio: true,
    tests: [
      { name: 'delete_object', args: { instancePath: 'Workspace.TestFolder' } }, // Deletes nested objects too
      { name: 'delete_object', args: { instancePath: 'Workspace.ModifiedPart' } }, // Clean up duplicated parts
      { name: 'delete_object', args: { instancePath: 'ServerScriptService.TestScript' } },
    ],
  },
};

// Test configuration
const CONFIG = {
  toolTimeout: 10000, // 10 seconds per tool
  serverStartTimeout: 30000, // 30 seconds to start server
  serverPath: join(__dirname, 'packages', 'server', 'dist', 'index.js'),
};

// Test state
let serverProcess = null;
let results = {
  passed: [],
  failed: [],
  skipped: [],
};

// Utility functions
function log(message, data = null) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms));
}

async function callTool(toolName, args) {
  const protocol = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args,
    },
  };

  const response = await sendToServer(protocol);
  return response.result;
}

async function sendToServer(payload) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('Server response timeout')), CONFIG.toolTimeout);

    const handler = (data) => {
      try {
        const response = JSON.parse(data.toString());
        if (response.id === payload.id) {
          clearTimeout(timeoutId);
          serverProcess.stdout.off('data', handler);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response);
          }
        }
      } catch (e) {
        // Ignore non-JSON output
      }
    };

    serverProcess.stdout.on('data', handler);
    serverProcess.stdin.write(JSON.stringify(payload) + '\n');
  });
}

async function runPhase(phaseKey, phaseData) {
  log(`\n${'='.repeat(60)}`);
  log(`PHASE: ${phaseData.name}`);
  log(`${'='.repeat(60)}`);

  if (phaseData.requiresStudio) {
    log('⚠️  This phase requires Roblox Studio to be running with the MCP plugin');
  }

  if (phaseData.setup) {
    try {
      await phaseData.setup();
    } catch (error) {
      log(`❌ Setup failed: ${error.message}`);
      log(`⏭️  Skipping phase ${phaseKey}`);
      results.skipped.push({ phase: phaseKey, reason: 'Setup failed', error: error.message });
      return;
    }
  }

  for (const test of phaseData.tests) {
    await runTest(test);
  }
}

async function runTest(test) {
  const testId = `${test.name}(${JSON.stringify(test.args)})`;
  log(`\n▶️  Testing: ${test.name}`);

  try {
    const result = await Promise.race([
      callTool(test.name, test.args),
      timeout(CONFIG.toolTimeout),
    ]);

    log(`✅ PASSED: ${test.name}`);
    results.passed.push({ name: test.name, args: test.args });

    // Show a preview of the result
    if (result && typeof result === 'object') {
      if (result.content) {
        const preview = JSON.stringify(result.content).slice(0, 200);
        log(`   Result preview: ${preview}...`);
      }
    }
  } catch (error) {
    log(`❌ FAILED: ${test.name}`);
    log(`   Error: ${error.message}`);
    results.failed.push({ name: test.name, args: test.args, error: error.message });
  }
}

async function startServer() {
  log(`Starting MCP server from: ${CONFIG.serverPath}`);

  serverProcess = spawn('node', [CONFIG.serverPath], {
    stdio: ['pipe', 'pipe', 'inherit'],
  });

  // Wait for server to be ready
  await Promise.race([
    new Promise((resolve) => {
      serverProcess.stdout.on('data', (data) => {
        const message = data.toString();
        if (message.includes('Roblox Unified MCP server running')) {
          log('✅ Server started successfully');
          resolve();
        }
      });
    }),
    timeout(CONFIG.serverStartTimeout),
  ]);
}

async function main() {
  log('🧪 Roblox Unified MCP Tool Tester');
  log('=' .repeat(60));
  log('\n⚠️  IMPORTANT PREREQUISITES:');
  log('   1. Run: pnpm build (to build the server)');
  log('   2. Open Roblox Studio with a BLANK place');
  log('   3. Install and enable the MCP plugin in Studio');
  log('   4. Press Enter to continue when ready...\n');

  // Wait for user confirmation
  await new Promise((resolve) => {
    process.stdin.once('data', resolve);
  });

  try {
    // Start the MCP server
    await startServer();

    // Run phases in order
    const phaseOrder = [
      'docs',           // No Studio needed
      'readonly',       // Safe read operations
      'propertyRead',   // Read properties
      'propertyWrite',  // Write properties (reversible)
      'attributes',     // Attribute operations (reversible)
      'tags',           // Tag operations (reversible)
      'scriptRead',     // Read scripts
      'scriptWrite',    // Modify scripts
      'creation',       // Create objects
      'duplication',    // Duplicate objects
      'deletion',       // Delete objects (cleanup)
    ];

    for (const phaseKey of phaseOrder) {
      const phaseData = TOOL_TESTS[phaseKey];
      await runPhase(phaseKey, phaseData);
    }

    // Print summary
    log('\n' + '='.repeat(60));
    log('TEST SUMMARY');
    log('='.repeat(60));
    log(`✅ Passed: ${results.passed.length}`);
    log(`❌ Failed: ${results.failed.length}`);
    log(`⏭️  Skipped: ${results.skipped.length}`);

    if (results.failed.length > 0) {
      log('\nFailed tests:');
      for (const failure of results.failed) {
        log(`  - ${failure.name}: ${failure.error}`);
      }
    }

    if (results.skipped.length > 0) {
      log('\nSkipped tests:');
      for (const skip of results.skipped) {
        log(`  - Phase ${skip.phase}: ${skip.reason}`);
      }
    }

  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
  } finally {
    if (serverProcess) {
      log('\nShutting down server...');
      serverProcess.kill();
    }
  }
}

main();
