#!/bin/sh

set -e

yarn clean
yarn install
npx lerna version --conventional-commits --no-push
npx lerna publish from-git --npm-client npm
git push --follow-tags
