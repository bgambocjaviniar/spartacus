#!/usr/bin/env bash
set -e
set -o pipefail


EXCLUDE_LIBS_AND_APPS=storefrontapp,setup,assets,core,schematics,storefrontlib,storefrontstyles,eslint-rules
EXCLUDE_INTEGRATION_LIBS=cdc,cds,digital-payments,epd-visualization,s4om

# AFFECTED_E2ES=`npx nx print-affected --base=develop-test-3 --head=develop-test-4 --exclude=$EXCLUDE_LIBS_AND_APPS,$EXCLUDE_INTEGRATION_LIBS --select=projects | sed 's/, /,/g'`

AFFECTED_E2ES=`npx nx print-affected --exclude=$EXCLUDE_LIBS_AND_APPS,$EXCLUDE_INTEGRATION_LIBS --select=projects | sed 's/, /,/g'`

echo $AFFECTED_E2ES
