import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    // await page.goto("http://uitestingplayground.com/ajax");
    await page.goto(process.env.TESTING_URL);
    await page.getByText("Button Triggering AJAX Request").click();
});

test.skip("Auto waiting", async ({page}) => {
    const successButton = page.locator("bg-success");

    // await successButton.click();

    // const text = await successButton.textContent();
    // await successButton.waitFor({state: "attached"});
    // const text = await successButton.allTextContents();

    // expect(text).toContain("Data loaded with AJAX request.");

    await expect(successButton).toHaveText("Data loaded with AJAX request.", {
        timeout: 16000
    });

    // Alternative
    await page.waitForSelector("bg-success");
});