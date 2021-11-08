#!/usr/bin/env bash
set -e

APP="fresh-devleop-spartacus"

git clone https://github.com/SAP/spartacus.git ${APP}
cd $DIR
yarn install
chmod -R 777 .
