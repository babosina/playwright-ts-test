import {test as setup, request} from '@playwright/test';
// @ts-ignore
import user from "../.auth/user.json";
// @ts-ignore
import fs from 'fs';

const authFile = ".auth/user.json";

setup("authentication", async ({page, request}) => {
    // await page.goto("https://conduit.bondaracademy.com/");
    // await page.getByText(" Sign in ").click();
    // await page.getByRole("textbox", {name: "Email"}).fill("pythonqa5@gmail.com");
    // await page.getByRole("textbox", {name: "Password"}).fill("@$4ca*aGV$");
    // await page.getByRole("button", {name: "Sign in"}).click();
    // await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");
    //
    // await page.context().storageState({path: authFile});

    const responseToken = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
        data: {
            "user": {"email": "pythonqa5@gmail.com", "password": "@$4ca*aGV$"}
        }
    });
    const responseTokenBody = await responseToken.json();
    const authToken = responseTokenBody.user.token;

    user.origins[0].localStorage[0].value = authToken;
    fs.writeFileSync(authFile, JSON.stringify(user));

    process.env.AUTH_TOKEN = authToken;
});