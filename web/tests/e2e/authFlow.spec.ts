import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { LoginPage } from '../../src/pages/LoginPage';
import { HeaderPage } from '../../src/pages/HeaderPage';
import usersData from '../../src/data/users.json';
import { Logger } from '../../src/utils/logger';

test.describe('OmniQA E2E Suite - User Authentication Flow', () => {
  let loginPage: LoginPage;
  let headerPage: HeaderPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    headerPage = new HeaderPage(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotDir = process.env.SCREENSHOT_DIR
        ? path.resolve(process.cwd(), process.env.SCREENSHOT_DIR)
        : path.resolve(process.cwd(), 'reports/screenshots');

      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const cleanTitle = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(screenshotDir, `failure_${cleanTitle}_${timestamp}.png`);

      await page.screenshot({ path: screenshotPath, fullPage: true });
      Logger.error(`[FAILURE SCREENSHOT] Captured: ${screenshotPath}`);
    }
  });

  test('TC-WEB-02: User Authentication, Session Verification & Logout Flow', async () => {
    Logger.info('Starting TC-WEB-02: Valid User Authentication & Teardown Flow...');
    await loginPage.open();
    await loginPage.login(usersData.validUser.username, usersData.validUser.password);

    const loggedInUser = await headerPage.getLoggedInUsername();
    expect(loggedInUser).toContain(usersData.validUser.username);
    Logger.info(`TC-WEB-02: User '${loggedInUser}' successfully authenticated.`);

    await headerPage.clickLogout();
    const isSignInVisible = await headerPage.isSignInVisible();
    expect(isSignInVisible).toBeTruthy();
    Logger.info('TC-WEB-02 PASSED: User authenticated and session successfully terminated.');
  });
});
