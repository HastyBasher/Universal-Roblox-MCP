#!/usr/bin/env node

/**
 * Simple MCP communication test
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const serverPath = join(__dirname, 'packages', 'server', 'dist', 'index.js');

console.log('Starting server:', serverPath);

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, SKIP_DOCS: '1', ROBLOX_STUDIO_PORT: '3999' }
});

let responses = [];
let errors = [];

server.stdout.on('data', (data) => {
  const text = data.toString();
  console.log('[STDOUT]', text);
  responses.push(text);
});

server.stderr.on('data', (data) => {
  const text = data.toString();
  console.log('[STDERR]', text);
});

server.on('error', (err) => {
  console.error('[ERROR]', err);
  errors.push(err);
});

// Wait for server to start
await new Promise(resolve => setTimeout(resolve, 3000));

console.log('\n--- Sending list_tools request ---');

const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

console.log('Sending:', JSON.stringify(listToolsRequest));
server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

// Wait for response
await new Promise(resolve => setTimeout(resolve, 3000));

console.log('\n--- Sending get_place_info request ---');

const getPlaceInfoRequest = {
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: {
    name: 'get_place_info',
    arguments: {}
  }
};

console.log('Sending:', JSON.stringify(getPlaceInfoRequest));
server.stdin.write(JSON.stringify(getPlaceInfoRequest) + '\n');

// Wait for response
await new Promise(resolve => setTimeout(resolve, 3000));

console.log('\n--- Summary ---');
console.log('Responses received:', responses.length);
console.log('Errors:', errors.length);

// Cleanup
server.kill();
