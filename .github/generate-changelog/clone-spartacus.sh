#!/usr/bin/env bash
set -e

APP="fresh-devleop-spartacus"

git clone https://github.com/SAP/spartacus.git ${APP}
cd $APP
yarn install
chmod -R 777 .

wow=$(cat scripts/changelog.ts)

echo "cat thing"
echo "$wow"
echo "end cat things"

logs=$(npx ts-node scripts/changelog.ts --verbose --from asm-4.0.0)

echo "who logs"
echo "$logs"
echo "end logs"