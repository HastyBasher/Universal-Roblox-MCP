/**
 * HTTP Bridge implementation
 * Based on robloxstudio-mcp bridge service
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseBridge, BridgeRequest } from './base-bridge.js';

interface PendingRequest extends BridgeRequest {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

export class HTTPBridge extends BaseBridge {
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private requestTimeout = 30000; // 30 seconds timeout

  async sendRequest(endpoint: string, data: unknown): Promise<unknown> {
    const requestId = uuidv4();

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, this.requestTimeout);

      const request: PendingRequest = {
        id: requestId,
        endpoint,
        data,
        timestamp: Date.now(),
        resolve,
        reject,
        timeoutId,
      };

      this.pendingRequests.set(requestId, request);
    });
  }

  resolveRequest(requestId: string, response: unknown): void {
    const request = this.pendingRequests.get(requestId);
    if (request) {
      clearTimeout(request.timeoutId);
      this.pendingRequests.delete(requestId);
      request.resolve(response);
    }
  }

  rejectRequest(requestId: string, error: unknown): void {
    const request = this.pendingRequests.get(requestId);
    if (request) {
      clearTimeout(request.timeoutId);
      this.pendingRequests.delete(requestId);
      request.reject(error);
    }
  }

  disconnect(): void {
    this.clearAllPendingRequests();
    this.setConnected(false);
  }

  getPendingRequest(): { requestId: string; request: { endpoint: string; data: unknown } } | null {
    let oldestRequest: PendingRequest | null = null;

    for (const request of this.pendingRequests.values()) {
      if (!oldestRequest || request.timestamp < oldestRequest.timestamp) {
        oldestRequest = request;
      }
    }

    if (oldestRequest) {
      return {
        requestId: oldestRequest.id,
        request: {
          endpoint: oldestRequest.endpoint,
          data: oldestRequest.data,
        },
      };
    }

    return null;
  }

  private clearAllPendingRequests(): void {
    for (const [, request] of this.pendingRequests.entries()) {
      clearTimeout(request.timeoutId);
      request.reject(new Error('Connection closed'));
    }
    this.pendingRequests.clear();
  }

  cleanupOldRequests(): void {
    const now = Date.now();
    for (const [id, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > this.requestTimeout) {
        clearTimeout(request.timeoutId);
        this.pendingRequests.delete(id);
        request.reject(new Error('Request timeout'));
      }
    }
  }
}
