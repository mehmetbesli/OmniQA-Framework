import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import { APP_CONSTANTS } from '../constants/appConstants';

export class LoginPage extends BasePage {
  readonly usernameDropdown: Locator;
  readonly passwordDropdown: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly usernameFirstOption: Locator;
  readonly passwordFirstOption: Locator;
  readonly dropdownOptions: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameDropdown = page.locator('#username');
    this.passwordDropdown = page.locator('#password');
    this.usernameInput = page.locator('#username input');
    this.passwordInput = page.locator('#password input');
    this.usernameFirstOption = page.locator('#react-select-2-option-0-0');
    this.passwordFirstOption = page.locator('#react-select-3-option-0-0');
    this.dropdownOptions = page.locator('div[id^="react-select"][id*="option"]');
    this.loginButton = page.locator('#login-btn');
    this.errorMessage = page.locator('.api-error');
  }

  async open(): Promise<void> {
    await this.navigateTo(APP_CONSTANTS.ROUTES.SIGNIN);
    await this.usernameDropdown.waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectUsername(username: string): Promise<void> {
    Logger.info(`Selecting username: ${username}`);
    await this.usernameDropdown.click();
    await this.page.waitForTimeout(200);
    const option = this.page.locator('div[id*="react-select"][id*="option"], [class*="-option"]').filter({ hasText: new RegExp(`^${username}$`, 'i') }).first();
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click();
    } else {
      const anyOption = this.page.locator('div[id*="react-select"][id*="option"]').first();
      if (await anyOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await anyOption.click();
      } else {
        await this.usernameInput.fill(username).catch(() => {});
        await this.page.keyboard.press('Enter').catch(() => {});
      }
    }
    await this.page.waitForTimeout(200);
  }

  async selectPassword(password: string): Promise<void> {
    Logger.info(`Selecting password: ${password}`);
    await this.passwordDropdown.click();
    await this.page.waitForTimeout(200);
    const option = this.page.locator('div[id*="react-select"][id*="option"], [class*="-option"]').filter({ hasText: password }).first();
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click();
    } else {
      const anyOption = this.page.locator('div[id*="react-select"][id*="option"]').first();
      if (await anyOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await anyOption.click();
      } else {
        await this.passwordInput.fill(password).catch(() => {});
        await this.page.keyboard.press('Enter').catch(() => {});
      }
    }
    await this.page.waitForTimeout(200);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton, 'Log In Button');
  }

  async login(username: string, password: string): Promise<void> {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.clickLogin();
    await this.page.locator('.username').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    return await this.getText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
