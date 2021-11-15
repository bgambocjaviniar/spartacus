#!/usr/bin/env bash
set -e

please=$(npx ts-node scripts/changelog.ts --verbose --from asm-4.0.0)
wow=$(cat scripts/changelog.ts)

echo "$wow"

echo "cool"

# echo "wow $please"

# echo "did it work"

# echo "$please"