import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class HeaderPage extends BasePage {
  readonly logoLink: Locator;
  readonly signInButton: Locator;
  readonly usernameLabel: Locator;
  readonly logoutButton: Locator;
  readonly ordersLink: Locator;
  readonly favouritesLink: Locator;
  readonly offersLink: Locator;
  readonly cartBagButton: Locator;
  readonly cartBagCount: Locator;

  constructor(page: Page) {
    super(page);
    this.logoLink = page.locator('.Navbar_logo__26S5Y, a.Navbar_logo__26S5Y, .logo');
    this.signInButton = page.locator('#signin');
    this.usernameLabel = page.locator('.username');
    this.logoutButton = page.getByText('Logout');
    this.ordersLink = page.locator('#orders');
    this.favouritesLink = page.locator('#favourites, #favorites');
    this.offersLink = page.locator('#offers');
    this.cartBagButton = page.locator('.bag, .bag--float-cart-closed');
    this.cartBagCount = page.locator('.bag__quantity');
  }

  async clickSignIn(): Promise<void> {
    Logger.info('Clicking Sign In button in header');
    await this.click(this.signInButton, 'Sign In Link');
  }

  async isSignInVisible(): Promise<boolean> {
    return await this.isVisible(this.signInButton);
  }

  async clickLogout(): Promise<void> {
    Logger.info('Clicking Logout button in header');
    await this.click(this.logoutButton, 'Logout Button');
    await this.page.waitForTimeout(500);
  }

  async getLoggedInUsername(): Promise<string> {
    await this.usernameLabel.waitFor({ state: 'visible', timeout: 15000 });
    return await this.getText(this.usernameLabel);
  }

  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.usernameLabel.waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickOrders(): Promise<void> {
    Logger.info('Clicking Orders in header');
    await this.click(this.ordersLink, 'Orders Link');
  }

  async clickOffers(): Promise<void> {
    Logger.info('Clicking Offers in header');
    await this.click(this.offersLink, 'Offers Link');
  }

  async clickFavourites(): Promise<void> {
    Logger.info('Clicking Favourites in header');
    await this.click(this.favouritesLink, 'Favourites Link');
  }

  async openCart(): Promise<void> {
    Logger.info('Opening Cart bag from header');
    await this.click(this.cartBagButton, 'Cart Bag Icon');
  }

  async getCartCount(): Promise<number> {
    const text = await this.getText(this.cartBagCount);
    return parseInt(text || '0', 10);
  }
}
