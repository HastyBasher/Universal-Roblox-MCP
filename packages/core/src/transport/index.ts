/**
 * Transport layer abstractions
 */

export interface TransportOptions {
  timeout?: number;
  retries?: number;
}

export interface RequestResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export abstract class TransportBase {
  protected options: TransportOptions;

  constructor(options: TransportOptions = {}) {
    this.options = {
      timeout: 30000,
      retries: 3,
      ...options,
    };
  }

  abstract send(endpoint: string, data: unknown): Promise<RequestResponse>;
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract isConnected(): boolean;
}
