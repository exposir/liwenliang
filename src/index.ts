const fs = require("fs");
const readline = require("readline");

const stream = fs.createReadStream("largefile.json");
const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity,
});

let dataArray = [];

rl.on("line", (line) => {
  const data = JSON.parse(line);
  dataArray.push(data);
});

rl.on("close", () => {
  console.log(dataArray);
});
