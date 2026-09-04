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
    await this.usernameDropdown.waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectUsername(username: string): Promise<void> {
    await this.usernameDropdown.click();
    if (await this.usernameFirstOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.usernameFirstOption.click();
    } else {
      const option = this.dropdownOptions.filter({ hasText: username });
      if (await option.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.first().click();
      } else {
        await this.usernameInput.fill(username);
        await this.page.keyboard.press('Enter');
      }
    }
  }

  async selectPassword(password: string): Promise<void> {
    await this.passwordDropdown.click();
    if (await this.passwordFirstOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.passwordFirstOption.click();
    } else {
      const option = this.dropdownOptions.filter({ hasText: password });
      if (await option.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.first().click();
      } else {
        await this.passwordInput.fill(password);
        await this.page.keyboard.press('Enter');
      }
    }
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton, 'Log In Button');
  }

  async login(username: string, password: string): Promise<void> {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.clickLogin();
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
