#!/bin/sh

set -e

git clean -f -x -d -e todo.tasks
yarn install
npx lerna version --conventional-commits --no-push
npx lerna publish from-git --npm-client npm
git push --follow-tags
