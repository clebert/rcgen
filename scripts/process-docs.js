// @ts-check

const cheerio = require('cheerio');
const glob = require('fast-glob');
const fs = require('fs');
const path = require('path');

const filenames = glob
  .sync(path.join(__dirname, '../docs/@rcgen/**/*.html'))
  .map(String);

for (const filename of filenames) {
  console.log(filename);

  const html = fs.readFileSync(filename, {encoding: 'utf8'});
  const $ = cheerio.load(html);

  $('aside.tsd-sources').remove();

  fs.writeFileSync(filename, $.html(), {encoding: 'utf8'});
}
