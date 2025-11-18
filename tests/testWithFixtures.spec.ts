import {test} from '../test-options';
// import {PageManager} from "../pageObjects/pageManager";
import {faker} from "@faker-js/faker";

// test.beforeEach(async ({page}) => {
//     await page.goto("/");
// });

test("parametrized", async ({pageManager
                                // formLayoutPage - added automatically from the test options
}) => {
    // const pm = new PageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(99)}@test.com`;

    // await pm.navigationPageObject().formLayoutsPage();
    await pageManager.formLayoutsPageObject().submitUsingTheGridFormWithCredentialsAndSelectOption("test@test.com",
        "Welcome 1",
        "Option 2"
    );
    await pageManager.formLayoutsPageObject().submitInlineFormWithCredentialsAndRememberMe(randomFullName,
        randomEmail,
        false
    );
});