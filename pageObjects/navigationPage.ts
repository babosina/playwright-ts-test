import {Page} from "@playwright/test";
import {BasePage} from "./basePage";

export class NavigationPage extends BasePage {

    // readonly page: Page;

    constructor(page: Page) {
        super(page);
        // this.page = page;
    }

    async formLayoutsPage() {
        // await this.page.getByText("Forms").click();
        await this.selectGroupMenuItem("Forms");
        await this.page.getByText("Form Layouts").click();
        await this.waitForNumberOfSeconds(5);
    }

    async datepickerPage() {
        // await this.page.getByText("Forms").click();
        await this.selectGroupMenuItem("Forms");
        await this.page.waitForTimeout(1000);
        await this.page.getByText("Datepicker").click();
    }

    async tooltipPage() {
        // await this.page.getByText("Modal & Overlays").click();
        await this.selectGroupMenuItem("Modal & Overlays");
        await this.page.getByText("Tooltip").click();
    }

    async toasterPage() {
        // await this.page.getByText("Modal & Overlays").click();
        await this.selectGroupMenuItem("Modal & Overlays");
        await this.page.getByText("Toastr").click();
    }

    async smartTablePage() {
        // await this.page.getByTitle("Tables & Data").click();
        await this.selectGroupMenuItem("Tables & Data");
        await this.page.getByText("Smart Table").click();
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle);
        const expanded = await groupMenuItem.getAttribute("aria-expanded");
        if (expanded === "false") {
            await groupMenuItem.click();
        }
    }
}