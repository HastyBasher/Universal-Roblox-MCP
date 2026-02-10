/**
 * Configuration management
 */

export interface ConfigOptions {
  port?: number;
  host?: string;
  timeout?: number;
  retries?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export class ConfigManager {
  private config: Required<ConfigOptions>;

  constructor(options: ConfigOptions = {}) {
    this.config = {
      port: 3002,
      host: '0.0.0.0',
      timeout: 30000,
      retries: 3,
      logLevel: 'info',
      ...options,
    };
  }

  get<K extends keyof ConfigOptions>(key: K): ConfigOptions[K] {
    return this.config[key];
  }

  set<K extends keyof ConfigOptions>(key: K, value: ConfigOptions[K]): void {
    this.config[key as K] = value as Required<ConfigOptions>[K];
  }

  getAll(): Required<ConfigOptions> {
    return { ...this.config };
  }

  merge(options: ConfigOptions): void {
    this.config = {
      ...this.config,
      ...options,
    };
  }
}

