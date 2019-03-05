# rcgen

A generator for config files.

## Rationale

TODO

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
npm install -D @rcgen/cli @rcgen/core @rcgen/filetypes
```

4. Create a `rcgen.js` manifest file with the following contents:

```js
exports.default = {
  files: []
};
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

## Packages

### [@rcgen/cli][package-cli]

The CLI of **rcgen**.

### [@rcgen/core][package-core]

The core functionality of **rcgen**.

### [@rcgen/filetypes][package-filetypes]

A collection of common file types for use with **rcgen**.

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
[prettier]: https://prettier.io
