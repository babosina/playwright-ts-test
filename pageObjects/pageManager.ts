import {Page} from "playwright";
import {NavigationPage} from "./navigationPage";
import {FormLayoutsPage} from "./formLayoutsPage";
import {DatePickerPage} from "./datePickerPage";

export class PageManager {

    readonly page: Page;
    private readonly navigationPage: NavigationPage;
    private readonly formLayoutsPage: FormLayoutsPage;
    private readonly datePickerPage: DatePickerPage;


    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(page);
        this.formLayoutsPage = new FormLayoutsPage(page);
        this.datePickerPage = new DatePickerPage(page);
    }

    navigationPageObject() {
        return this.navigationPage;
    }

    formLayoutsPageObject() {
        return this.formLayoutsPage;
    }

    datePickerPageObject() {
        return this.datePickerPage;
    }
}