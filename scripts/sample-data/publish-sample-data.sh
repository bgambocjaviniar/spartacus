#!/usr/bin/env bash

TAG_NAME=sampledata
SAMPLE_DATA_ASSETS_FOLDER=sample-data-assets

echo "-----"
echo "Downloading LATEST sample data for 5.0"

curl -H "Authorization: token $GHT_PRIVATE_REPO_TOKEN" -L "https://github.tools.sap/cx-commerce/spartacussampledata/archive/abc.zip" -o "spartacussampledata-current.zip"
curl -H "Authorization: token $GHT_PRIVATE_REPO_TOKEN" -L "https://github.tools.sap/cx-commerce/spartacussampledata/archive/abc.tar.gz" -o "spartacussampledata-current.tar.gz"

echo "Downloading PREVIOUS supported sample data for <= 4.3.x"

curl -H "Authorization: token $GHT_PRIVATE_REPO_TOKEN" -L "https://github.tools.sap/cx-commerce/spartacussampledata/archive/a.zip" -o "spartacussampledata-previous.zip"
curl -H "Authorization: token $GHT_PRIVATE_REPO_TOKEN" -L "https://github.tools.sap/cx-commerce/spartacussampledata/archive/a.tar.gz" -o "spartacussampledata-previous.tar.gz"

echo "-----"
echo "Move assets to single folder"
rm -rf $SAMPLE_DATA_ASSETS_FOLDER
mkdir $SAMPLE_DATA_ASSETS_FOLDER && mv spartacussampledata-* $SAMPLE_DATA_ASSETS_FOLDER

echo "-----"
echo "Deleting tag on the remote repository to remove any tied releases"

git push "https://${GHT_USER}:$GHT_TOKEN@github.com/${GHT_USER}/npmrc-not-pickedup-with-yarn-for-private-repo-test.git" :refs/tags/$TAG_NAME

echo "-----"
echo "Create a release with created tag"

gh release create $TAG_NAME ./$SAMPLE_DATA_ASSETS_FOLDER/**  --notes "Spartacus sample data releases" --repo "https://${GHT_USER}:$GHT_TOKEN@github.com/${GHT_USER}/npmrc-not-pickedup-with-yarn-for-private-repo-test.git"
