import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import { APP_CONSTANTS } from '../constants/appConstants';

export class OrdersPage extends BasePage {
  readonly orderCards: Locator;
  readonly noOrdersMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.orderCards = page.locator('.order');
    this.noOrdersMessage = page.locator('.orders-empty, h2:has-text("No orders found")');
  }

  async open(): Promise<void> {
    await this.navigateTo(APP_CONSTANTS.ROUTES.ORDERS);
    await this.page.waitForTimeout(1000);
  }

  async getOrdersCount(): Promise<number> {
    await this.orderCards.first().waitFor({ state: 'visible', timeout: 15000 });
    return await this.orderCards.count();
  }

  async areOrdersDisplayed(): Promise<boolean> {
    return (await this.getOrdersCount()) > 0;
  }
}
