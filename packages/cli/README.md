# @rcgen/cli

A generator for config files.

## Installation

### Using Yarn

```sh
yarn add -D @rcgen/cli
```

### Using NPM

```sh
npm install -D @rcgen/cli
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

---

Copyright (c) 2019, Clemens Akens. Released under the terms of the [MIT
License][license].

[license]: https://github.com/clebert/rcgen/blob/master/LICENSE
