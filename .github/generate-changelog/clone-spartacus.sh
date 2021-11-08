#!/usr/bin/env bash
set -e

APP="fresh-devleop-spartacus"

git clone https://github.com/SAP/spartacus.git ${APP}
cd $DIR
yarn install
chmod -R 777 .

logs=$(ts-node scripts/changelog.ts --verbose --from asm-4.0.0 2>&1)

echo "$logs"