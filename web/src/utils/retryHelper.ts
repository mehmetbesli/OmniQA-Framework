import { Logger } from './logger';

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffFactor?: number;
  description?: string;
  retryOn?: (error: any) => boolean;
}

/**
 * Executes an asynchronous action with automatic retry capability to handle transient failures.
 *
 * @param action The asynchronous function to execute.
 * @param options Configuration for retries, delays, and exponential backoff.
 * @returns The result of the action.
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 2;
  const initialDelay = options.delayMs ?? 1000;
  const backoffFactor = options.backoffFactor ?? 1.5;
  const description = options.description ?? 'Asynchronous Action';

  let currentDelay = initialDelay;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      if (attempt > 1) {
        Logger.info(`[RETRY] Retrying '${description}' (Attempt ${attempt}/${maxRetries + 1})...`);
      }
      return await action();
    } catch (error) {
      lastError = error;

      if (options.retryOn && !options.retryOn(error)) {
        Logger.error(`[RETRY] '${description}' failed with non-retriable error: ${error}`);
        throw error;
      }

      if (attempt <= maxRetries) {
        Logger.warn(
          `[RETRY] '${description}' failed on attempt ${attempt}/${maxRetries + 1}. Error: ${
            error instanceof Error ? error.message : String(error)
          }. Waiting ${currentDelay}ms before next attempt...`
        );
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay = Math.round(currentDelay * backoffFactor);
      } else {
        Logger.error(`[RETRY] '${description}' exhausted all ${maxRetries + 1} attempts. Failing.`);
      }
    }
  }

  throw lastError;
}
