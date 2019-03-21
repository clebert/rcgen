# rcgen

[![GitHub Stars][github-stars-badge]][github-stars]

A generator for configuration files.

> ⚠️This project is at an early stage of development.

## Contents

- [Rationale](#rationale)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [CLI Documentation](#cli-documentation)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Rationale

[Today's JavaScript landscape][stateofjs] consists of a multitude of languages,
frameworks and tools and thus also the individual projects in it.

These include languages like TypeScript or Flow, linters like ESLint or TSLint,
transpilers like Babel, build tools like Webpack, Rollup or Parcel, testing
frameworks like Jest or Mocha, text editors like VS Code or Atom. In addition
there are tools like Git, Travis CI, Commitlint, Husky, Lerna, Wallaby, Yarn,
npm, etc.

All these tools need to be configured. In most cases, each tool has at least one
configuration file and many tools also influence each other and require a
coordinated individual configuration. This situation makes it difficult to set
up new projects or to keep old projects up to date. Experts usually copy the
configuration files of existing projects into their new projects manually with
minor adjustments. Beginners are often completely overwhelmed and develop their
software with suboptimal settings.

TODO

## Getting Started

TODO

## Examples

TODO

## CLI Documentation

```sh
Usage
  $ rcgen

Options
  --force,    -f  Overwrite existing files with different content.
  --manifest, -m  Relative filename of the manifest to be loaded.
                  Default: 'rcgen.js'
  --verbose,  -v  Enable verbose logging.

Examples
  $ rcgen
  $ rcgen --force
  $ rcgen --manifest 'rcgen.js'
  $ rcgen --verbose
```

## API Documentation

The API documentation can be found [here][website].

## Contributing

To get started, install the dependencies and run the tests:

```sh
yarn install && yarn test
```

### Development Scripts

| Command                 | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `yarn compile`          | Compiles all sources.                                   |
| `yarn lint`             | Lints all sources.                                      |
| `yarn test`             | Executes all tests.                                     |
| `yarn format`           | Formats all files.                                      |
| `yarn generate:configs` | Generates all configuration files managed by **rcgen**. |
| `yarn generate:docs`    | Generates all API documentation files.                  |

---

Copyright (c) 2019, Clemens Akens. Released under the terms of the [MIT
License][license].

[github-stars]: https://github.com/clebert/rcgen/stargazers
[github-stars-badge]:
  https://img.shields.io/github/stars/clebert/rcgen.svg?style=social&label=Star
[license]: https://github.com/clebert/rcgen/blob/master/LICENSE
[stateofjs]: https://2018.stateofjs.com
[website]: https://rcgen.io
