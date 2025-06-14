import { expect } from "@wdio/globals";
import LoginPage from "../pageobjects/login.page.js";
import "dotenv/config";

describe("Login test", () => {
  let password: string;
  let login: string;

  before(async function () {
    await LoginPage.open();

    if (!process.env.USER_PASSWORD) {
      throw new Error("USER_PASSWORD environment variables are not set");
    }

    password = process.env.USER_PASSWORD;
  });

  it("should login as a standard user", async () => {
    if (!process.env.USER_STANDARD_LOGIN) {
      throw new Error("USER_LOGIN environment variable is not set");
    }
    login = process.env.USER_STANDARD_LOGIN;
    await LoginPage.login(login, password);

    const isButtonDisplayed = await LoginPage.buttonSubmit.waitForDisplayed({
      reverse: true,
    });

    const isContainerDisplayed =
      await LoginPage.inventoryContainer.waitForDisplayed();

    await expect(isButtonDisplayed).toBe(true);
    await expect(isContainerDisplayed).toBe(true);
    LoginPage.logout();

    await expect(isButtonDisplayed).toBe(true);
  });

  it("should try login as a locked out user", async () => {
    if (!process.env.USER_LOCKED_LOGIN) {
      throw new Error("USER_LOCKED_LOGIN environment variable is not set");
    }

    login = process.env.USER_LOCKED_LOGIN;
    await LoginPage.login(login, password);
    const errorMessage = await LoginPage.errorMessage.waitForDisplayed();
    await expect(errorMessage).toBe(true);
  });

  it("should try login as a performance glitched user", async () => {
    if (!process.env.USER_GLITCH_LOGIN) {
      throw new Error("USER_GLITCH_LOGIN environment variable is not set");
    }

    login = process.env.USER_GLITCH_LOGIN;
    await LoginPage.login(login, password);

    const isButtonDisplayed = await LoginPage.buttonSubmit.waitForDisplayed({
      timeout: 30000,
      reverse: true,
    });

    await expect(isButtonDisplayed).toBe(true);
  });
});
