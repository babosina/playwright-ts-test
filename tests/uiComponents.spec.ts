import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto("/");
});

test.describe("Form layouts @block", () => {
    // npx playwright test --grep "@regression|@block"
    // In case we want to retry this particular set of tests
    // test.describe.configure({retries: 2});

    test.beforeEach(async ({page}) => {
        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();
    });

    test("input fields", async ({page}, testInfo) => {
        if (testInfo.retry) {
            // do something
        }
        const emailInput = page.locator("nb-card", {hasText: "Using the Grid"})
            .getByRole("textbox", {name: "Email"});
        await emailInput.fill("test@test.com");
        await emailInput.clear();

        await emailInput.pressSequentially("toster@test.com", {delay: 100});

        // generic assertion
        const text = await emailInput.inputValue();
        expect(text).toEqual("toster@test.com");

        // user faced assertion
        await expect(emailInput).toHaveValue("toster@test.com");
    });

    test("radio buttons", async ({page}) => {
        const gridForm = page.locator("nb-card", {hasText: "Using the Grid"});

        // await gridForm.getByLabel("Option 1").check({force: true});
        await gridForm.getByRole("radio", {name: "Option 1"}).check({force: true});

        // const radioStatus = await gridForm.getByRole("radio", {name: "Option 1"}).isChecked();
        // expect(radioStatus).toBeTruthy();
        await expect(gridForm.getByRole("radio", {name: "Option 1"})).toBeChecked();

        await gridForm.getByRole("radio", {name: "Option 2"}).check({force: true});
        await expect(gridForm.getByRole("radio", {name: "Option 1"})).not.toBeChecked();
    });
});

test("checkboxes", async ({page}) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Toastr").click();

    await page.getByRole("checkbox", {name: "Hide on click"}).uncheck({force: true});
    await page.getByRole("checkbox", {name: "Prevent arising of duplicate toast"}).check({force: true});

    await expect(page.getByRole("checkbox", {name: "Hide on Click"})).not.toBeChecked();

    const allBoxes = page.getByRole("checkbox");
    for (let box of await allBoxes.all()) {
        await box.check({force: true});
        await expect(box).toBeChecked();
    }
    for (let box of await allBoxes.all()) {
        await box.uncheck({force: true});
        await expect(box).not.toBeChecked();
    }
});

test("lists and dropdowns", async ({page}) => {
    const dropdownMenu = page.locator("ngx-header nb-select");
    await dropdownMenu.click();

    // await page.getByRole('list') // when list has ul tag
    // await page.getByRole('listitem') // when list has li tag

    // const optionList = await page.getByRole('list').locator("nb-option")
    const optionList = page.locator("nb-option-list nb-option");
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);

    await optionList.filter({hasText: "Dark"}).click();
    const header = page.locator("nb-layout-header");
    await expect(header).toHaveCSS("background-color", "rgb(34, 43, 69)");

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };

    await dropdownMenu.click();
    for (let color in colors) {
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS("background-color", colors[color]);
        if (color !== "Corporate") {
            await dropdownMenu.click();
        }
    }
});

test("tooltips", async ({page}) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Tooltip").click();

    const tooltipBox = page.locator("nb-card", {hasText: "Tooltip Placements"});
    await tooltipBox.getByRole("button", {name: "Top"}).hover();

    // page.getByRole("tooltip") // Role tooltip created
    const tooltip = page.locator("nb-tooltip")
    await expect(tooltip).toHaveText("This is a tooltip");
});

test("dialog", async ({page}) => {
    await page.getByTitle("Tables & Data").click();
    await page.getByText("Smart Table").click();

    // Playwright automatically cancels the dialog
    // need to create a listener

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual("Are you sure you want to delete?");
        dialog.accept();
    });

    await page
        .getByRole("table")
        .locator("tr", {hasText: "mdo@gmail.com"})
        .locator(".nb-trash")
        .click();

    await expect(page.getByRole("table").locator("tr").first()).not.toHaveText("mdo@gmail.com");
});

test("tables", async ({page}) => {
    await page.getByTitle("Tables & Data").click();
    await page.getByText("Smart Table").click();

    // get the row by any text in the row
    const targetRow = page.getByRole("row", {name: "twitter@outlook.com"});
    await targetRow.locator(".nb-edit").click();

    await targetRow.locator("input-editor").getByPlaceholder("Age").clear();
    await targetRow.locator("input-editor").getByPlaceholder("Age").fill("34");
    await targetRow.locator(".nb-checkmark").click();

    await expect(targetRow.locator("td", {hasText: "34"})).toBeVisible();

    // get the row based on a specific column
    await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
    const targetRowById = page.getByRole("row", {name: "11"})
        .filter({has: page.locator("td").nth(1).getByText("11")});
    await targetRowById.locator(".nb-edit").click();
    await page.locator("input-editor").getByPlaceholder("E-mail").clear();
    await page.locator("input-editor").getByPlaceholder("E-mail").fill("test@test.com");
    await page.locator(".nb-checkmark").click();

    await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");
});

test("tables_2", async ({page}) => {
    await page.getByTitle("Tables & Data").click();
    await page.getByText("Smart Table").click();

    const ages = ["20", "30", "40", "200"];

    for (let age of ages) {
        await page.locator("input-filter").getByPlaceholder("Age").clear();
        await page.locator("input-filter").getByPlaceholder("Age").fill(age);
        await page.waitForTimeout(500);
        const ageRows = await page.locator("tbody tr").all();

        for (let row of ageRows) {
            const cellValue = await row.locator("td").last().textContent();
            if (age === "200") {
                expect(cellValue).toEqual(" No data found ");
            } else {
                expect(cellValue).toEqual(age);
            }
        }
    }
});

test.skip("datepicker_direct_pick", async ({page}) => {
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();

    const datePicker = page.getByPlaceholder("Form Picker");
    await datePicker.click();

    await page.locator('[class="day-cell ng-star-inserted"]')
        .getByText("1", {exact: true})
        .click();

    await expect(datePicker).toHaveValue("Oct 1, 2025");
});

test("datepicker_date", async ({page}) => {
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();
    const datePicker = page.getByPlaceholder("Form Picker");
    await datePicker.click();

    let date = new Date();
    date.setDate(date.getDate() + 14);
    const expectedDate = date.getDate().toString();
    const expectedMonth = date.toLocaleString('EN-US', {month: 'short'});
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonth} ${expectedDate}, ${expectedYear}`;


    let calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
    const expectedMonthLong = date.toLocaleString('EN-US', {month: 'long'});

    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;

    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator("button.next-month").click();
        calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
    }

    await page.locator('[class="day-cell ng-star-inserted"]')
        .getByText(expectedDate, {exact: true})
        .click();
    await expect(datePicker).toHaveValue(dateToAssert);
});

test("slider", async ({page}) => {
    // Update attribute
    // const slider = page.locator("[tabtitle='Temperature'] circle");
    // await slider.evaluate(node => {
    //     node.setAttribute("cx", "232");
    //     node.setAttribute("cy", "232");
    // });
    // await slider.click();

    // Mouse movement
    const tempBox = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger");
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y);
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.up();
    await expect(tempBox).toContainText(" 30 Celsius");
});