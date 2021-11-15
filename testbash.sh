#!/usr/bin/env bash
set -e

please="$(npx ts-node scripts/changelog.ts --verbose --from asm-4.0.0)"
wow=$(cat scripts/changelog.ts)


please="${please//'%'/'%25'}"
please="${please//$'\n'/'%0A'}"
please="${please//$'\r'/'%0D'}"

# echo "$(echo "$please")"
echo "::set-output name=changelog::$(echo $please)"


# echo "cool"

# echo "wow $please"

# echo "did it work"

# echo "$please"