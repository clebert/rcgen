# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.9.0](https://github.com/clebert/rcgen/compare/v0.8.0...v0.9.0) (2019-03-14)


### Bug Fixes

* **configs:** fix type of gitIgnoreFile ([#21](https://github.com/clebert/rcgen/issues/21)) ([c739b33](https://github.com/clebert/rcgen/commit/c739b33))
* **filetypes:** do not add newline to empty content ([#22](https://github.com/clebert/rcgen/issues/22)) ([1168177](https://github.com/clebert/rcgen/commit/1168177))


### Features

* **configs:** create configs package ([#19](https://github.com/clebert/rcgen/issues/19)) ([5186ea8](https://github.com/clebert/rcgen/commit/5186ea8))





# [0.8.0](https://github.com/clebert/rcgen/compare/v0.7.0...v0.8.0) (2019-03-10)


### Features

* **core:** curry the matchFile function ([#14](https://github.com/clebert/rcgen/issues/14)) ([6529368](https://github.com/clebert/rcgen/commit/6529368))





# [0.7.0](https://github.com/clebert/rcgen/compare/v0.6.0...v0.7.0) (2019-03-10)


### Features

* **all:** rename read content to existing content ([#13](https://github.com/clebert/rcgen/issues/13)) ([de4fec0](https://github.com/clebert/rcgen/commit/de4fec0))
* **core:** add matchFile utility function ([#12](https://github.com/clebert/rcgen/issues/12)) ([88ec0b8](https://github.com/clebert/rcgen/commit/88ec0b8))





# [0.6.0](https://github.com/clebert/rcgen/compare/v0.5.0...v0.6.0) (2019-03-10)


### Features

* **core:** remove some default/variadic args ([#9](https://github.com/clebert/rcgen/issues/9)) ([367db0d](https://github.com/clebert/rcgen/commit/367db0d))
* **patchers:** conversion of patchers to higher-order patchers ([#10](https://github.com/clebert/rcgen/issues/10)) ([26816d0](https://github.com/clebert/rcgen/commit/26816d0))





# [0.5.0](https://github.com/clebert/rcgen/compare/v0.4.0...v0.5.0) (2019-03-10)


### Features

* **core:** pass other filenames as argument to a patcher ([#8](https://github.com/clebert/rcgen/issues/8)) ([69cbec5](https://github.com/clebert/rcgen/commit/69cbec5))





# [0.4.0](https://github.com/clebert/rcgen/compare/v0.3.0...v0.4.0) (2019-03-10)


### Features

* **core:** add convenience functions for enhancing a manifest ([#7](https://github.com/clebert/rcgen/issues/7)) ([4f65905](https://github.com/clebert/rcgen/commit/4f65905))
* **core:** the Manifest.files property is now optional ([#6](https://github.com/clebert/rcgen/issues/6)) ([0af74fa](https://github.com/clebert/rcgen/commit/0af74fa))





# [0.3.0](https://github.com/clebert/rcgen/compare/v0.2.0...v0.3.0) (2019-03-09)


### Features

* **core:** add optional custom logger parameter to validate ([#5](https://github.com/clebert/rcgen/issues/5)) ([970b38e](https://github.com/clebert/rcgen/commit/970b38e))





# [0.2.0](https://github.com/clebert/rcgen/compare/v0.1.0...v0.2.0) (2019-03-08)


### Features

* **core:** remove nested if statements ([#3](https://github.com/clebert/rcgen/issues/3)) ([84d01ee](https://github.com/clebert/rcgen/commit/84d01ee))
* **core:** validate now supports draft-04/-06/-07 JSON schemas ([#4](https://github.com/clebert/rcgen/issues/4)) ([805e96a](https://github.com/clebert/rcgen/commit/805e96a))





# 0.1.0 (2019-03-05)


### Bug Fixes

* **core:** remove undefined from patcher return type ([4fb141c](https://github.com/clebert/rcgen/commit/4fb141c))


### Features

* **cli:** create cli package ([b91409d](https://github.com/clebert/rcgen/commit/b91409d))
* **cli:** improve error logging ([a632e21](https://github.com/clebert/rcgen/commit/a632e21))
* **cli:** improve help message ([70995b1](https://github.com/clebert/rcgen/commit/70995b1))
* **core:** additional args for the (de)serializer functions ([5742462](https://github.com/clebert/rcgen/commit/5742462))
* **core:** create core package ([4fa4ae5](https://github.com/clebert/rcgen/commit/4fa4ae5))
* **core:** make the validate function public ([360cee9](https://github.com/clebert/rcgen/commit/360cee9))
* **core:** saveFile should create all necessary subdirectories ([f58895b](https://github.com/clebert/rcgen/commit/f58895b))
* **filetypes:** add JSON file type ([66d2bc4](https://github.com/clebert/rcgen/commit/66d2bc4))
* **filetypes:** add Node.js module file type ([2e4d043](https://github.com/clebert/rcgen/commit/2e4d043))
* **filetypes:** add YAML file type ([2167c70](https://github.com/clebert/rcgen/commit/2167c70))
* **filetypes:** create filetypes package ([a6487b6](https://github.com/clebert/rcgen/commit/a6487b6))
* **filetypes:** remove option insertFinalNewline of text filetype ([920a31d](https://github.com/clebert/rcgen/commit/920a31d))
* **filetypes:** rename text file type to lines ([8890ae0](https://github.com/clebert/rcgen/commit/8890ae0))
* **patchers:** add merge patcher function ([9cfb643](https://github.com/clebert/rcgen/commit/9cfb643))
* **patchers:** add replace patcher function ([d3e6948](https://github.com/clebert/rcgen/commit/d3e6948))
* **patchers:** create patchers package ([14ea85a](https://github.com/clebert/rcgen/commit/14ea85a))
* **patchers:** remove addLines patcher function in favor of merge ([7482ffb](https://github.com/clebert/rcgen/commit/7482ffb))
