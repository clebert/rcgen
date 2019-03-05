# @rcgen/cli

The CLI of **rcgen**.

## Installation

### Using Yarn

```sh
yarn add @rcgen/cli
```

### Using npm

```sh
npm install @rcgen/cli
```

## CLI Documentation

```sh
Usage
  $ rcgen

Options
  --force,    -f  Overwrite existing files with generated content.
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
