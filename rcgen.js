// @ts-check

const {createLinesFiletype} = require('@rcgen/filetypes');

/**
 * @type {import('@rcgen/core').Manifest}
 */
exports.default = {
  files: [
    {
      filename: '.node-version',
      filetype: createLinesFiletype(),
      initialContent: ['10']
    }
  ]
};
