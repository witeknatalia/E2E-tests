import Page from './page.js';

class InventoryPage extends Page {
  get inventoryList() {
    return $("div[data-test='inventory-list']");
  }
  get inventoryItems() {
    return $$("div[data-test='inventory-item']");
  }
  get shoppingCartBadge() {
    return $('span[data-test="shopping-cart-badge"]');
  }
  get checkout() {
    return $('button[data-test="checkout"]');
  }
  get firstNameInput() {
    return $('input[data-test="firstName"]');
  }
  get lastNameInput() {
    return $('input[data-test="lastName"]');
  }
  get postalCodeInput() {
    return $('input[data-test="postalCode"]');
  }
  get continue() {
    return $('input[data-test="continue"]');
  }
  get totalPrice() {
    return $('div[data-test="subtotal-label"]');
  }
  itemDescription(item: ChainablePromiseElement) {
    return item.$('div[data-test="inventory-item-description"]');
  }
  itemPrice(item: ChainablePromiseElement) {
    return item.$('div[data-test="inventory-item-price"]');
  }
  addToCartButton(item: ChainablePromiseElement) {
    return item.$('button');
  }

  async addToCart(item: ChainablePromiseElement, quantity: string) {
    await this.addToCartButton(item).click();

    const shoppingCartItems = await this.shoppingCartBadge.getText();
    await expect(shoppingCartItems).toEqual(quantity);
  }

  async getItemPrice(index: number) {
    const item = await this.itemPrice(this.inventoryItems[index]);
    return await item.getText();
  }

  async addItemToCart(index: number, quantity: string) {
    return await this.addToCart(this.inventoryItems[index], quantity);
  }

  async goToPaymentSummary() {
    await this.shoppingCartBadge.click();
    await this.checkout.click();
    await this.firstNameInput.setValue('John');
    await this.lastNameInput.setValue('Doe');
    await this.postalCodeInput.setValue('12345');
    await this.continue.click();
  }
}

export default new InventoryPage();
