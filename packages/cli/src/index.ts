import {loadFile, loadManifest, patchFile, saveFile} from '@rcgen/core';
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
    --force,    -f  Overwrite existing files with generated content.
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
    log(`No files found in manifest '${absoluteManifestFilename}'.`);
  } else {
    for (const file of files) {
      const {filename} = file;
      const loadedFile = loadFile(loadedManifest, filename);

      if (loadedFile) {
        const patchedFile = patchFile(loadedManifest, loadedFile);

        if (!patchedFile) {
          log(
            `File '${filename}' has no generated content and was therefore skipped.`
          );
        } else if (saveFile(loadedManifest, patchedFile, force)) {
          log(`File '${filename}' was successfully generated.`);
        } else {
          log(`File '${filename}' is already generated.`);
        }
      } else {
        log(`File '${filename}' is not included.`);
      }
    }
  }
} catch (error) {
  console.error(error);

  process.exit(1);
}
