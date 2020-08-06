let puppeteer = require("puppeteer");
let fs = require("fs");
let path = require("path");

let links = process.argv[2];
let allLinks = fs.readFileSync(links, "utf-8");
let llinks = JSON.parse(allLinks);

let allMsgs = require("./allMsgs.json");
const {
    networkInterfaces
} = require("os");

(async function () {
    let waLink = llinks.whatsappLink;

    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--incognito", "--disable-notifications"],
    });

    let numberOfPages = await browser.pages();
    let tab = numberOfPages[0];

    await tab.goto(waLink, {
        waitUntil: "networkidle2",
    });

    await tab.waitForSelector("._3FRCZ.copyable-text.selectable-text");
    await tab.type("._3FRCZ.copyable-text.selectable-text", "Mom");
    await tab.keyboard.press("Enter");

    let welcomeMsg = allMsgs.firstMsg;
    await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
        visible: true,
    });
    await tab.type("#main div.selectable-text[contenteditable]", welcomeMsg);
    await tab.keyboard.press("Enter");

    await getReply(tab, browser);
})();

async function getReply(tab, browser) {
    let text = await tab.evaluate(() =>
        Array.from(
            document.querySelectorAll(".copyable-text span"),
            (element) => element.textContent
        )
    );
    let reply = text[text.length - 2];
    if (reply.localeCompare("begin") == 0 || reply.localeCompare("Begin") == 0) {
        await start(tab, browser);
    } else {
        setTimeout(getReply(tab, browser), 10000);
    }
}

async function start(tab, browser) {
    let startMsg = allMsgs.begin;

    await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
        visible: true,
    });
    let msg = startMsg.split("\n");
    for (let i = 0; i < msg.length; i++) {
        await tab.type("#main div.selectable-text[contenteditable]", msg[i], {
            delay: 20,
        });

        await tab.keyboard.down("Shift");
        await tab.keyboard.press("Enter");
        await tab.keyboard.up("Shift");
    }
    await tab.keyboard.press("Enter");
    await getNumbericReply(tab, browser);
}

async function getNumbericReply(tab, browser) {
    let text = await tab.evaluate(() =>
        Array.from(
            document.querySelectorAll(".copyable-text span"),
            (element) => element.textContent
        )
    );
    let reply = text[text.length - 2];

    if (reply.localeCompare("1") == 0) {
        await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
            visible: true,
        });
        await tab.type(
            "#main div.selectable-text[contenteditable]",
            "Enter the word"
        );
        await tab.keyboard.press("Enter");

        await delay(10000);

        await getMeaning(tab, browser);

        setTimeout(await start(tab, browser), 3000);
    } else if (reply.localeCompare("2") == 0) {
        await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
            visible: true,
        });
        await tab.type(
            "#main div.selectable-text[contenteditable]",
            "Enter the word"
        );
        await tab.keyboard.press("Enter");

        await delay(10000);

        await getSynonym(tab, browser);

        setTimeout(await start(tab, browser), 3000);
    } else if (reply.localeCompare("3") == 0) {
        await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
            visible: true,
        });
        await tab.type(
            "#main div.selectable-text[contenteditable]",
            "Enter the word"
        );
        await tab.keyboard.press("Enter");

        await delay(10000);

        await getAntonym(tab, browser);

        setTimeout(await start(tab, browser), 3000);
    } else if (reply.localeCompare("4") == 0) {
        await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
            visible: true,
        });
        await tab.type(
            "#main div.selectable-text[contenteditable]",
            "Enter the word"
        );
        await tab.keyboard.press("Enter");

        await delay(10000);

        await getUse(tab, browser);

        setTimeout(await start(tab, browser), 3000);
    } else if (reply.localeCompare("5") == 0) {
        let quit = allMsgs.quit;
        await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
            visible: true,
        });
        await tab.type("#main div.selectable-text[contenteditable]", quit, {
            delay: 100,
        });
        await tab.keyboard.press("Enter");
        await tab.close();
    } else {
        setTimeout(getNumbericReply(tab, browser), 10000);
    }
}

async function getMeaning(tab, browser) {
    let link = llinks.meaningLink;

    let text = await tab.evaluate(() =>
        Array.from(
            document.querySelectorAll(".copyable-text span"),
            (element) => element.textContent
        )
    );
    let reply = text[text.length - 2];

    await delay(1000);

    let newTab = await browser.newPage();
    link = path.join(link, reply);

    await newTab.goto(link, {
        waitUntil: "networkidle2",
    });

    const meaningOfWord = await tab.waitForSelector("span.dtText", {
        visible: true,
    });
    await newTab.close();
    await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
        visible: true,
    });

    await tab.type(
        "#main div.selectable-text[contenteditable]",
        "-" + meaningOfWord, {
            delay: 20,
        }
    );

    await tab.keyboard.down("Shift");
    await tab.keyboard.press("Enter");
    await tab.keyboard.up("Shift");

    await tab.keyboard.press("Enter");
    await delay(1000);
}

async function getSynonym(tab, browser) {
    let link = llinks.meaningLink;

    let text = await tab.evaluate(() =>
        Array.from(
            document.querySelectorAll(".copyable-text span"),
            (element) => element.textContent
        )
    );
    let reply = text[text.length - 2];

    await delay(1000);

    let newTab = await browser.newPage();
    link = path.join(link, reply, '#synonyms');

    await newTab.goto(link, {
        waitUntil: "networkidle2",
    });

    const synonyms = await tab.waitForSelector('.mw-list li', {
        visible: true,
    });

    await newTab.close();
    await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
        visible: true,
    });

    await tab.type(
        "#main div.selectable-text[contenteditable]",
        synonyms, {
            delay: 20,
        }
    );

    await tab.keyboard.down("Shift");
    await tab.keyboard.press("Enter");
    await tab.keyboard.up("Shift");

    await tab.keyboard.press("Enter");
    await delay(1000);
}

async function getAntonym(tab, browser) {
    let link = llinks.antonymsLink;

    let text = await tab.evaluate(() =>
        Array.from(
            document.querySelectorAll(".copyable-text span"),
            (element) => element.textContent
        )
    );
    let reply = text[text.length - 2];

    await delay(1000);

    let newTab = await browser.newPage();
    link = path.join(link, reply);

    await newTab.goto(link, {
        waitUntil: "networkidle2",
    });

    const antonyms = await tab.waitForSelector('.css-17d6qyx-WordGridLayoutBox.et6tpn80 li', {
        visible: true,
    });

    await newTab.close();
    await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
        visible: true,
    });

    await tab.type(
        "#main div.selectable-text[contenteditable]",
        antonyms, {
            delay: 20,
        }
    );
}

async function getUse(tab, browser) {
    let link = llinks.sentenceLink;

    let text = await tab.evaluate(() =>
        Array.from(
            document.querySelectorAll(".copyable-text span"),
            (element) => element.textContent
        )
    );
    let reply = text[text.length - 2];

    await delay(1000);

    let newTab = await browser.newPage();
    link = path.join(link, reply);

    await newTab.goto(link, {
        waitUntil: "networkidle2",
    });

    const use = await tab.waitForSelector('.sentence - list li p ', {
        visible: true,
    });

    await newTab.close();
    await tab.waitForSelector("#main div.selectable-text[contenteditable]", {
        visible: true,
    });

    await tab.type(
        "#main div.selectable-text[contenteditable]",
        use, {
            delay: 20,
        }
    );
}

async function navigationHelper(tab, selector) {
    await Promise.all([
        tab.waitForNavigation({
            waitUntil: "networkidle2",
        }),
        tab.click(selector),
    ]);
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
