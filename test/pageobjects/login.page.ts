import { $ } from "@wdio/globals";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  /**
   * define selectors using getter methods
   */
  public get inputUsername() {
    return $("#user-name");
  }

  public get inputPassword() {
    return $("#password");
  }

  public get buttonSubmit() {
    return $("#login-button");
  }

  public get menu() {
    return $("#react-burger-menu-btn");
  }

  public get logoutButton() {
    return $("#logout_sidebar_link");
  }
  public get errorMessage() {
    return $(".error-message-container.error");
  }
  public get inventoryContainer() {
    return $("#inventory_container");
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async login(username: string, password: string) {
    await this.inputUsername.setValue(username);
    await this.inputPassword.setValue(password);
    await this.buttonSubmit.click();
  }

  public async logout() {
    await this.menu.click();
    await this.logoutButton.click();
  }
}

export default new LoginPage();
