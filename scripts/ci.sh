#!/bin/sh

set -e

yarn commitlint-travis
git diff --exit-code yarn.lock
yarn prettier --list-different '**/*.{js,json,md,ts,tsx,yml}'
yarn sort-package-json package.json packages/*/package.json
git diff --exit-code package.json packages/*/package.json
yarn lint
yarn test --no-cache --maxWorkers 2 --no-verbose
