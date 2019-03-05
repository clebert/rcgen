# rcgen

A generator for config files.

## Installation

### Using Yarn

```sh
yarn add @rcgen/cli @rcgen/core @rcgen/filetypes
```

### Using npm

```sh
npm install @rcgen/cli @rcgen/core @rcgen/filetypes
```

## Getting Started

```sh
npx rcgen --verbose
```

## CLI Documentation

```sh
Usage
  $ rcgen

Options
  --force,    -f  Overwrite existing files with new content.
  --manifest, -m  Relative filename of the manifest to be loaded.
                  Default: 'rcgen.js'
  --verbose,  -v  Enable verbose logging.

Examples
  $ rcgen
  $ rcgen --force
  $ rcgen --manifest 'rcgen.js'
  $ rcgen --verbose
```

## Packages

### [@rcgen/cli][package-cli]

The CLI of rcgen.

### [@rcgen/core][package-core]

The core functionality of rcgen.

### [@rcgen/filetypes][package-filetypes]

A collection of common file types for use with rcgen.

---

Copyright (c) 2019, Clemens Akens. Released under the terms of the [MIT
License][license].

[license]: https://github.com/clebert/rcgen/blob/master/LICENSE
[package-cli]:
  https://github.com/clebert/rcgen/blob/master/packages/cli/README.md
[package-core]:
  https://github.com/clebert/rcgen/blob/master/packages/core/README.md
[package-filetypes]:
  https://github.com/clebert/rcgen/blob/master/packages/filetypes/README.md
