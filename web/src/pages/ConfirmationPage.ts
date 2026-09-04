import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class ConfirmationPage extends BasePage {
  readonly confirmationHeading: Locator;
  readonly downloadReceiptLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationHeading = page.locator('#confirmation-message');
    this.downloadReceiptLink = page.locator('a:has-text("Download order receipt")');
    this.continueShoppingButton = page.locator('.button, button:has-text("Continue Shopping")');
  }

  async getConfirmationText(): Promise<string> {
    await this.confirmationHeading.waitFor({ state: 'visible', timeout: 15000 });
    return await this.getText(this.confirmationHeading);
  }

  async isOrderConfirmed(): Promise<boolean> {
    try {
      await this.confirmationHeading.waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickContinueShopping(): Promise<void> {
    Logger.info('Clicking Continue Shopping button');
    await this.click(this.continueShoppingButton, 'Continue Shopping Button');
  }
}
