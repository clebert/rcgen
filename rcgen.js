// @ts-check

const {composeManifest} = require('@rcgen/core');
const {gitInit, nodeInit} = require('@rcgen/managers');

/**
 * @type {import('@rcgen/managers').Project}
 */
const project = {
  nodeVersion: '10',
  managedGeneratedFiles: [
    {filename: '.gitignore', versioned: true},
    {filename: '.node-version'},
    {filename: '.nvmrc'}
  ],
  unmanagedGeneratedFiles: [
    {pattern: '**/*.tsbuildinfo'},
    {pattern: '**/coverage'},
    {pattern: '**/docs'},
    {pattern: '**/lib'},
    {pattern: '**/node_modules'}
  ],
  nonGeneratedUnversionedFiles: [{pattern: '**/todo.tasks'}]
};

exports.default = composeManifest(gitInit(project), nodeInit(project))();
