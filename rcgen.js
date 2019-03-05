// @ts-check

const {
  createJsonFiletype,
  createLinesFiletype,
  createNodeModuleFiletype
} = require('@rcgen/filetypes');

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
    },
    {
      filename: 'husky.config.js',
      filetype: createNodeModuleFiletype(),
      initialContent: {hooks: {'commit-msg': 'yarn commitlint --edit'}}
    }
  ]
};
