#!/bin/sh

set -e

yarn install
rm -rf docs
$(npm bin)/lerna exec --no-private --parallel -- typedoc --options ../../typedoc.js --out ../../docs/\$LERNA_PACKAGE_NAME --tsconfig tsconfig.json .
node scripts/process-docs.js
echo '/ https://github.com/clebert/rcgen 302' > docs/_redirects
