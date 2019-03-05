// @ts-check

const {
  createJsonFiletype,
  createLinesFiletype,
  createNodeModuleFiletype
} = require('@rcgen/filetypes');
const {merge, replace} = require('@rcgen/patchers');

/**
 * @type {import('@rcgen/core').Manifest}
 */
exports.default = {
  files: [
    {
      filename: '.vscode/settings.json',
      filetype: createJsonFiletype(),
      initialContent: {}
    },
    {
      filename: '.node-version',
      filetype: createLinesFiletype(),
      initialContent: []
    },
    {
      filename: 'husky.config.js',
      filetype: createNodeModuleFiletype(),
      initialContent: {hooks: {}}
    }
  ],
  patchers: [
    merge('.vscode/settings.json', {'editor.formatOnSave': true}),
    replace('.node-version', ['10']),
    merge('husky.config.js', {hooks: {'commit-msg': 'yarn commitlint --edit'}})
  ]
};
