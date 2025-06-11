import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import 'dotenv/config'

describe('My Login application', () => {
    it('should login with valid credentials', async () => {


        const username = process.env.USER_LOGIN;
        const password = process.env.USER_PASSWORD;
        if (!username || !password) {
            throw new Error('USER_LOGIN or USER_PASSWORD environment variable is not set');
        }
        await LoginPage.login(username, password);
await expect(LoginPage.buttonSubmit).toBeDisabled();
    })
})

