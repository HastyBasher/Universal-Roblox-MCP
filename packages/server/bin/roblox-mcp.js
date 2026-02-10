#!/usr/bin/env node

/**
 * Roblox MCP CLI executable
 */

import { createCli } from '../dist/cli.js';

const cli = createCli();
cli.parse(process.argv);
