#!/usr/bin/env bash
set -e

please="$(git describe --tags $(git rev-list --tags --max-count=1))"
wow=$(cat scripts/changelog.ts)


# echo "$(echo "$please")"
echo $please


# echo "cool"

# echo "wow $please"

# echo "did it work"

# echo "$please"