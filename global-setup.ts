// @ts-ignore
import fs from "fs";
import {request, expect} from "@playwright/test";
// @ts-ignore
import user from "../PlaywrightUI_udemy/auth/user.json";


async function globalSetup() {

    const context = await request.newContext();
    const authFile = "./auth/user.json";


    const responseToken = await context.post("https://conduit-api.bondaracademy.com/api/users/login", {
        data: {
            "user": {"email": "pythonqa5@gmail.com", "password": "@$4ca*aGV$"}
        }
    });
    const responseTokenBody = await responseToken.json();
    const authToken = responseTokenBody.user.token;

    user.origins[0].localStorage[0].value = authToken;
    fs.writeFileSync(authFile, JSON.stringify(user));

    process.env.AUTH_TOKEN = authToken;

    const articleResponse = await context.post("https://conduit-api.bondaracademy.com/api/articles", {
        data: {
            "article": {
                "title": "GLOBAL Likes Test Article",
                "description": "Likes",
                "body": "Likes",
            }
        },
        headers: {
            "Authorization": `Token ${process.env.AUTH_TOKEN}`
        }
    });
    expect(articleResponse.status()).toEqual(201);
    const response = await articleResponse.json();
    const slugID = response.article.slug;
    process.env.SLUG_ID = slugID;
}

export default globalSetup;
