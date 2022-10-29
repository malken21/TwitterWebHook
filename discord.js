const FormData = require('form-data');

const https = require("https");
module.exports = { sendMedia: sendMedia, sendText: sendText }

const { WebHook } = require("./Config.json");

function sendMedia(fileURL) {
    return new Promise(async (resolve) => {
        const form = new FormData();
        form.append("media", await stream(fileURL));
        form.submit(WebHook, function (err, res) {
            console.log(res.statusCode);
        });
        resolve(true);
    });
}

function sendText(json) {
    return new Promise((resolve) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "userAgent": "Mozilla/5.0"
            },
        };
        const request = https.request(WebHook, options);
        request.write(JSON.stringify(json));
        request.end();
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