// @ts-check

const {git, gitIgnore} = require('@rcgen/configs');
const {composeManifest} = require('@rcgen/core');

exports.default = composeManifest(
  git(),
  gitIgnore({
    additionalFilenames: [
      'coverage',
      'docs',
      'lib',
      'node_modules',
      'todo.tasks'
    ]
  })
)();
