import {expect, test} from "@playwright/test";
// @ts-ignore
import tags from "../test-data/tags.json";
import {addAbortSignal} from "node:stream";


test.beforeEach(async ({page}) => {
    await page.route("*/**/api/tags", async route => {
        // const tags = {
        //     "tags": [
        //         "ai",
        //         "api",
        //         "playwright"
        //     ]
        // };
        await route.fulfill({
            body: JSON.stringify(tags)
        });
    });

    await page.goto("https://conduit.bondaracademy.com/");
    // await page.getByText(" Sign in ").click();
    // await page.getByRole("textbox", {name: "Email"}).fill("pythonqa5@gmail.com");
    // await page.getByRole("textbox", {name: "Password"}).fill("@$4ca*aGV$");
    // await page.getByRole("button", {name: "Sign in"}).click();
});

test("has title", async ({page}) => {
    await page.route("*/**/api/articles*", async route => {
        const response = await route.fetch();
        const body = await response.json();
        body.articles[0].title = "Learning MOCK with Python";
        body.articles[0].description = "LALALALALALALLALALALA";

        await route.fulfill({
            body: JSON.stringify(body)
        });
    });

    await page.getByText(" Global Feed ").click();
    await expect(page.locator(".navbar-brand")).toHaveText("conduit");
    await expect(page.locator(".preview-link h1").first()).toContainText("Learning MOCK with Python");
});

test("delete article", async ({page, request}) => {
    // const response = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
    //     data: {
    //         "user": {"email": "pythonqa5@gmail.com", "password": "@$4ca*aGV$"}
    //     }
    // });
    // const responseBody = await response.json();
    // const authToken = responseBody.user.token;

    const articleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles", {
        data: {
            "article": {
                "title": "Learning MOCK with Python",
                "description": "LALALALALALALLALALALA",
                "body": "LALALALALALALLALALALA",
            }
        },
        // headers: {
        //     "Authorization": `Token ${process.env.AUTH_TOKEN}`
        // }
    });
    expect(articleResponse.status()).toEqual(201);

    await page.getByText(" Global Feed ").click();
    await page.getByText("Learning MOCK with Python").click();
    await page.getByText(" Delete Article ").first().click();
    await page.getByText(" Global Feed ").click();
    await expect(page.locator(".preview-link h1").first()).toContainText("Testing APIs with Postman");
});

test("crud article", async ({page, request}) => {
    await page.locator(".ion-compose").click();
    await page.getByRole("textbox", {name: "Article Title"}).fill("Learning MOCK with Python");
    await page.getByRole("textbox", {name: "What's this article about?"}).fill("LALALALALALALLALALALA");
    await page.getByRole("textbox", {name: "Write your article (in markdown)"}).fill("LALALALALALALLALALALA");
    await page.getByRole("button", {name: " Publish Article "}).click();

    const response = await page.waitForResponse("https://conduit-api.bondaracademy.com/api/articles/");
    const responseBody = await response.json();
    const slugId = responseBody.article.slug;

    await expect(page.locator(".banner h1")).toHaveText("Learning MOCK with Python");
    await page.getByText(" Home ").click();
    await page.getByText(" Global Feed ").click();
    await expect(page.locator(".preview-link h1").first()).toContainText("Learning MOCK with Python");

    // const responseToken = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
    //     data: {
    //         "user": {"email": "pythonqa5@gmail.com", "password": "@$4ca*aGV$"}
    //     }
    // });
    // const responseTokenBody = await responseToken.json();
    // const authToken = responseTokenBody.user.token;

    const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
        // headers: {
        //     "Authorization": `Token ${process.env.AUTH_TOKEN}`
        // }
    });

    expect(deleteResponse.status()).toEqual(204);
    await page.getByText(" Global Feed ").click();
    await expect(page.locator(".preview-link h1").first()).toContainText("Testing APIs with Postman");
});