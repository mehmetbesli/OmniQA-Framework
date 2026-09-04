import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import { APP_CONSTANTS } from '../constants/appConstants';

export class ProductsPage extends BasePage {
  readonly productsFoundLabel: Locator;
  readonly productCards: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;
  readonly buyButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.productsFoundLabel = page.locator('.products-found');
    this.productCards = page.locator('.shelf-item');
    this.productTitles = page.locator('.shelf-item__title');
    this.productPrices = page.locator('.shelf-item__price .val b');
    this.sortDropdown = page.locator('.sort select');
    this.buyButtons = page.locator('.shelf-item__buy-btn');
  }

  async open(): Promise<void> {
    await this.navigateTo(APP_CONSTANTS.ROUTES.HOME);
  }

  async getProductsCount(): Promise<number> {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.productCards.count();
  }

  getVendorCheckbox(vendor: string): Locator {
    return this.page.locator(`label:has-text("${vendor}") span.checkmark, input[value="${vendor}"] + span`);
  }

  async filterByVendor(vendor: string): Promise<void> {
    Logger.info(`Filtering products by vendor: "${vendor}"`);
    const vendorCheckbox = this.getVendorCheckbox(vendor);
    await vendorCheckbox.click();
    await this.page.waitForTimeout(500);
  }

  async selectSortOption(sortValue: 'lowestprice' | 'highestprice' | string): Promise<void> {
    Logger.info(`Sorting products by: "${sortValue}"`);
    await this.sortDropdown.selectOption(sortValue);
    await this.page.waitForTimeout(500);
  }

  async getAllProductTitles(): Promise<string[]> {
    return await this.productTitles.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const rawPrices = await this.productPrices.allTextContents();
    return rawPrices.map(p => parseFloat(p.trim()));
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    Logger.info(`Adding product at index ${index} to cart`);
    const buyButton = this.buyButtons.nth(index);
    await buyButton.click();
  }

  async addProductToCartByTitle(productTitle: string): Promise<void> {
    Logger.info(`Adding product "${productTitle}" to cart`);
    const productCard = this.productCards.filter({ hasText: productTitle });
    const buyButton = productCard.locator(this.buyButtons);
    await buyButton.click();
  }
}
