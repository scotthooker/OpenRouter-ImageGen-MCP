/**
 * Logger Utility
 * Simple logging infrastructure that can be extended in the future
 */

export class Logger {
  private readonly context: string;

  constructor(context: string = 'App') {
    this.context = context;
  }

  info(message: string, ...args: unknown[]): void {
    console.error(`[${this.context}] INFO: ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.error(`[${this.context}] WARN: ${message}`, ...args);
  }

  error(message: string, error?: Error, ...args: unknown[]): void {
    console.error(`[${this.context}] ERROR: ${message}`, error, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.DEBUG) {
      console.error(`[${this.context}] DEBUG: ${message}`, ...args);
    }
  }
}
