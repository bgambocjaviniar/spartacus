#!/usr/bin/env bash
set -e
set -o pipefail

COMMITS_SHA=`git rev-list fb606cd8289277648b818531ea349e1bf28a0558..HEAD`


for COMMIT_SHA in $COMMITS_SHA; do
    echo $COMMIT_SHA
done

