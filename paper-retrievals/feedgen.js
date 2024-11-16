const Feed = require("feed").Feed;
const fs = require("fs");

let data = fs.readFileSync("./calls.json", "utf8");
let issues = JSON.parse(data);
issues = issues.filter(
  (issue) => issue.active || (!issue.active && Date.now() < issue.gracePeriod)
);
const rssFeed = new Feed({
  title: "CFP Hub",
  description:
    "CFP Hub shows you the latest calls for papers in your discipline.",
  id: "cfpHub",
  link: "http://localhost:3000/",
  language: "en",
  image: "http://localhost:3000/",
  date: new Date(),

  author: {
    name: "Kapadia Naitik",
  },
});
issues.forEach((issue) => {
  rssFeed.addItem({
    title: issue.title,
    id: issue.slug,
    link: issue.url,
    date: new Date(issue.pubDate),
    author: [
      {
        name: issue.abbreviation.toUpperCase(),
        email: issue.journal,
      },
    ],
  });
});
try {
  fs.writeFileSync("./rss.xml", rssFeed.rss2());
} catch (err) {
  console.log(err);
}
