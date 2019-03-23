// @ts-check

const {
  git,
  gitIgnoreFiles,
  gitIgnoreIntrinsicFiles,
  node,
  npm
} = require('@rcgen/configs');
const {composeManifest} = require('@rcgen/core');

exports.default = composeManifest(
  git(),
  gitIgnoreFiles(
    '*.tsbuildinfo',
    'coverage',
    'docs',
    'lib',
    'node_modules',
    'todo.tasks'
  ),
  gitIgnoreIntrinsicFiles({excludedFilenamePatterns: ['package.json']}),
  node('10'),
  npm()
)();
