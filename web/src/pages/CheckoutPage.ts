import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#firstNameInput');
    this.lastNameInput = page.locator('#lastNameInput');
    this.addressInput = page.locator('#addressLine1Input');
    this.stateInput = page.locator('#provinceInput');
    this.postalCodeInput = page.locator('#postCodeInput');
    this.submitButton = page.locator('#checkout-shipping-continue');
  }

  async fillShippingDetails(details: CustomerDetails): Promise<void> {
    Logger.info(`Filling shipping details for: ${details.firstName} ${details.lastName}`);
    await this.fill(this.firstNameInput, details.firstName, 'First Name');
    await this.fill(this.lastNameInput, details.lastName, 'Last Name');
    await this.fill(this.addressInput, details.address, 'Address');
    await this.fill(this.stateInput, details.state, 'State/Province');
    await this.fill(this.postalCodeInput, details.postalCode, 'Postal Code');
  }

  async submitOrder(): Promise<void> {
    Logger.info('Submitting order shipping form');
    await this.click(this.submitButton, 'Submit Order Button');
  }

  async completeCheckout(details: CustomerDetails): Promise<void> {
    await this.fillShippingDetails(details);
    await this.submitOrder();
  }
}
