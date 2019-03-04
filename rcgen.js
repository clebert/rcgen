// @ts-check

const {createJsonFiletype, createLinesFiletype} = require('@rcgen/filetypes');

/**
 * @type {import('@rcgen/core').Manifest}
 */
exports.default = {
  files: [
    {
      filename: '.vscode/settings.json',
      filetype: createJsonFiletype(),
      initialContent: {'editor.formatOnSave': true}
    },
    {
      filename: '.node-version',
      filetype: createLinesFiletype(),
      initialContent: ['10']
    }
  ]
};
