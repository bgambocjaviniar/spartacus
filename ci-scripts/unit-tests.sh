#!/usr/bin/env bash
set -e
set -o pipefail

EXCLUDE_JEST=storefrontapp,storefrontstyles,schematics,setup
EXCLUDE_INTEGRATION_LIBS=cdc,cds,digital-payments,epd-visualization,s4om

echo "-----"

function run_affected_unit_tests {
    echo "Running JASMINE unit tests and code coverage for AFFECTED libraries"
    npx nx affected --target=test --exclude="$EXCLUDE_JEST,$EXCLUDE_INTEGRATION_LIBS" -- --no-watch --source-map --code-coverage --browsers ChromeHeadless

    echo "Running JEST (mostly schematics) unit tests and code coverage for AFFECTED libraries"
    npx nx affected --target=test-schematics -- --coverage --runInBand
}

# function run_all_unit_tests {
#     echo "Running JASMINE unit tests and code coverage for ALL libraries"
#     npx nx run-many --all --target=test --exclude="$EXCLUDE_JEST" -- --no-watch --source-map --code-coverage --browsers ChromeHeadless

#     echo "Running JEST (mostly schematics) unit tests and code coverage for ALL libraries"
#     npx nx run-many --all --target=test-schematics -- --coverage --runInBand
# }

# if [ "${GITHUB_EVENT_NAME}" == "pull_request" ]; then
#     echo "123123123"
#     npx nx print-affected --select=projects
#     echo "321321321"

#     if [[ "${GITHUB_HEAD_REF}" == epic/* ]]; then
#         run_all_unit_tests
#     else 
#         run_affected_unit_tests
#     fi
# else
#     run_all_unit_tests
# fi

run_affected_unit_tests
