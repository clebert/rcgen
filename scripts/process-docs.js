// @ts-check

const glob = require('fast-glob');
const path = require('path');
const updateHtmlFile = require('./update-html-file');

const docsDirname = path.join(__dirname, '../docs');

// Rename "External Modules" to "Packages" on the index page.

updateHtmlFile(path.join(docsDirname, 'index.html'), $ => {
  $('.tsd-index-section h3').text('Packages');
});

// Remove "Defined in ..." elements for all sources in node_modules.

const filenames = glob.sync(path.join(docsDirname, '**/*.html')).map(String);

for (const filename of filenames) {
  console.info(` Processing  ${filename}`);

  updateHtmlFile(filename, $ => {
    $('.tsd-sources')
      .filter((_index, element) => /node_modules/.test($(element).text()))
      .remove();
  });
}
