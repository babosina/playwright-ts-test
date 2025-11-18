import {test as base} from "@playwright/test";
import {PageManager} from "./pageObjects/pageManager";


export type TestOptions = {
    globalsQaURL: string
    formLayoutPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsQaURL: ["", {option: true}],

    // formLayoutPage: [async ({page}, use) => {
    //     await page.goto("/");
    //     await page.getByText("Forms").click();
    //     await page.getByText("Form Layouts").click();
    //     await use("");
    // }
    //     , {auto: true} // to use automatically
    // ],

    formLayoutPage: async ({page}, use) => {
        await page.goto("/");
        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();
        // all before use is a setup
        await use("");
        // all after user is a teardown
        console.log("TEARDOWN");
    },

    pageManager: async ({page, formLayoutPage}, use) => {
        const pm = new PageManager(page);
        await use(pm);
    }
});