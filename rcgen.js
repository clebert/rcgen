// @ts-check

const {git, gitIgnore} = require('@rcgen/configs');
const {composeEnhancers} = require('@rcgen/core');

exports.default = composeEnhancers([
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
])({});
