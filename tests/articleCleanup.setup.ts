import {expect, test as setup, request} from '@playwright/test';

setup("delete article", async ({request}) => {
    const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUG_ID}`);
    expect(deleteResponse.status()).toEqual(204);
});