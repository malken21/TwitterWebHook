const https = require("https");
module.exports = { getDatas: getDatas }

const { bearer_token } = require("./Config.json");

const Twitter_TOKEN = {
    headers: {
        "Authorization": `Bearer ${bearer_token}`
    }
};

function getDatas(id) {
    let data = [];
    return new Promise((resolve) => {
        https.get(`https://api.twitter.com/2/tweets/${id}?tweet.fields=attachments,entities&expansions=attachments.media_keys,author_id&media.fields=variants,url&user.fields=profile_image_url`, Twitter_TOKEN, (res) => {
            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                resolve(JSON.parse(Buffer.concat(data)));
            });
        });
    });
};