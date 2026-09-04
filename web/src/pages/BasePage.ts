import { Page, Locator, Response } from '@playwright/test';
import { EnvConfig } from '../config/env.config';
import { Logger } from '../utils/logger';
import { retryAction } from '../utils/retryHelper';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = ''): Promise<Response | null> {
    const fullUrl = `${EnvConfig.BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
    Logger.info(`Navigating to URL: ${fullUrl}`);
    return await retryAction(
      async () => await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' }),
      { maxRetries: 2, delayMs: 1000, description: `Navigate to ${fullUrl}` }
    );
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout: EnvConfig.TIMEOUT.ELEMENT });
  }

  async click(locator: Locator, description?: string): Promise<void> {
    await retryAction(
      async () => {
        if (description) Logger.info(`Clicking on: ${description}`);
        await locator.waitFor({ state: 'visible', timeout: EnvConfig.TIMEOUT.ELEMENT });
        await locator.click();
      },
      { maxRetries: 2, delayMs: 500, description: description || 'Element Click' }
    );
  }

  async fill(locator: Locator, text: string, description?: string): Promise<void> {
    await retryAction(
      async () => {
        if (description) Logger.info(`Filling "${text}" into: ${description}`);
        await locator.waitFor({ state: 'visible', timeout: EnvConfig.TIMEOUT.ELEMENT });
        await locator.fill(text);
      },
      { maxRetries: 2, delayMs: 500, description: description || 'Element Fill' }
    );
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: EnvConfig.TIMEOUT.ELEMENT });
    return (await locator.textContent())?.trim() || '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: EnvConfig.TIMEOUT.ELEMENT });
  }
}
