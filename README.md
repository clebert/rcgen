# rcgen

A generator for configuration files.

> ⚠️This project is still in the development phase. I am currently testing a
> first integration in another monorepo project. After the complete integration
> I hope for a good abstraction and first ready-to-use configuration
> integrations for the tools used in the other monorepo. The progress can be
> seen here:

- https://github.com/sinnerschrader/feature-hub/pull/405

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

To be continued...

## Getting Started

Let's assume that we are developing a JavaScript project for which
[Prettier][prettier] should be configured as code formatter, Git should be used
as version control system, and Visual Studio Code should be used as editor.

Our goal is to generate all necessary configuration files automatically with
**rcgen**.

### Step-by-Step Instructions

1. Create a new project directory:

```sh
  mkdir my-project && cd my-project
```

2. Create a `package.json` file:

```sh
npm init
```

3. Install all necessary packages from **rcgen**:

```sh
npm install -D @rcgen/cli @rcgen/core @rcgen/filetypes @rcgen/patchers
```

4. Create a `rcgen.js` manifest file with the following contents:

```js
exports.default = {};
```

5. Define the `prettier.config.js` file within the manifest file:

```js
const {createNodeModuleFiletype} = require('@rcgen/filetypes');

exports.default = {
  files: [
    {
      filename: 'prettier.config.js',
      filetype: createNodeModuleFiletype(),
      initialContent: {}
    }
  ]
};
```

6. Generate the just defined file using **rcgen**:

```sh
npx rcgen --verbose
```

```sh
File 'prettier.config.js' was successfully generated.
```

7. Inspect the just generated file:

```sh
cat prettier.config.js
```

Output:

```js
// prettier-ignore
module.exports = require('@rcgen/core').generateContent('/path/to/my-project/rcgen.js', 'prettier.config.js');
```

As you can see at the output, the content of the `prettier.config.js` file is
generated dynamically. The following command can be used to inspect the
generated content:

```sh
node -e 'console.log(require("./prettier.config.js"));'
```

Output:

```sh
{}
```

8. Define a meaningful Prettier configuration within the manifest file:

```js
exports.default = {
  files: [
    {
      filename: 'prettier.config.js',
      filetype: createNodeModuleFiletype(),
      initialContent: {
        bracketSpacing: false,
        proseWrap: 'always',
        singleQuote: true
      }
    }
  ]
};
```

9. Inspect the `prettier.config.js` file again:

```sh
node -e 'console.log(require("./prettier.config.js"));'
```

Output:

```sh
{ bracketSpacing: false, proseWrap: 'always', singleQuote: true }
```

10. To be continued...

## Examples

This project has its own [`rcgen.js`][rcgen-file] file that serves as an
integration test and generates some of the configuration files needed for
development.

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

## API Documentation

### [@rcgen/core][api-core]

The core functionality of **rcgen**.

### [@rcgen/filetypes][api-filetypes]

A collection of common file types for use with **rcgen**.

### [@rcgen/patchers][api-patchers]

A collection of higher-order patchers for use with **rcgen**.

## Contributing

To get started, install the dependencies and run the tests:

```sh
yarn install && yarn test
```

### Development Scripts

| Command        | Description           |
| -------------- | --------------------- |
| `yarn compile` | Compiles all sources. |
| `yarn lint`    | Lints all sources.    |
| `yarn test`    | Executes all tests.   |
| `yarn format`  | Formats all files.    |

---

Copyright (c) 2019, Clemens Akens. Released under the terms of the [MIT
License][license].

[api-core]: https://rcgen.io/@rcgen/core/
[api-filetypes]: https://rcgen.io/@rcgen/filetypes/
[api-patchers]: https://rcgen.io/@rcgen/patchers/
[license]: https://github.com/clebert/rcgen/blob/master/LICENSE
[prettier]: https://prettier.io
[rcgen-file]: https://github.com/clebert/rcgen/blob/master/rcgen.js
[stateofjs]: https://2018.stateofjs.com
