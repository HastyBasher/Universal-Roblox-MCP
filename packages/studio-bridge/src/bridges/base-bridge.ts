/**
 * Base bridge interface
 */

export interface BridgeRequest {
  id: string;
  endpoint: string;
  data: unknown;
  timestamp: number;
}

export interface BridgeResponse {
  requestId: string;
  response?: unknown;
  error?: string;
}

export abstract class BaseBridge {
  protected connected = false;

  abstract sendRequest(endpoint: string, data: unknown): Promise<unknown>;
  abstract resolveRequest(requestId: string, response: unknown): void;
  abstract rejectRequest(requestId: string, error: unknown): void;
  abstract disconnect(): void;

  isConnected(): boolean {
    return this.connected;
  }

  protected setConnected(connected: boolean): void {
    this.connected = connected;
  }
}
