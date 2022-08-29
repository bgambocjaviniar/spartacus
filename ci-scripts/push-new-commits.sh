#!/usr/bin/env bash
set -e
set -o pipefail

COMMITS_SHA=`git rev-list $GITHUB_SHA..HEAD | sort -r`


for COMMIT_SHA in $COMMITS_SHA; do
    echo $COMMIT_SHA
    git push $WOW $COMMIT_SHA:develop -f
done

