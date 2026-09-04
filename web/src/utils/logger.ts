import * as fs from 'fs';
import * as path from 'path';

export type LogLevel = 'DEBUG' | 'INFO' | 'STEP' | 'OK' | 'WARN' | 'ERROR';

/**
 * Enterprise Polyglot Unified Logger
 * Outputs structured logs to both console and session-based persistent log files.
 */
export class Logger {
  private static logFilePath: string | null = null;
  private static latestLogPath: string | null = null;

  private static initPaths(): void {
    if (!this.logFilePath) {
      const projectRoot = path.resolve(__dirname, '../../../');
      const sessionLogDir = process.env.LOG_DIR
        ? path.resolve(projectRoot, process.env.LOG_DIR)
        : path.resolve(projectRoot, 'reports/logs');

      try {
        if (!fs.existsSync(sessionLogDir)) {
          fs.mkdirSync(sessionLogDir, { recursive: true });
        }
        this.logFilePath = path.join(sessionLogDir, 'execution.log');

        const baseLogsDir = path.resolve(projectRoot, 'reports/logs');
        if (!fs.existsSync(baseLogsDir)) {
          fs.mkdirSync(baseLogsDir, { recursive: true });
        }
        this.latestLogPath = path.join(baseLogsDir, 'latest_execution.log');
      } catch {
        // Fallback gracefully if filesystem write is not permitted
      }
    }
  }

  private static writeToFile(entry: string): void {
    try {
      this.initPaths();
      if (this.logFilePath) {
        fs.appendFileSync(this.logFilePath, entry + '\n', 'utf-8');
      }
      if (this.latestLogPath && this.latestLogPath !== this.logFilePath) {
        fs.appendFileSync(this.latestLogPath, entry + '\n', 'utf-8');
      }
    } catch {
      // Ignore file write errors so tests never fail due to logging
    }
  }

  private static getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace('T', ' ').replace('Z', '');
  }

  private static formatLog(level: LogLevel, layer: string, message: string): string {
    const ts = this.getTimestamp();
    const paddedLevel = level.padEnd(5);
    const paddedLayer = layer.padEnd(4);
    return `${ts} [${paddedLevel}] [${paddedLayer}] ${message}`;
  }

  static debug(message: string, layer: string = 'SYS'): void {
    const line = this.formatLog('DEBUG', layer, message);
    if (process.env.DEBUG || process.env.LOG_LEVEL === 'DEBUG') {
      console.log(`[DEBUG] ${message}`);
    }
    this.writeToFile(line);
  }

  static info(message: string, layer: string = 'WEB'): void {
    const line = this.formatLog('INFO', layer, message);
    if (process.env.DEBUG || process.env.VERBOSE_LOGS === 'true') {
      console.log(`[INFO] ${message}`);
    }
    this.writeToFile(line);
  }

  static step(stepNumber: number | string, layer: 'WEB' | 'API' | 'DB' | 'PERF', message: string): void {
    const formattedStep = String(stepNumber).padStart(2, '0');
    const consoleMsg = `[STEP ${formattedStep}/15] [${layer.padEnd(4)}] -> ${message}`;
    const logLine = this.formatLog('STEP', layer, consoleMsg);
    console.log(consoleMsg);
    this.writeToFile(logLine);
  }

  static ok(stepNumber: number | string, layer: 'WEB' | 'API' | 'DB' | 'PERF', message: string): void {
    const formattedStep = String(stepNumber).padStart(2, '0');
    const consoleMsg = `[STEP ${formattedStep}/15] [${layer.padEnd(4)}] [OK] ${message}`;
    const logLine = this.formatLog('OK', layer, consoleMsg);
    console.log(consoleMsg);
    this.writeToFile(logLine);
  }

  static warn(message: string, layer: string = 'SYS'): void {
    const line = this.formatLog('WARN', layer, message);
    console.warn(`[WARN] ${message}`);
    this.writeToFile(line);
  }

  static error(message: string, error?: unknown, layer: string = 'SYS'): void {
    const errDetail = error instanceof Error ? `${error.message}\n${error.stack}` : error ? String(error) : '';
    const fullMsg = errDetail ? `${message} | Detail: ${errDetail}` : message;
    const line = this.formatLog('ERROR', layer, fullMsg);
    console.error(`[ERROR] ${message}`, error ?? '');
    this.writeToFile(line);
  }
}
