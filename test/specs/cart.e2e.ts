import LoginPage from '../pageobjects/login.page.js';
import inventoryPage from '../pageobjects/inventory.page.js';

describe('Test concerning the performance of various actions related to the shopping -cart', () => {
  before(async function () {
    const login = process.env.USER_STANDARD_LOGIN;
    const password = process.env.USER_PASSWORD;

    if (!login || !password) {
      throw new Error('Required environment variables are not set');
    }

    await LoginPage.open();
    await LoginPage.login(login, password);
  });

  it('Adding products to basket', async () => {
    await expect(inventoryPage.inventoryList).toBeDisplayed();

    const getCleanPrice = (text: string) => parseFloat(text.replace(/[^\d.]/g, ''));

    const prices = await Promise.all(
      [0, 1].map(async (index) => {
        const price = await inventoryPage.getItemPrice(index);
        return getCleanPrice(price);
      }),
    );

    const expectedTotal = prices.reduce((sum, price) => sum + price, 0);

    await inventoryPage.addItemToCart(0, '1');
    await inventoryPage.addItemToCart(1, '2');
    await inventoryPage.goToPaymentSummary();

    const cartTotalText = await inventoryPage.totalPrice.getText();
    await expect(getCleanPrice(cartTotalText)).toEqual(expectedTotal);
  });
});
