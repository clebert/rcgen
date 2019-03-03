// @ts-check

/**
 * @type {import('@rcgen/core').Filetype<string[]>}
 */
const textFiletype = {
  contentSchema: {type: 'array', items: {type: 'string'}},
  serializer: content => Buffer.from(content.join('\n')),
  deserializer: contentData => contentData.toString().split('\n')
};

/**
 * @type {import('@rcgen/core').Manifest}
 */
exports.default = {
  files: [
    {
      filename: '.node-version',
      filetype: textFiletype,
      initialContent: ['10', '']
    }
  ]
};
