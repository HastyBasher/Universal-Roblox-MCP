/**
 * Unified client interface for Studio bridge
 */

import { BaseBridge } from './bridges/base-bridge.js';

export class StudioClient {
  private bridge: BaseBridge;

  constructor(bridge: BaseBridge) {
    this.bridge = bridge;
  }

  async request(endpoint: string, data: unknown): Promise<unknown> {
    try {
      const response = await this.bridge.sendRequest(endpoint, data);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message === 'Request timeout') {
        throw new Error(
          'Studio plugin connection timeout. Make sure the Roblox Studio plugin is running and activated.'
        );
      }
      throw error;
    }
  }

  isConnected(): boolean {
    return this.bridge.isConnected();
  }

  disconnect(): void {
    this.bridge.disconnect();
  }
}
