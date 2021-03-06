import {generateFile, loadFile, loadManifest, saveFile} from '@rcgen/core';
import meow from 'meow';
import path from 'path';

interface Cli {
  readonly flags: {
    readonly force: boolean;
    readonly manifest: string;
    readonly verbose: boolean;
  };
}

const defaultManifestFilename = 'rcgen.js';

const helpMessage = `
  Usage
    $ rcgen

  Options
    --force,    -f  Overwrite existing files with different content.
    --manifest, -m  Relative filename of the manifest to be loaded.
                    Default: '${defaultManifestFilename}'
    --verbose,  -v  Enable verbose logging.

  Examples
    $ rcgen
    $ rcgen --force
    $ rcgen --manifest '${defaultManifestFilename}'
    $ rcgen --verbose
`;

const options: meow.Options = {
  flags: {
    force: {type: 'boolean', alias: 'f', default: false},
    manifest: {type: 'string', alias: 'm', default: defaultManifestFilename},
    verbose: {type: 'boolean', alias: 'v', default: false}
  }
};

const {
  flags: {force, manifest: manifestFilename, verbose}
} = (meow(helpMessage, options) as any) as Cli; // tslint:disable-line: no-any

function log(message: string): void {
  if (verbose) {
    console.log(message);
  }
}

try {
  const absoluteManifestFilename = path.join(process.cwd(), manifestFilename);
  const loadedManifest = loadManifest(absoluteManifestFilename);
  const {files = []} = loadedManifest;

  if (files.length === 0) {
    log(
      `No files to be generated found in manifest '${absoluteManifestFilename}'.`
    );
  } else {
    for (const file of files) {
      const {filename} = file;
      const loadedFile = loadFile(loadedManifest, filename);
      const generatedFile = generateFile(loadedManifest, loadedFile);

      if (!generatedFile) {
        log(
          `File '${filename}' has no generated content and was therefore skipped.`
        );
      } else if (saveFile(loadedManifest, generatedFile, force)) {
        log(`File '${filename}' was successfully generated.`);
      } else {
        log(`File '${filename}' is already generated.`);
      }
    }
  }
} catch (error) {
  console.error(error);

  process.exit(1);
}
