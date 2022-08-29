#!/usr/bin/env bash
set -e
set -o pipefail

COMMITS_SHA=`git rev-list f7ea7a78b48ace061b17a81fa37d23bb21a62e2d..HEAD`


for COMMIT_SHA in $COMMITS_SHA; do
    echo $COMMIT_SHA
    git push $WOW $COMMIT_SHA:wow -f
done

