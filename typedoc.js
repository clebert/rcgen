// @ts-check

module.exports = {
  mode: 'file',
  ignoreCompilerErrors: false,
  exclude: ['**/*+(__tests__|lib|node_modules)/**/*'],
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
  theme: 'minimal',
  gitRevision: 'master',
  readme: 'README.md'
};
