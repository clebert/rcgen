// @ts-check

const {composeManifest} = require('@rcgen/core');
const {gitInit} = require('@rcgen/managers');

/**
 * @type {import('@rcgen/managers').Project}
 */
const project = {
  managedGeneratedFiles: [{filename: '.gitignore', versioned: true}],
  unmanagedGeneratedFiles: [
    {pattern: '**/*.tsbuildinfo'},
    {pattern: '**/coverage'},
    {pattern: '**/docs'},
    {pattern: '**/lib'},
    {pattern: '**/node_modules'}
  ],
  nonGeneratedUnversionedFiles: [{pattern: '**/todo.tasks'}]
};

exports.default = composeManifest(gitInit(project))();
