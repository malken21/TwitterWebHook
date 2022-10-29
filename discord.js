const FormData = require('form-data');

const https = require("https");
module.exports = { sendMedia: sendMedia }

const { WebHook } = require("./Config.json");

function sendMedia(obj, media) {
    return new Promise(async (resolve) => {
        const form = new FormData();

        form.append("media", await stream(media.url),
            {
                contentType: media.content_type,
                filename: media.url.split("?")[0]
            });

        form.append('payload_json', JSON.stringify(obj));

        form.submit(WebHook, function (err, res) {
            console.log(res.statusCode);
        });
        resolve(true);
    });
}

function stream(url) {//----------ストリーム----------//
    return new Promise((resolve) => {
        https.get(url, {
            highWaterMark: 53
        }, (res) => {
            resolve(res);
        })
    })
}