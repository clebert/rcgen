import {filetype, filetypeWithDeserializer, mockNodeRequire} from './test-env';

import {loadManifest} from '..';

export interface InvalidDefinition {
  readonly invalidManifestModule: unknown;
  readonly validationMessage: string;
}

function defineInvalidManifestModule(
  invalidManifestModule: unknown,
  predicate: string
): InvalidDefinition {
  return {
    invalidManifestModule,
    validationMessage: `The manifestModule${predicate}.`
  };
}

function defineInvalidManifest(
  invalidManifest: unknown,
  predicate: string
): InvalidDefinition {
  return defineInvalidManifestModule(
    {default: invalidManifest},
    `.default${predicate}`
  );
}

function defineInvalidFile(
  invalidFile: unknown,
  predicate: string
): InvalidDefinition {
  return defineInvalidManifest({files: [invalidFile]}, `.files[0]${predicate}`);
}

function defineInvalidFiletype(
  invalidFiletype: unknown,
  predicate: string
): InvalidDefinition {
  return defineInvalidFile(
    {filename: 'a', filetype: invalidFiletype},
    `.filetype${predicate}`
  );
}

describe('loadManifest', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('loads the manifest', () => {
    const file = {filename: 'a', filetype};

    const manifests = [
      {},
      {files: []},
      {files: [file]},
      {files: [{...file, conflictingFilenames: []}]},
      {files: [{...file, conflictingFilenames: ['b']}]},
      {files: [{...file, filetype: filetypeWithDeserializer}]},
      {generators: []},
      {generators: [jest.fn()]},
      {files: [], generators: []}
    ];

    for (const manifest of manifests) {
      mockNodeRequire.mockReturnValue({default: manifest});

      expect(loadManifest(absoluteManifestFilename, mockNodeRequire)).toEqual({
        ...manifest,
        absoluteManifestFilename
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
    mockNodeRequire.mockImplementation(() => {
      throw new Error('NodeRequireError');
    });

    expect(() =>
      loadManifest(absoluteManifestFilename, mockNodeRequire)
    ).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because its module could not be required. Details: NodeRequireError"
      )
    );
  });

  it('throws if the module of the manifest does not have a valid default export', () => {
    const file = {filename: 'a', filetype};

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
      defineInvalidManifest({generators: 123}, '.generators should be array'),
      defineInvalidManifest(
        {generators: [123]},
        '.generators[0] should be function'
      ),
      defineInvalidManifest(
        {unknown: 123},
        ' should NOT have additional properties'
      ),
      defineInvalidFile(123, ' should be object'),
      defineInvalidFile(
        {filetype},
        " should have required property 'filename'"
      ),
      defineInvalidFile(
        {filename: 'a'},
        " should have required property 'filetype'"
      ),
      defineInvalidFile(
        {filename: 123, filetype},
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

    for (const {
      invalidManifestModule,
      validationMessage
    } of invalidDefinitions) {
      mockNodeRequire.mockReturnValue(invalidManifestModule);

      expect(() =>
        loadManifest(absoluteManifestFilename, mockNodeRequire)
      ).toThrowError(
        new Error(
          `Manifest '/path/to/m' cannot be loaded because its module does not have a valid default export. Details: ${validationMessage}`
        )
      );
    }
  });

  it('throws if at least two of the files in the manifest have the same filename', () => {
    const file = {filename: 'a', filetype};
    const manifest = {files: [file, file]};

    mockNodeRequire.mockReturnValue({default: manifest});

    expect(() =>
      loadManifest(absoluteManifestFilename, mockNodeRequire)
    ).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because at least two of its files have the same filename 'a'."
      )
    );
  });

  it('throws if the filename of a file in the manifest is not relative', () => {
    const file = {filename: '/a', filetype};
    const manifest = {files: [file]};

    mockNodeRequire.mockReturnValue({default: manifest});

    expect(() =>
      loadManifest(absoluteManifestFilename, mockNodeRequire)
    ).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because the filename of its file '/a' is not relative."
      )
    );
  });

  it('throws if a file in the manifest conflicts with itself', () => {
    const file = {filename: 'b', filetype, conflictingFilenames: ['a', 'b']};
    const manifest = {files: [file]};

    mockNodeRequire.mockReturnValue({default: manifest});

    expect(() =>
      loadManifest(absoluteManifestFilename, mockNodeRequire)
    ).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because its file 'b' conflicts with itself."
      )
    );
  });

  it('throws if a file in the manifest conflicts with another file in the manifest', () => {
    const fileA = {filename: 'a', filetype};
    const fileB = {filename: 'b', filetype, conflictingFilenames: ['a']};

    const manifest = {files: [fileA, fileB]};

    mockNodeRequire.mockReturnValue({default: manifest});

    expect(() =>
      loadManifest(absoluteManifestFilename, mockNodeRequire)
    ).toThrowError(
      new Error(
        "Manifest '/path/to/m' cannot be loaded because its file 'a' conflicts with its other file 'b'."
      )
    );
  });
});
