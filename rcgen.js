// @ts-check

const {createTextFiletype} = require('@rcgen/filetypes');

/**
 * @type {import('@rcgen/core').Manifest}
 */
exports.default = {
  files: [
    {
      filename: '.node-version',
      filetype: createTextFiletype({insertFinalNewline: true}),
      initialContent: ['10']
    }
  ]
};
