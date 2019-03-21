// @ts-check

const git = require('git-rev-sync');

module.exports = {
  'external-modulemap': '.*packages/([^/]+)/src/.*',
  'sourcefile-url-prefix': `https://github.com/clebert/rcgen/tree/${git.short()}/packages/`,
  exclude: ['**/*+(__tests__|lib|node_modules)/**/*'],
  excludeExternals: false,
  excludeNotExported: true,
  excludePrivate: true,
  gitRevision: 'master',
  ignoreCompilerErrors: false,
  mode: 'modules',
  name: '@rcgen',
  out: 'docs',
  readme: 'README.md',
  theme: 'minimal',
  tsconfig: 'tsconfig.json'
};
