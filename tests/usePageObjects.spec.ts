import {test, expect} from '@playwright/test';
// import {NavigationPage} from "../pageObjects/navigationPage";
// import {FormLayoutsPage} from "../pageObjects/formLayoutsPage";
// import {DatePickerPage} from "../pageObjects/datePickerPage";
import {PageManager} from "../pageObjects/pageManager";
import {faker} from "@faker-js/faker";

test.beforeEach(async ({page}) => {
    await page.goto("/");
});

test("navigate to form page @smoke @regression", async ({page}) => {
    // const navigationTo = new NavigationPage(page);
    const navigationTo = new PageManager(page).navigationPageObject();
    await navigationTo.formLayoutsPage();

    await navigationTo.datepickerPage();
    await navigationTo.smartTablePage();
    await navigationTo.toasterPage();
    await navigationTo.tooltipPage();
});

test("fill grid form @smoke", async ({page}) => {
    // const navigationTo = new NavigationPage(page);
    // const formLayoutsPage = new FormLayoutsPage(page);
    const navigationTo = new PageManager(page).navigationPageObject();
    const formLayoutsPage = new PageManager(page).formLayoutsPageObject();

    await navigationTo.formLayoutsPage();
    await formLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption(
        "test@test.com",
        "testtest",
        "Option 2"
    );
    await page.waitForTimeout(1000);

    await formLayoutsPage.submitInlineFormWithCredentialsAndRememberMe(
        "Test Test",
        "test@test.com",
        true
    );
    await page.waitForTimeout(1000);
});

test("datepicker cals", async ({page}) => {
    // const navigationTo = new NavigationPage(page);
    const navigationTo = new PageManager(page).navigationPageObject();
    await navigationTo.datepickerPage();
    // const datePickerPage = new DatePickerPage(page);
    const datePickerPage = new PageManager(page).datePickerPageObject();

    await datePickerPage.selectCommonDatePickerDateFromToday(10);
    await datePickerPage.selectDatePickerWithRangeFromToday(6, 15);
});

test("parametrized", async ({page}) => {
    const pm = new PageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(99)}@test.com`;

    await pm.navigationPageObject().formLayoutsPage();
    await pm.formLayoutsPageObject().submitUsingTheGridFormWithCredentialsAndSelectOption("test@test.com",
        "Welcome 1",
        "Option 2"
    );
    await page.screenshot({path: "screenshots/formLayouts.png"});
    // const buffer = await page.screenshot();
    await pm.formLayoutsPageObject().submitInlineFormWithCredentialsAndRememberMe(randomFullName,
        randomEmail,
        false
    );
    await page.locator("nb-card", {hasText: "Inline form"}).screenshot({path: "screenshots/inlineForm.png"});
    await pm.navigationPageObject().datepickerPage();
    await pm.datePickerPageObject().selectCommonDatePickerDateFromToday(10);
    await pm.datePickerPageObject().selectDatePickerWithRangeFromToday(6, 10);
});