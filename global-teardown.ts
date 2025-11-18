import {expect, request} from "@playwright/test";

async function globalTeardown() {
    const context = await request.newContext();

    const deleteResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUG_ID}`, {
        headers: {
            "Authorization": `Token ${process.env.AUTH_TOKEN}`
        }
    });
    expect(deleteResponse.status()).toEqual(204);
}

export default globalTeardown;
