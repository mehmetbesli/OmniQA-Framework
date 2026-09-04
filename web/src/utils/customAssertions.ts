import { expect, Locator, Page } from '@playwright/test';
import { Logger } from './logger';

export class CustomAssertions {
  static async assertElementVisible(locator: Locator, description: string): Promise<void> {
    Logger.info(`Asserting element is visible: ${description}`);
    await expect(locator, `Expected '${description}' to be visible`).toBeVisible();
  }

  static async assertElementText(locator: Locator, expectedText: string, description: string): Promise<void> {
    Logger.info(`Asserting text of '${description}' matches: "${expectedText}"`);
    await expect(locator, `Expected '${description}' to have text '${expectedText}'`).toHaveText(expectedText);
  }

  static async assertElementContainsText(locator: Locator, expectedText: string, description: string): Promise<void> {
    Logger.info(`Asserting text of '${description}' contains: "${expectedText}"`);
    await expect(locator, `Expected '${description}' to contain '${expectedText}'`).toContainText(expectedText);
  }

  static async assertUrlContains(page: Page, partialUrl: string): Promise<void> {
    Logger.info(`Asserting URL contains: "${partialUrl}"`);
    await expect(page).toHaveURL(new RegExp(partialUrl));
  }
}
