/**
 * CLI interface for Roblox MCP server
 */

import { Command } from 'commander';

export function createCli() {
  const program = new Command();

  program
    .name('roblox-mcp')
    .description('Roblox Unified MCP Server')
    .version('1.0.0');

  program
    .command('start')
    .description('Start the MCP server')
    .option('-p, --port <port>', 'Port for HTTP server', '3002')
    .option('-h, --host <host>', 'Host for HTTP server', '0.0.0.0')
    .action((options) => {
      if (options.port) {
        process.env.ROBLOX_STUDIO_PORT = options.port;
      }
      if (options.host) {
        process.env.ROBLOX_STUDIO_HOST = options.host;
      }

      // Import and start the server
      import('./index.js').then(({ startServer }) => {
        startServer();
      });
    });

  program
    .command('dev')
    .description('Start the server in development mode')
    .option('-p, --port <port>', 'Port for HTTP server', '3002')
    .option('-h, --host <host>', 'Host for HTTP server', '0.0.0.0')
    .action((options) => {
      if (options.port) {
        process.env.ROBLOX_STUDIO_PORT = options.port;
      }
      if (options.host) {
        process.env.ROBLOX_STUDIO_HOST = options.host;
      }

      // Import and start the server in dev mode
      import('./index.js').then(({ startServer }) => {
        startServer();
      });
    });

  return program;
}
