import fs from "fs";
const callsData = fs.readFileSync("./calls.json", "utf8");
const papersArray = JSON.parse(callsData);

export const papers = papersArray;
