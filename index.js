const pup = require('puppeteer');
const fs = require('fs');

let browser, page;

async function openGoogleLens() {
    console.log("Opening Google Lens");
    browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
    });
    page = await browser.newPage();
    await page.goto('https://google.com/');
}

async function searchUrl(url) {
    console.log("searching url");
    await page.click('div[jscontroller="lpsUAf"][jsname="R5mgy"]'); // google lense button 
    await page.type('input[jsname="W7hAGe"][class="cB9M7"]', url); // Paste image link field
    await page.click('div[jsname="ZtOxCb"][class="Qwbd3"]'); // search button
}

async function getResults() {
    await new Promise(resolve => setTimeout(resolve, 15000));
    const cards = await page.evaluate(() => {
        const cardList = document.querySelectorAll(".G19kAf ");
        return Array.from(cardList).map((card) => {
            const title = card.querySelector(".UAiK1e").innerText;
            const storeName = card.querySelector(".OwskJc").innerText;
            const productImageUrl = card.querySelector("img.wETe9b.jFVN1").getAttribute('src');
            const productLink = card.querySelector("a.lXbkTc").getAttribute('href');
            // const price = card.querySelector(".oOZ3vf.DdKZJb").innerText;
            return { title, storeName, productImageUrl, productLink };
        });
    });
    console.log(cards);
    return cards; // Return the results
}

async function closeBrowser() {
    console.log("closing Browser");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await browser.close();
}

async function run() {
    await openGoogleLens();
    await searchUrl('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ2I-32bc1Ua0bz-TbGOMTE4L_zHX-3oLsdJHEREJQ6tHuzuD6V');
    const results = await getResults();

    fs.writeFile('output.json', JSON.stringify(results, null, 2), function (err) {
        if (err) throw err;
        console.log('File saved.');
    });

    await closeBrowser();
}

run();
