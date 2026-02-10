/**
 * Python subprocess bridge for mcp-roblox-docs
 *
 * Communicates with the mcp-roblox-docs MCP server via stdio using uvx
 */

import { spawn, ChildProcess } from 'child_process';
import { Readable } from 'stream';
import { TextDecoder } from 'util';

export interface PythonBridgeOptions {
  /**
   * Command to run the Python MCP server
   * Default: 'uvx' (recommended by mcp-roblox-docs)
   */
  command?: string;

  /**
   * Arguments for the command
   * Default: ['mcp-roblox-docs']
   */
  args?: string[];

  /**
   * Environment variables to pass to the subprocess
   */
  env?: NodeJS.ProcessEnv;

  /**
   * Timeout in milliseconds for requests
   * Default: 30000 (30 seconds)
   */
  timeout?: number;
}

export interface MCPRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPMessage {
  jsonrpc: '2.0';
  method: string;
  params?: any;
}

/**
 * Manages communication with the mcp-roblox-docs Python MCP server
 */
export class PythonBridge {
  private process: ChildProcess | null = null;
  private options: Required<Omit<PythonBridgeOptions, 'env'>> & { env?: NodeJS.ProcessEnv };
  private messageId = 0;
  private pendingRequests: Map<number | string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = new Map();
  private messageBuffer = '';
  private decoder = new TextDecoder();
  private isInitialized = false;

  constructor(options: PythonBridgeOptions = {}) {
    this.options = {
      command: options.command || 'uvx',
      args: options.args || ['mcp-roblox-docs'],
      timeout: options.timeout || 30000,
      env: options.env,
    };
  }

  /**
   * Start the Python MCP server subprocess
   */
  async start(): Promise<void> {
    if (this.process) {
      throw new Error('Python bridge already started');
    }

    this.process = spawn(this.options.command, this.options.args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...this.options.env },
    });

    return new Promise((resolve, reject) => {
      if (!this.process) {
        return reject(new Error('Failed to start Python process'));
      }

      const startupTimeout = setTimeout(() => {
        reject(new Error('Python bridge startup timeout'));
      }, 10000);

      this.process.on('error', (err) => {
        clearTimeout(startupTimeout);
        reject(new Error(`Failed to start Python bridge: ${err.message}`));
      });

      this.process.on('exit', (code, signal) => {
        this.process = null;
        this.isInitialized = false;
        // Reject all pending requests
        for (const pending of this.pendingRequests.values()) {
          clearTimeout(pending.timeout);
          pending.reject(new Error(`Python process exited with code ${code} (signal: ${signal})`));
        }
        this.pendingRequests.clear();
      });

      // Handle stdout (MCP responses and notifications)
      this.process.stdout?.on('data', (data: Buffer) => {
        this.handleStdout(data);
      });

      // Handle stderr (logging/debug info)
      this.process.stderr?.on('data', (data: Buffer) => {
        const text = this.decoder.decode(data, { stream: true });
        // Log stderr to console.error for debugging
        console.error(`[mcp-roblox-docs stderr] ${text}`);
      });

      // Initialize the MCP connection
      this.initialize()
        .then(() => {
          clearTimeout(startupTimeout);
          resolve();
        })
        .catch((err) => {
          clearTimeout(startupTimeout);
          this.stop();
          reject(err);
        });
    });
  }

  /**
   * Initialize the MCP connection
   */
  private async initialize(): Promise<void> {
    try {
      // Send initialize request
      const initResponse = await this.sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'roblox-unified-mcp',
          version: '1.0.0',
        },
      });

      if (!initResponse || initResponse.error) {
        throw new Error(`Initialize failed: ${initResponse?.error?.message || 'Unknown error'}`);
      }

      // Send initialized notification
      this.sendNotification('notifications/initialized');

      this.isInitialized = true;
    } catch (error) {
      throw new Error(`MCP initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle stdout data from the Python process
   */
  private handleStdout(data: Buffer): void {
    this.messageBuffer += this.decoder.decode(data, { stream: true });

    // Process complete JSON-RPC messages (one per line)
    const lines = this.messageBuffer.split('\n');
    this.messageBuffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const message = JSON.parse(line) as MCPResponse | MCPMessage;

        if ('id' in message) {
          // This is a response to a request
          const pending = this.pendingRequests.get(message.id);
          if (pending) {
            clearTimeout(pending.timeout);
            this.pendingRequests.delete(message.id);

            if (message.error) {
              pending.reject(new Error(`MCP error ${message.error.code}: ${message.error.message}`));
            } else {
              pending.resolve(message.result);
            }
          }
        } else {
          // This is a notification (no id)
          // Handle notifications if needed (e.g., logging/message updates)
        }
      } catch (error) {
        console.error(`Failed to parse MCP message: ${line}`);
      }
    }
  }

  /**
   * Send a request and wait for a response
   */
  private async sendRequest(method: string, params?: any): Promise<any> {
    if (!this.process || !this.process.stdin) {
      throw new Error('Python bridge not started');
    }

    // Allow the initial handshake request before bridge initialization completes.
    const isInitializeRequest = method === 'initialize';
    if (!this.isInitialized && !isInitializeRequest) {
      throw new Error('Python bridge not initialized');
    }

    const id = ++this.messageId;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, this.options.timeout);

      this.pendingRequests.set(id, { resolve, reject, timeout });

      const request: MCPRequest = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      };

      try {
        this.process!.stdin!.write(JSON.stringify(request) + '\n');
      } catch (error) {
        clearTimeout(timeout);
        this.pendingRequests.delete(id);
        reject(new Error(`Failed to send request: ${error instanceof Error ? error.message : String(error)}`));
      }
    });
  }

  /**
   * Send a notification (no response expected)
   */
  private sendNotification(method: string, params?: any): void {
    if (!this.process || !this.process.stdin) {
      return;
    }

    const notification: MCPMessage = {
      jsonrpc: '2.0',
      method,
      params,
    };

    try {
      this.process!.stdin!.write(JSON.stringify(notification) + '\n');
    } catch (error) {
      console.error(`Failed to send notification: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * List all available tools from the MCP server
   */
  async listTools(): Promise<any[]> {
    const response = await this.sendRequest('tools/list');
    return response?.tools || [];
  }

  /**
   * Call a specific tool
   */
  async callTool(name: string, args: Record<string, any>): Promise<any> {
    const response = await this.sendRequest('tools/call', {
      name,
      arguments: args,
    });
    return response;
  }

  /**
   * Stop the Python bridge
   */
  async stop(): Promise<void> {
    if (!this.process) {
      return;
    }

    return new Promise((resolve) => {
      const cleanup = () => {
        this.process = null;
        this.isInitialized = false;
        resolve();
      };

      this.process!.on('exit', cleanup);
      this.process!.kill('SIGTERM');

      // Force cleanup after 5 seconds
      setTimeout(() => {
        if (this.process) {
          this.process.kill('SIGKILL');
          cleanup();
        }
      }, 5000);
    });
  }

  /**
   * Check if the bridge is running
   */
  isRunning(): boolean {
    return this.process !== null && !this.process.killed && this.isInitialized;
  }

  /**
   * Get the current process state
   */
  getStatus(): { running: boolean; initialized: boolean; pid?: number } {
    return {
      running: this.process !== null && !this.process.killed,
      initialized: this.isInitialized,
      pid: this.process?.pid,
    };
  }
}
