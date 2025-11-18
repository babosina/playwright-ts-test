import {expect} from "@playwright/test";
import {test} from "../test-options";

test("draganddrop", async ({page, globalsQaURL}) => {
    await page.goto(globalsQaURL);

    const frame = page.frameLocator("[rel-title='Photo Manager'] iframe");
    const trash = frame.locator("#trash");
    await frame.locator("li", {hasText: "High Tatras 2"}).dragTo(trash);

    // More precise control
    await frame.locator("li", {hasText: "High Tatras 4"}).hover();
    await page.mouse.down();
    await frame.locator("#trash").hover();
    await page.mouse.up();
    await page.waitForTimeout(1000);

    await expect(frame.locator("#trash li h5")).toHaveText(["High Tatras 2", "High Tatras 4"]);
});