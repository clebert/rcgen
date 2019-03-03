import path from 'path';
import {validate} from './validate';

export type Serializer<T> = (content: T) => Buffer;
export type Deserializer<T> = (contentData: Buffer) => T;

export interface Filetype<T> {
  readonly contentSchema: object;
  readonly serializer: Serializer<T>;
  readonly deserializer?: Deserializer<T>;
}

export interface File<T> {
  readonly filename: string;
  readonly filetype: Filetype<T>;
  readonly initialContent: T;
  readonly conflictingFilenames?: string[];
}

export interface PatcherArgs<T> {
  readonly filename: string;
  readonly rootDirname: string;
  readonly generatedContent: T;
  readonly readContent: T | undefined;
}

export type Patcher<T> = (args: PatcherArgs<T>) => T;

export interface Manifest {
  // tslint:disable: no-any
  readonly files: File<any>[];
  readonly patchers?: Patcher<any>[];
  // tslint:enable: no-any
  readonly includedFilenames?: string[];
  readonly excludedFilenames?: string[];
}

export interface LoadedManifest extends Manifest {
  readonly manifestFilename: string;
}

function createManifestCannotBeLoadedError(
  manifestFilename: string,
  cause: string,
  details?: string
): Error {
  return new Error(
    `Manifest '${manifestFilename}' cannot be loaded ${cause}.${
      details ? ` Details: ${details}` : ''
    }`
  );
}

const serializerSchema = {isFunction: true};
const deserializerSchema = {isFunction: true};

const filetypeSchema = {
  type: 'object',
  properties: {
    contentSchema: {type: 'object'},
    serializer: serializerSchema,
    deserializer: deserializerSchema
  },
  required: ['contentSchema', 'serializer'],
  additionalProperties: false
};

const fileSchema = {
  type: 'object',
  properties: {
    filename: {type: 'string'},
    filetype: filetypeSchema,
    initialContent: {},
    conflictingFilenames: {type: 'array', items: {type: 'string'}}
  },
  required: ['filename', 'filetype', 'initialContent'],
  additionalProperties: false
};

const patcherSchema = {isFunction: true};

const manifestSchema = {
  type: 'object',
  properties: {
    files: {type: 'array', items: fileSchema},
    patchers: {type: 'array', items: patcherSchema},
    includedFilenames: {type: 'array', items: {type: 'string'}},
    excludedFilenames: {type: 'array', items: {type: 'string'}}
  },
  required: ['files'],
  additionalProperties: false
};

const manifestModuleSchema = {
  type: 'object',
  properties: {default: manifestSchema},
  required: ['default'],
  additionalProperties: false
};

/**
 * @throws if the filename of the manifest is not absolute
 * @throws if the module of the manifest could not be required
 * @throws if the module of the manifest does not have a valid default export
 * @throws if at least two of the files in the manifest have the same filename
 * @throws if the filename of a file in the manifest is not relative
 * @throws if a file in the manifest conflicts with itself
 * @throws if a file in the manifest conflicts with another file in the manifest
 * @throws if the initial content of a file in the manifest is invalid
 */
export function loadManifest(
  manifestFilename: string,
  nodeRequire: (moduleName: string) => unknown = require
): LoadedManifest {
  if (!path.isAbsolute(manifestFilename)) {
    throw createManifestCannotBeLoadedError(
      manifestFilename,
      'because its filename is not absolute'
    );
  }

  let manifestModule: unknown;

  try {
    manifestModule = nodeRequire(manifestFilename);
  } catch (error) {
    throw createManifestCannotBeLoadedError(
      manifestFilename,
      'because its module could not be required',
      error.message
    );
  }

  const manifestModuleResult = validate<{readonly default: Manifest}>(
    manifestModule,
    'manifestModule',
    manifestModuleSchema
  );

  if (!manifestModuleResult.isValid(manifestModule)) {
    throw createManifestCannotBeLoadedError(
      manifestFilename,
      'because its module does not have a valid default export',
      manifestModuleResult.validationMessage
    );
  }

  const manifest = manifestModule.default;
  const {files} = manifest;
  const filenames = new Set<string>();

  for (const {filename, filetype, initialContent} of files) {
    if (filenames.has(filename)) {
      throw createManifestCannotBeLoadedError(
        manifestFilename,
        `because at least two of its files have the same filename '${filename}'`
      );
    }

    filenames.add(filename);

    if (path.isAbsolute(filename)) {
      throw createManifestCannotBeLoadedError(
        manifestFilename,
        `because the filename of its file '${filename}' is not relative`
      );
    }

    for (const {filename: otherFilename, conflictingFilenames} of files) {
      if (conflictingFilenames && conflictingFilenames.includes(filename)) {
        if (filename === otherFilename) {
          throw createManifestCannotBeLoadedError(
            manifestFilename,
            `because its file '${filename}' conflicts with itself`
          );
        } else {
          throw createManifestCannotBeLoadedError(
            manifestFilename,
            `because its file '${filename}' conflicts with its other file '${otherFilename}'`
          );
        }
      }
    }

    const initialContentResult = validate(
      initialContent,
      'initialContent',
      filetype.contentSchema
    );

    if (!initialContentResult.isValid(initialContent)) {
      throw createManifestCannotBeLoadedError(
        manifestFilename,
        `because the initial content of its file '${filename}' is invalid`,
        initialContentResult.validationMessage
      );
    }
  }

  return {...manifest, manifestFilename};
}
