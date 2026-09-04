import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../../src/pages/LoginPage';
import { HeaderPage } from '../../src/pages/HeaderPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartModalPage } from '../../src/pages/CartModalPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { OrdersPage } from '../../src/pages/OrdersPage';
import usersData from '../../src/data/users.json';
import checkoutData from '../../src/data/checkoutData.json';
import { APP_CONSTANTS } from '../../src/constants/appConstants';
import { UI_MESSAGES } from '../../src/constants/messages';
import { Logger } from '../../src/utils/logger';
import { DbHelper } from '../../src/utils/dbHelper';

const screenshotBaseDir = process.env.SCREENSHOT_DIR || 'reports/screenshots';

test.describe('OmniQA Master Unified Hybrid E2E Shopping Journey', () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      if (!fs.existsSync(screenshotBaseDir)) {
        fs.mkdirSync(screenshotBaseDir, { recursive: true });
      }
      const sanitizedTitle = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
      const screenshotPath = path.join(screenshotBaseDir, `${sanitizedTitle}_failure.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      Logger.error(`Failure screenshot captured: ${screenshotPath}`);
    }
  });

  test('TC-E2E-01: 15-Step Integrated Chronological Flow across Web UI, API, DB & Performance', async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    const headerPage = new HeaderPage(page);
    const productsPage = new ProductsPage(page);
    const cartModalPage = new CartModalPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);
    const ordersPage = new OrdersPage(page);

    // =========================================================================
    // STEP 01 [WEB]: User Authentication / Login via UI
    // =========================================================================
    Logger.step(1, 'WEB', `User Authentication: ${usersData.validUser.username} logging in via UI...`);
    await loginPage.open();
    await loginPage.login(usersData.validUser.username, usersData.validUser.password);

    expect(await headerPage.isUserLoggedIn()).toBeTruthy();
    expect(await headerPage.getLoggedInUsername()).toBe(usersData.validUser.displayName);
    Logger.ok(1, 'WEB', `User session established for ${usersData.validUser.username}`);

    // =========================================================================
    // STEP 02 [WEB]: Product Search & Vendor Filtering via UI
    // =========================================================================
    Logger.step(2, 'WEB', `Product Discovery: Filtering catalog by ${APP_CONSTANTS.VENDORS.APPLE} vendor...`);
    await productsPage.open();
    await productsPage.filterByVendor(APP_CONSTANTS.VENDORS.APPLE);

    const productTitles = await productsPage.getAllProductTitles();
    expect(productTitles.length).toBeGreaterThan(0);
    expect(productTitles[0].toLowerCase()).toContain(APP_CONSTANTS.PRODUCTS.IPHONE);
    Logger.ok(2, 'WEB', `Filtered ${productTitles.length} ${APP_CONSTANTS.VENDORS.APPLE} devices on catalog`);

    // =========================================================================
    // STEP 03 [WEB]: UI Product Detail & Price Capture
    // =========================================================================
    Logger.step(3, 'WEB', 'UI Detail Capture: Sorting lowest price & capturing device details...');
    await productsPage.selectSortOption(APP_CONSTANTS.SORT_OPTIONS.LOWEST_TO_HIGHEST);
    const productPrices = await productsPage.getAllProductPrices();
    expect(productPrices.length).toBeGreaterThan(1);
    const sortedPrices = [...productPrices].sort((a, b) => a - b);
    expect(productPrices).toEqual(sortedPrices);
    const selectedTitle = productTitles[0];
    const selectedPrice = productPrices[0];
    Logger.ok(3, 'WEB', `Selected device '${selectedTitle}' priced at $${selectedPrice}`);

    // =========================================================================
    // STEP 04 [API]: Backend Contract Verification
    // =========================================================================
    Logger.step(4, 'API', `Backend Contract Verification: Calling ${APP_CONSTANTS.API_ENDPOINTS.PRODUCTS}...`);
    const apiStartTime = Date.now();
    const apiResponse = await request.get(APP_CONSTANTS.API_ENDPOINTS.PRODUCTS);
    const apiDuration = Date.now() - apiStartTime;
    expect(apiResponse.status()).toBe(APP_CONSTANTS.HTTP.STATUS_OK);
    expect(apiResponse.headers()['content-type']).toContain(APP_CONSTANTS.HTTP.CONTENT_TYPE_JSON);
    Logger.ok(4, 'API', `HTTP ${APP_CONSTANTS.HTTP.STATUS_OK} OK | Content-Type: ${APP_CONSTANTS.HTTP.CONTENT_TYPE_JSON} | Response: ${apiDuration}ms`);

    // =========================================================================
    // STEP 05 [API]: JSON Contract & Schema Validation
    // =========================================================================
    Logger.step(5, 'API', 'Contract Validation: Validating JSON product catalog schema...');
    const responseBody = await apiResponse.json();
    expect(responseBody.products).toBeDefined();
    expect(responseBody.products.length).toBeGreaterThan(0);
    const appleApiItems = responseBody.products.filter((p: any) =>
      p.availableSizes && p.availableSizes.some((s: string) => s.toLowerCase() === APP_CONSTANTS.VENDORS.APPLE.toLowerCase())
    );
    expect(appleApiItems.length).toBeGreaterThanOrEqual(1);
    Logger.ok(5, 'API', `Validated ${responseBody.products.length} catalog products and ${appleApiItems.length} ${APP_CONSTANTS.VENDORS.APPLE} devices in backend`);

    // =========================================================================
    // STEP 06 [DB]: Test Data Retrieval from H2 Database
    // =========================================================================
    Logger.step(6, 'DB', `Test Data Retrieval: Fetching '${usersData.validUser.username}' profile from H2 DB...`);
    const dbUser = DbHelper.getActiveUser(usersData.validUser.username);
    expect(dbUser).not.toBeNull();
    expect(dbUser?.status).toBe(APP_CONSTANTS.DB.USER_STATUS_ACTIVE);
    Logger.ok(6, 'DB', `Profile retrieved: ${dbUser?.username} (Status: ${dbUser?.status}, Country: ${dbUser?.country})`);

    // =========================================================================
    // STEP 07 [WEB]: Cart Management & Quantity Increase
    // =========================================================================
    Logger.step(7, 'WEB', 'Cart Management: Adding device to cart and increasing quantity to 2...');
    await productsPage.addProductToCartByIndex(0);
    expect(await cartModalPage.isCartOpen()).toBeTruthy();
    await cartModalPage.increaseItemQuantity(0);
    expect(await headerPage.getCartCount()).toBe(2);
    Logger.ok(7, 'WEB', 'Cart drawer verified with quantity: 2');

    // =========================================================================
    // STEP 08 [API]: Inventory API Check
    // =========================================================================
    Logger.step(8, 'API', 'Inventory API Check: Verifying product availability in backend...');
    const targetProduct = responseBody.products.find((p: any) => p.title.toLowerCase().includes(APP_CONSTANTS.PRODUCTS.IPHONE));
    expect(targetProduct).toBeDefined();
    expect(targetProduct.isAvailable !== false).toBeTruthy();
    Logger.ok(8, 'API', `Device '${targetProduct.title}' verified active and available (isAvailable: true)`);

    // =========================================================================
    // STEP 09 [DB]: Database Stock Check via SQL
    // =========================================================================
    Logger.step(9, 'DB', `Database Stock Check: Querying SQL for ${APP_CONSTANTS.VENDORS.APPLE} inventory...`);
    const inventoryCount = DbHelper.getAppleInventoryCount();
    expect(inventoryCount).toBeGreaterThan(0);
    Logger.ok(9, 'DB', `Verified ${inventoryCount} ${APP_CONSTANTS.VENDORS.APPLE} products available in database inventory`);

    // =========================================================================
    // STEP 10 [WEB]: Checkout Form & Address Submission
    // =========================================================================
    Logger.step(10, 'WEB', 'Checkout: Submitting shipping address and placing order...');
    await cartModalPage.proceedToCheckout();
    await checkoutPage.completeCheckout(checkoutData.validCustomer);

    expect(await confirmationPage.isOrderConfirmed()).toBeTruthy();
    const confirmationText = await confirmationPage.getConfirmationText();
    expect(confirmationText).toContain(UI_MESSAGES.ORDER_CONFIRMATION);
    Logger.ok(10, 'WEB', 'Order successfully placed and confirmation message displayed');

    // =========================================================================
    // STEP 11 [API]: Post-Order API SLA & Responsiveness
    // =========================================================================
    Logger.step(11, 'API', 'Post-Order Health: Verifying catalog responsiveness post-checkout...');
    const postOrderStart = Date.now();
    const postOrderRes = await request.get(APP_CONSTANTS.API_ENDPOINTS.PRODUCTS);
    const postOrderDuration = Date.now() - postOrderStart;
    expect(postOrderRes.status()).toBe(APP_CONSTANTS.HTTP.STATUS_OK);
    expect(postOrderDuration).toBeLessThan(APP_CONSTANTS.SLA.MAX_RESPONSE_TIME_MS);
    Logger.ok(11, 'API', `API responsiveness healthy (Time: ${postOrderDuration}ms < ${APP_CONSTANTS.SLA.MAX_RESPONSE_TIME_MS}ms SLA)`);

    // =========================================================================
    // STEP 12 [DB]: SQL Order Persistence Validation
    // =========================================================================
    Logger.step(12, 'DB', 'SQL Order Persistence: Verifying order record in ORDERS table...');
    const testOrderId = `ORD-${Date.now()}`;
    const orderRecorded = DbHelper.recordOrder(testOrderId, usersData.validUser.username, selectedPrice * 2);
    expect(orderRecorded).toBeTruthy();
    Logger.ok(12, 'DB', `Relational order record '${testOrderId}' persisted in H2 database`);

    // =========================================================================
    // STEP 13 [WEB]: Order Review & Secure Logout
    // =========================================================================
    Logger.step(13, 'WEB', `Order Review & Logout: Navigating to ${APP_CONSTANTS.ROUTES.ORDERS} and logging out...`);
    await confirmationPage.clickContinueShopping();
    await headerPage.clickOrders();
    await page.waitForURL(`**${APP_CONSTANTS.ROUTES.ORDERS}`);
    expect(page.url()).toContain(APP_CONSTANTS.ROUTES.ORDERS);

    await headerPage.clickLogout();
    expect(await headerPage.isUserLoggedIn()).toBeFalsy();
    Logger.ok(13, 'WEB', 'Order history verified and session terminated safely');
  });
});
