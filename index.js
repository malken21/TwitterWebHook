const { port, cooldown } = require("./Config.json");

const { getDatas } = require("./Twitter");
const { sendText, sendMedia } = require("./discord");

const url = require("url");

const http = require('http');

const list = [];
const urls = [];


const server = http.createServer(async (req, res) => {
    try {
        if (req.method === 'POST') {
            let data = "";

            req.on('data', (chunk) => { data += chunk })
                .on('end', async () => {
                    res.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
                    res.end('{"status":"ok"}');
                    try {

                        const json = JSON.parse(decodeURIComponent(data));
                        const URLdata = url.parse(json.url);
                        const id = URLdata.pathname.split("/status/")[1];


                        if (list.length == 0) {
                            list.push(id);
                            urls.push(json.url);
                            await delay(cooldown);
                            console.log("start")
                            start();
                        } else {
                            list.push(id);
                            urls.push(json.url);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                });
        } else {
            error(res)
        }
    } catch {
        error(res);
    }
})
function error(res) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end('{"status":"error"}');
}
server.listen(port, () => {
    console.log(`start port: ${port}`);
});



async function start() {
    if (list.length == 0) return;
    try {
        const id = list.shift();
        const URL = urls.shift();
        const Twitter = await getDatas(id);

        console.log(JSON.stringify(Twitter));

        if (!Twitter.includes) return;

        let isSend = false;

        for (const media of Twitter.includes.media) {
            if (media.type == "video") {
                for (const variant of media.variants) {
                    if (variant.bit_rate) {

                        await send(variant, URL, isSend)
                        isSend = true;

                        break;
                    }
                }
            } else if (media.type == "photo") {

                await send(media, URL, isSend)
                isSend = true;
            }
        }

    } catch (err) {
        console.log(err);
    }
    await delay(cooldown);
    start();
}


function delay(ms) {//-----待機-----//
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function send(media, URL, isSend) {
    return new Promise(async (resolve) => {
        if (!isSend) {
            // await sendText({ "content": "`" + URL + "`" });
            // await delay(cooldown);
        }
        console.log(media.url)
        await sendMedia(media.url);
        await delay(cooldown);
        resolve(true);
    });
}