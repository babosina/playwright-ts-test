import {test, expect} from "@playwright/test";


test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
});

test("Locator syntax rules", async ({page}) => {
    // By Tag name
    // await page.locator("input", {})

    // By ID
    await page.locator("#inputEmail1").click();

    // By Class name
    // await page.locator(".shape-rectangle");

    // By Attribute
    // await page.locator("[placeholder='Email']");

    // By Full class value
    // await page.locator('[class="input medium-start shape...."]');

    // Combine different selectors
    // await page.locator('input[placeholder="Email"]');

    // By XPath (NOT RECOMMENDED)
    // await page.locator("//*[@id='inputEmail']");
});

test("User-facing locators", async ({page}) => {
    await page.getByRole("textbox", {name: "Email"}).first().click();
    // await page.getByRole("button", {name: "Sign in"}).first().click();

    await page.getByLabel("Email").first().click();
    await page.getByPlaceholder("Jane Doe").first().click();
    await page.getByText("Using the Grid").click();
});

test("Child elements", async ({page}) => {
    // await page.locator("nb-card nb-radio :text-is('Option 1')").click();
    // await page.locator("nb-card")
    //     .locator("nb-radio")
    //     .locator(":text-is('Option 1')")
    //     .click();
    await page.locator("nb-card")
        .getByRole("button", {name: "Sign in"})
        .first()
        .click();
});

test("Parent elements", async ({page}) => {
    // await page.locator("nb-card", {hasText: "Using the Grid"}).getByRole("textbox", {name: "Email"}).click();
    // await page.locator("nb-card", {has: page.locator("#inputEmail1")})
    //     .getByRole("textbox", {name: "Email"})
    //     .click();
    await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole("textbox", {name: "Email"}).click();
});

test("Reusing locators", async ({page}) => {
    const basicForm = page.locator("nb-card").filter({hasText: "Basic form"});
    const emailInput = basicForm.getByRole("textbox", {name: "Email"});

    await emailInput.fill("test@test.com");
    await basicForm.getByRole("textbox", {name: "Password"}).fill("password");
    await basicForm.getByRole("button", {name: "Submit"}).click();

    await expect(emailInput).toHaveValue("test@test.com");
});

test("Extract values", async ({page}) => {
    // Single text value
    const basicForm = page.locator("nb-card").filter({hasText: "Basic form"});
    const buttonText = await basicForm.locator("button").textContent();
    expect(buttonText).toEqual("Submit");

    // All text values
    const allRadioButtonLabels = await page.locator("nb-radio").allTextContents();
    expect(allRadioButtonLabels).toContain("Option 1");

    // Input value
    const emailInput = basicForm.getByRole("textbox", {name: "Email"});
    await emailInput.fill("test@test.com");
    const emailValue = await emailInput.inputValue();
    expect(emailValue).toEqual("test@test.com");

    // Attribute value
    const emailPlaceholder = await emailInput.getAttribute("placeholder");
    expect(emailPlaceholder).toEqual("Email");
});

test("Assertions", async ({page}) => {
    // General assertions
    const value = 5;
    expect(value).toEqual(5);

    const basicFormButton = page.locator("nb-card").filter({hasText: "Basic form"}).locator("button");
    const text = await basicFormButton.textContent();
    expect(text).toEqual("Submit");

    // Locator assertions
    await expect(basicFormButton).toHaveText("Submit");

    // Soft assertion
    await expect.soft(basicFormButton).toHaveText("Submit");
    await basicFormButton.click();
});