import {Page} from "@playwright/test";
import {BasePage} from "./basePage";

export class FormLayoutsPage extends BasePage{

    // readonly page: Page;

    constructor(page: Page) {
        super(page);
        // this.page = page;
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, option: string) {
        const gridForm = this.page.locator("nb-card", {hasText: "Using the Grid"});
        await gridForm.getByRole("textbox", {name: "Email"}).fill(email);
        await gridForm.getByRole("textbox", {name: "Password"}).fill(password);
        await gridForm.getByRole("radio", {name: option}).check({force: true});
        await gridForm.getByRole("button").click();
    }

    /**
     * Submit an inline form with credentials and remember me
     * @param name - should be first and last name
     * @param email - should be a valid email
     * @param rememberMe - should be true or false
     */
    async submitInlineFormWithCredentialsAndRememberMe(name: string, email: string, rememberMe: boolean) {
        const inlineForm = this.page.locator("nb-card", {hasText: "Inline form"});
        await inlineForm.getByPlaceholder("Jane Doe").fill(name);
        await inlineForm.getByRole("textbox", {name: "Email"}).fill(email);
        if (rememberMe) {
            await inlineForm.getByRole("checkbox").check({force: true});
        }
        await inlineForm.getByRole("button").click();
    }
}