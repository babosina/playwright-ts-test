import {expect, test as setup} from '@playwright/test';

setup("create new article", async ({request}) => {
    const articleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles", {
        data: {
            "article": {
                "title": "Likes Test Article",
                "description": "Likes",
                "body": "Likes",
            }
        },
        // headers: {
        //     "Authorization": `Token ${process.env.AUTH_TOKEN}`
        // }
    });
    expect(articleResponse.status()).toEqual(201);
    const response = await articleResponse.json();
    const slugID = response.article.slug;
    process.env.SLUG_ID = slugID;
});