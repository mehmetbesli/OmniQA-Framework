import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class CartModalPage extends BasePage {
  readonly cartContainer: Locator;
  readonly closeCartButton: Locator;
  readonly cartItems: Locator;
  readonly cartItemTitles: Locator;
  readonly cartDeleteButtons: Locator;
  readonly subtotalPrice: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartContainer = page.locator('.float-cart, .float-cart--open');
    this.closeCartButton = page.locator('.float-cart__close-btn');
    this.cartItems = page.locator('.float-cart .shelf-item');
    this.cartItemTitles = page.locator('.float-cart .shelf-item .title');
    this.cartDeleteButtons = page.locator('.float-cart .shelf-item__del');
    this.subtotalPrice = page.locator('.sub-price__val');
    this.checkoutButton = page.locator('.buy-btn');
    this.emptyCartMessage = page.locator('.shelf-empty');
  }

  async isCartOpen(): Promise<boolean> {
    return await this.cartContainer.isVisible();
  }

  async closeCart(): Promise<void> {
    Logger.info('Closing cart drawer');
    await this.click(this.closeCartButton, 'Close Cart Button');
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemTitles(): Promise<string[]> {
    return await this.cartItemTitles.allTextContents();
  }

  async getSubtotal(): Promise<string> {
    return await this.getText(this.subtotalPrice);
  }

  async increaseItemQuantity(index: number = 0): Promise<void> {
    Logger.info(`Increasing quantity of cart item at index: ${index}`);
    const plusBtn = this.cartItems.nth(index).locator('button').filter({ hasText: '+' });
    await plusBtn.click();
    await this.page.waitForTimeout(300);
  }

  async decreaseItemQuantity(index: number = 0): Promise<void> {
    Logger.info(`Decreasing quantity of cart item at index: ${index}`);
    const minusBtn = this.cartItems.nth(index).locator('button').filter({ hasText: '-' });
    await minusBtn.click();
    await this.page.waitForTimeout(300);
  }

  async removeCartItem(index: number = 0): Promise<void> {
    Logger.info(`Removing cart item at index: ${index}`);
    const deleteBtn = this.cartDeleteButtons.nth(index);
    await deleteBtn.click();
    await this.page.waitForTimeout(300);
  }

  async proceedToCheckout(): Promise<void> {
    Logger.info('Clicking Checkout button in cart');
    await this.click(this.checkoutButton, 'Checkout Button');
  }
}
