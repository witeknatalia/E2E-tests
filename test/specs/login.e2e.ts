import { expect } from "@wdio/globals";
import LoginPage from "../pageobjects/login.page.js";
import "dotenv/config";

describe("Login test", () => {
  it("should login as a standard user", async () => {
    await LoginPage.open();
    if (!process.env.USER_LOGIN || !process.env.USER_PASSWORD) {
      throw new Error(
        "USER_LOGIN or USER_PASSWORD environment variables are not set",
      );
    }
    await LoginPage.login(process.env.USER_LOGIN, process.env.USER_PASSWORD);
    const isButtonDisplayed = await LoginPage.buttonSubmit.waitForDisplayed({
      reverse: true,
    });
    await expect(isButtonDisplayed).toBe(true);
  });
});
