const core = require("@actions/core");
const getHeadlines = require("./utils/getHeadlines");
const fs = require("fs");
const takeHeadlines = 30;

// run every day at 00:01 UTC
const run = async (date) => {
  const isoDate = new Date(date).toISOString().slice(0, 10);
  const path = `content/posts/${isoDate}.md`;
  if (fs.existsSync(path)) {
    core.warning(`Today's file (${path}) already exists. Exiting.`);
    return;
  }

  const contents = await getHeadlines(date, takeHeadlines);
  if (!contents) {
    core.warning("no content - skip issue creation");
    return;
  }

  fs.writeFileSync(
    path,
    `---
title: "Hacker News top ${takeHeadlines} - ${isoDate}"
date: ${new Date().toISOString()}
---

${contents}
  `
  );
};

run(new Date()).catch((err) => {
  throw err;
});
