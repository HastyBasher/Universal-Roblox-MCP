#!/usr/bin/env node

/**
 * Single Phase Tester - Test one phase at a time for easier debugging
 *
 * Usage:
 *   node test-single-phase.js docs          # Test documentation tools
 *   node test-single-phase.js readonly      # Test read-only tools
 *   node test-single-phase.js creation      # Test creation tools
 *   node test-single-phase.js list          # List all phases
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Phase definitions (imported from test-tools.js logic)
const PHASES = {
  docs: {
    name: 'Documentation Tools',
    requiresStudio: false,
    tools: [
      { name: 'roblox_health', args: {} },
      { name: 'roblox_search', args: { query: 'Part' } },
      { name: 'robox_list_services', args: {} },
      { name: 'roblox_get_class', args: { class_name: 'Part' } },
      { name: 'roblox_get_datatype', args: { name: 'Vector3' } },
      { name: 'roblox_get_enum', args: { enum_name: 'Material' } },
      { name: 'roblox_list_datatypes', args: {} },
      { name: 'roblox_list_enums', args: {} },
      { name: 'roblox_list_libraries', args: {} },
      { name: 'roblox_get_library', args: { name: 'math' } },
      { name: 'roblox_get_luau_globals', args: {} },
    ],
  },

  readonly: {
    name: 'Read-Only Studio Tools',
    requiresStudio: true,
    tools: [
      { name: 'get_place_info', args: {} },
      { name: 'get_file_tree', args: { path: '' } },
      { name: 'get_project_structure', args: { path: 'Workspace' } },
      { name: 'get_services', args: {} },
      { name: 'search_objects', args: { query: 'Part', searchType: 'name' } },
      { name: 'get_selection', args: {} },
    ],
  },

  propertyWrite: {
    name: 'Property Modification Tools',
    requiresStudio: true,
    setup: 'create_test_part',
    tools: [
      { name: 'get_instance_properties', args: { instancePath: 'Workspace.TestPart' } },
      { name: 'set_property', args: { instancePath: 'Workspace.TestPart', propertyName: 'Anchored', propertyValue: true } },
      { name: 'set_property', args: { instancePath: 'Workspace.TestPart', propertyName: 'BrickColor', propertyValue: 'Bright red' } },
      { name: 'mass_set_property', args: { paths: ['Workspace.TestPart'], propertyName: 'Transparency', propertyValue: 0.5 } },
    ],
  },

  attributes: {
    name: 'Attribute Tools',
    requiresStudio: true,
    setup: 'create_test_part',
    tools: [
      { name: 'set_attribute', args: { instancePath: 'Workspace.TestPart', attributeName: 'TestNumber', attributeValue: 42 } },
      { name: 'set_attribute', args: { instancePath: 'Workspace.TestPart', attributeName: 'TestString', attributeValue: 'Hello' } },
      { name: 'get_attribute', args: { instancePath: 'Workspace.TestPart', attributeName: 'TestNumber' } },
      { name: 'get_attributes', args: { instancePath: 'Workspace.TestPart' } },
      { name: 'delete_attribute', args: { instancePath: 'Workspace.TestPart', attributeName: 'TestNumber' } },
    ],
  },

  tags: {
    name: 'Tag Tools',
    requiresStudio: true,
    setup: 'create_test_part',
    tools: [
      { name: 'add_tag', args: { instancePath: 'Workspace.TestPart', tagName: 'TestTag1' } },
      { name: 'add_tag', args: { instancePath: 'Workspace.TestPart', tagName: 'TestTag2' } },
      { name: 'get_tags', args: { instancePath: 'Workspace.TestPart' } },
      { name: 'get_tagged', args: { tagName: 'TestTag1' } },
      { name: 'remove_tag', args: { instancePath: 'Workspace.TestPart', tagName: 'TestTag1' } },
      { name: 'remove_tag', args: { instancePath: 'Workspace.TestPart', tagName: 'TestTag2' } },
    ],
  },

  scripts: {
    name: 'Script Tools',
    requiresStudio: true,
    setup: 'create_test_script',
    tools: [
      { name: 'get_script_source', args: { instancePath: 'ServerScriptService.TestScript' } },
      { name: 'set_script_source', args: { instancePath: 'ServerScriptService.TestScript', source: '-- Modified\nprint("Hello!")' } },
      { name: 'edit_script_lines', args: { instancePath: 'ServerScriptService.TestScript', startLine: 1, endLine: 1, newContent: '-- Modified script' } },
      { name: 'insert_script_lines', args: { instancePath: 'ServerScriptService.TestScript', afterLine: 1, newContent: 'print("Inserted")' } },
    ],
  },

  creation: {
    name: 'Object Creation Tools',
    requiresStudio: true,
    tools: [
      { name: 'create_object', args: { className: 'Folder', parent: 'Workspace', name: 'TestFolder' } },
      { name: 'create_object', args: { className: 'Part', parent: 'Workspace.TestFolder', name: 'ChildPart' } },
      { name: 'create_object_with_properties', args: { className: 'Part', parent: 'Workspace', name: 'CustomPart', properties: { Size: '5,1,5', Anchored: true, BrickColor: 'Bright blue' } } },
      { name: 'mass_create_objects', args: { objects: [
        { className: 'Part', parent: 'Workspace', name: 'Mass1' },
        { className: 'Part', parent: 'Workspace', name: 'Mass2' },
        { className: 'Part', parent: 'Workspace', name: 'Mass3' },
      ]}},
    ],
  },

  duplication: {
    name: 'Duplication Tools',
    requiresStudio: true,
    setup: 'create_test_part',
    tools: [
      { name: 'smart_duplicate', args: { instancePath: 'Workspace.TestPart', count: 3, options: { offset: '5,0,0' } } },
      { name: 'mass_duplicate', args: { duplications: [
        { instancePath: 'Workspace.TestPart', count: 2, options: { offset: '0,5,0' } },
      ]}},
    ],
  },

  deletion: {
    name: 'Deletion Tools (Cleanup)',
    requiresStudio: true,
    tools: [
      { name: 'delete_object', args: { instancePath: 'Workspace.TestFolder' } },
      { name: 'delete_object', args: { instancePath: 'Workspace.CustomPart' } },
      { name: 'delete_object', args: { instancePath: 'Workspace.Mass1' } },
      { name: 'delete_object', args: { instancePath: 'Workspace.Mass2' } },
      { name: 'delete_object', args: { instancePath: 'Workspace.Mass3' } },
    ],
  },
};

// Setup functions
const SETUP_FUNCTIONS = {
  async create_test_part(callTool) {
    try {
      await callTool('create_object', {
        className: 'Part',
        parent: 'Workspace',
        name: 'TestPart'
      });
      console.log('   ✅ Created TestPart');
    } catch (e) {
      console.log('   ⚠️  TestPart may already exist or failed to create');
    }
  },

  async create_test_script(callTool) {
    try {
      await callTool('create_object', {
        className: 'Script',
        parent: 'ServerScriptService',
        name: 'TestScript'
      });
      await callTool('set_script_source', {
        instancePath: 'ServerScriptService.TestScript',
        source: '-- Test script\nprint("Hello from test!")'
      });
      console.log('   ✅ Created TestScript');
    } catch (e) {
      console.log('   ⚠️  TestScript may already exist or failed to create');
    }
  },
};

const CONFIG = {
  toolTimeout: 10000,
  serverStartTimeout: 30000,
  serverPath: join(__dirname, 'packages', 'server', 'dist', 'index.js'),
};

let serverProcess = null;

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms));
}

async function callTool(toolName, args) {
  const protocol = {
    jsonrpc: '2.0',
    id: Date.now() + Math.random(),
    method: 'tools/call',
    params: { name: toolName, arguments: args },
  };

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('Server response timeout')), CONFIG.toolTimeout);

    const handler = (data) => {
      try {
        const response = JSON.parse(data.toString());
        if (response.id === protocol.id) {
          clearTimeout(timeoutId);
          serverProcess.stdout.off('data', handler);
          if (response.error) reject(new Error(response.error.message));
          else resolve(response.result);
        }
      } catch (e) {}
    };

    serverProcess.stdout.on('data', handler);
    serverProcess.stdin.write(JSON.stringify(protocol) + '\n');
  });
}

async function startServer() {
  log(`Starting server from: ${CONFIG.serverPath}`);
  // Capture stderr to detect server startup
  serverProcess = spawn('node', [CONFIG.serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, SKIP_DOCS: '1' }  // Skip docs bridge for faster startup
  });

  // Forward stderr for debugging
  serverProcess.stderr.on('data', (data) => {
    const msg = data.toString();
    process.stderr.write(`[Server] ${msg}`);
    if (msg.includes('Roblox Unified MCP server running')) {
      serverReady = true;
    }
  });

  let serverReady = false;
  await Promise.race([
    new Promise((resolve) => {
      const checkReady = setInterval(() => {
        if (serverReady) {
          clearInterval(checkReady);
          log('✅ Server started');
          resolve();
        }
      }, 100);
    }),
    timeout(CONFIG.serverStartTimeout),
  ]);
}

async function testPhase(phaseKey) {
  const phase = PHASES[phaseKey];
  if (!phase) {
    console.error(`Unknown phase: ${phaseKey}`);
    console.log('\nAvailable phases:');
    Object.entries(PHASES).forEach(([key, p]) => console.log(`  ${key.padEnd(15)} - ${p.name}`));
    process.exit(1);
  }

  log(`\n${'='.repeat(60)}`);
  log(`PHASE: ${phase.name}`);
  log(`${'='.repeat(60)}\n`);

  if (phase.requiresStudio) {
    log('⚠️  Requires Roblox Studio running with MCP plugin');
  }

  if (phase.setup && SETUP_FUNCTIONS[phase.setup]) {
    log('Running setup...');
    await SETUP_FUNCTIONS[phase.setup](callTool);
  }

  let passed = 0, failed = 0;

  for (const tool of phase.tools) {
    log(`\n▶️  ${tool.name}`);
    try {
      const result = await Promise.race([
        callTool(tool.name, tool.args),
        timeout(CONFIG.toolTimeout),
      ]);
      log(`   ✅ PASS`);
      passed++;
      if (result?.content?.[0]?.text) {
        const preview = result.content[0].text.slice(0, 100);
        log(`   Preview: ${preview}...`);
      }
    } catch (error) {
      log(`   ❌ FAIL: ${error.message}`);
      failed++;
    }
  }

  log(`\n${'='.repeat(60)}`);
  log(`Results: ${passed} passed, ${failed} failed`);
  log(`${'='.repeat(60)}`);
}

// Main
const phaseKey = process.argv[2];

if (phaseKey === 'list' || !phaseKey) {
  console.log('\nAvailable test phases:\n');
  Object.entries(PHASES).forEach(([key, p]) => {
    console.log(`  ${key.padEnd(15)} - ${p.name} ${p.requiresStudio ? '[Studio]' : '[Standalone]'}`);
  });
  console.log('\nUsage: node test-single-phase.js <phase_name>\n');
  process.exit(0);
}

startServer()
  .then(() => testPhase(phaseKey))
  .catch(console.error)
  .finally(() => {
    if (serverProcess) {
      log('Shutting down...');
      serverProcess.kill();
    }
  });
