const scraperObject = {
  url: "https://journals.sagepub.com/page/jin/call-for-papers",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}`);
    await page.goto(this.url);

    return await page.$$eval("div.pb-rich-text p a", (items) =>
      items.map((item) => {
        return {
          title: item.textContent,
          url: item.href,
          dueDate: Date.parse(
            item.parentElement.textContent
              .slice(item.parentElement.textContent.lastIndexOf(":") + 1, -1)
              .trim()
              .replace(/([0-9])(st |nd |rd |th )/gi, "$1 ")
          ),
          journal: "Journal of Information Technology",
          abbreviation: "jit",
        };
      })
    );
  },
};

module.exports = scraperObject;
