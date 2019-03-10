import {TestEnv} from './test-env';

import {Manifest, loadManifest} from '..';

export interface InvalidDefinition {
  readonly manifestModule: unknown;
  readonly validationMessage: string;
}

function defineInvalidManifestModule(
  manifestModule: unknown,
  predicate: string
): InvalidDefinition {
  return {manifestModule, validationMessage: `The manifestModule${predicate}.`};
}

function defineInvalidManifest(
  manifest: unknown,
  predicate: string
): InvalidDefinition {
  return defineInvalidManifestModule(
    {default: manifest},
    `.default${predicate}`
  );
}

function defineInvalidFile(
  file: unknown,
  predicate: string
): InvalidDefinition {
  return defineInvalidManifest({files: [file]}, `.files[0]${predicate}`);
}

function defineInvalidFiletype(
  filetype: unknown,
  predicate: string
): InvalidDefinition {
  return defineInvalidFile(
    {filename: 'a', filetype, initialContent: ['foo']},
    `.filetype${predicate}`
  );
}

describe('loadManifest', () => {
  it('loads the manifest', () => {
    const {mockNodeRequire, file, fileWithDeserializer} = new TestEnv('a');

    const manifests: Manifest[] = [
      {},
      {files: []},
      {files: [file]},
      {files: [{...file, conflictingFilenames: []}]},
      {files: [{...file, conflictingFilenames: ['b']}]},
      {files: [fileWithDeserializer]},
      {patchers: []},
      {patchers: [jest.fn()]},
      {includedFilenamePatterns: []},
      {includedFilenamePatterns: ['*']},
      {excludedFilenamePatterns: []},
      {excludedFilenamePatterns: ['*']},
      {
        files: [],
        patchers: [],
        includedFilenamePatterns: [],
        excludedFilenamePatterns: []
      }
    ];

    for (const manifest of manifests) {
      mockNodeRequire.mockReturnValue({default: manifest});

      expect(loadManifest('/path/to/m', mockNodeRequire)).toEqual({
        ...manifest,
        absoluteManifestFilename: '/path/to/m'
      });
    }
  });

  it('throws if the filename of the manifest is not absolute', () => {
    expect(() => loadManifest('./path/to/m')).toThrowError(
      new Error(
        "Manifest './path/to/m' cannot be loaded because its filename is not absolute."
      )
    );
  });

  it('throws if the module of the manifest could not be required', () => {
    const {mockNodeRequire} = new TestEnv('a');

    mockNodeRequire.mockImplementation(() => {
      throw new Error('NodeRequireError');
    });

    expect(() => loadManifest('/path/to/m', mockNodeRequire)).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because its module could not be required. Details: NodeRequireError"
      )
    );
  });

  it('throws if the module of the manifest does not have a valid default export', () => {
    const {mockNodeRequire, file} = new TestEnv('a');
    const {filetype} = file;

    const invalidDefinitions = [
      defineInvalidManifestModule(123, ' should be object'),
      defineInvalidManifestModule(
        {},
        " should have required property 'default'"
      ),
      defineInvalidManifestModule(
        {default: {}, unknown: 123},
        ' should NOT have additional properties'
      ),
      defineInvalidManifest(123, ' should be object'),
      defineInvalidManifest({files: 123}, '.files should be array'),
      defineInvalidManifest({patchers: 123}, '.patchers should be array'),
      defineInvalidManifest(
        {patchers: [123]},
        '.patchers[0] should be function'
      ),
      defineInvalidManifest(
        {includedFilenamePatterns: 123},
        '.includedFilenamePatterns should be array'
      ),
      defineInvalidManifest(
        {includedFilenamePatterns: [123]},
        '.includedFilenamePatterns[0] should be string'
      ),
      defineInvalidManifest(
        {excludedFilenamePatterns: 123},
        '.excludedFilenamePatterns should be array'
      ),
      defineInvalidManifest(
        {excludedFilenamePatterns: [123]},
        '.excludedFilenamePatterns[0] should be string'
      ),
      defineInvalidManifest(
        {unknown: 123},
        ' should NOT have additional properties'
      ),
      defineInvalidFile(123, ' should be object'),
      defineInvalidFile(
        {filetype, initialContent: ['foo']},
        " should have required property 'filename'"
      ),
      defineInvalidFile(
        {filename: 'a', initialContent: ['foo']},
        " should have required property 'filetype'"
      ),
      defineInvalidFile(
        {filename: 'a', filetype},
        " should have required property 'initialContent'"
      ),
      defineInvalidFile(
        {filename: 123, filetype, initialContent: ['foo']},
        '.filename should be string'
      ),
      defineInvalidFile(
        {...file, conflictingFilenames: 123},
        '.conflictingFilenames should be array'
      ),
      defineInvalidFile(
        {...file, conflictingFilenames: [123]},
        '.conflictingFilenames[0] should be string'
      ),
      defineInvalidFile(
        {...file, unknown: 123},
        ' should NOT have additional properties'
      ),
      defineInvalidFiletype(123, ' should be object'),
      defineInvalidFiletype(
        {serializer: jest.fn()},
        " should have required property 'contentSchema'"
      ),
      defineInvalidFiletype(
        {contentSchema: {}},
        " should have required property 'serializer'"
      ),
      defineInvalidFiletype(
        {contentSchema: 123, serializer: jest.fn()},
        '.contentSchema should be object'
      ),
      defineInvalidFiletype(
        {contentSchema: {}, serializer: 123},
        '.serializer should be function'
      ),
      defineInvalidFiletype(
        {...filetype, deserializer: 123},
        '.deserializer should be function'
      ),
      defineInvalidFiletype(
        {...filetype, unknown: 123},
        ' should NOT have additional properties'
      )
    ];

    for (const {manifestModule, validationMessage} of invalidDefinitions) {
      mockNodeRequire.mockReturnValue(manifestModule);

      expect(() => loadManifest('/path/to/m', mockNodeRequire)).toThrowError(
        new Error(
          `Manifest '/path/to/m' cannot be loaded because its module does not have a valid default export. Details: ${validationMessage}`
        )
      );
    }
  });

  it('throws if at least two of the files in the manifest have the same filename', () => {
    const {mockNodeRequire, file} = new TestEnv('a');

    mockNodeRequire.mockReturnValue({default: {files: [file, file]}});

    expect(() => loadManifest('/path/to/m', mockNodeRequire)).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because at least two of its files have the same filename 'a'."
      )
    );
  });

  it('throws if the filename of a file in the manifest is not relative', () => {
    const {mockNodeRequire, file} = new TestEnv('a');

    mockNodeRequire.mockReturnValue({
      default: {files: [{...file, filename: '/a'}]}
    });

    expect(() => loadManifest('/path/to/m', mockNodeRequire)).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because the filename of its file '/a' is not relative."
      )
    );
  });

  it('throws if a file in the manifest conflicts with itself', () => {
    const {mockNodeRequire, file} = new TestEnv('b');

    mockNodeRequire.mockReturnValue({
      default: {files: [{...file, conflictingFilenames: ['a', 'b']}]}
    });

    expect(() => loadManifest('/path/to/m', mockNodeRequire)).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because its file 'b' conflicts with itself."
      )
    );
  });

  it('throws if a file in the manifest conflicts with another file in the manifest', () => {
    const {mockNodeRequire, file: fileA} = new TestEnv('a');
    const fileB = {...fileA, filename: 'b', conflictingFilenames: ['a']};

    mockNodeRequire.mockReturnValue({default: {files: [fileA, fileB]}});

    expect(() => loadManifest('/path/to/m', mockNodeRequire)).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because its file 'a' conflicts with its other file 'b'."
      )
    );
  });

  it('throws if the initial content of a file in the manifest is invalid', () => {
    const {mockNodeRequire, file} = new TestEnv('a');
    const {filetype} = file;

    mockNodeRequire.mockReturnValue({
      default: {
        files: [
          {...file, filetype: {...filetype, contentSchema: {type: 'string'}}}
        ]
      }
    });

    expect(() => loadManifest('/path/to/m', mockNodeRequire)).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because the initial content of its file 'a' is invalid. Details: The initialContent should be string."
      )
    );
  });
});
