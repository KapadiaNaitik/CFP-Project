const fs = require("fs");

const scraperObject = {
  url: "https://www.sciencedirect.com/browse/calls-for-papers",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}`);
    await page.goto(this.url);

    try {
      await page.waitForSelector(".publication-list-page");
    } catch (error) {
      console.log(0);
      return [];
    }

    const toReturn = await page.$$eval(".js-publication", (items) =>
      items.map((item) => {
        const title = item
          .querySelector("a.js-publication-title")
          .textContent.trim();
        const url = item.querySelector("a.js-publication-title").href;
        const journalElement = item.querySelector(".publication-text");
        const journal = journalElement
          ? journalElement.textContent.split("•")[0].trim()
          : "ScienceDirect";
        const dueDateElement = item.querySelector(".text-s strong");
        const dueDate = dueDateElement
          ? Date.parse(dueDateElement.textContent)
          : null;

        return {
          title,
          url,
          dueDate,
          journal,
          abbreviation: "sd",
        };
      })
    );
    const jsonData = JSON.stringify(toReturn, null, 2);
    console.log(toReturn.length);
    return toReturn;
  },
};

module.exports = scraperObject;
