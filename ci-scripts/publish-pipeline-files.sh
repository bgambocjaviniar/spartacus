#!/usr/bin/env bash


echo "-----"
echo "Clone repo"

SONAR_PATH="./sonar-project.properties"

git clone -b $BRANCH_TO_SYNC https://$GHT_USER:$GHT_PRIVATE_REPO_TOKEN@github.tools.sap/cx-commerce-storefronts/$GHT_SPARTACUS_REPO.git
cd $GHT_SPARTACUS_REPO

# git pull

git config --global user.email $GHT_EMAIL
git config --global user.name $GHT_USER

echo "-----"
echo "Get files other branch"

git checkout origin/sap-pipeline-files -- .

echo "-----"
echo "Configure sonar"

sed -i "s%sonar.branch.name=%sonar.branch.name=$BRANCH_TO_SYNC%gi" $SONAR_PATH

echo "---------------------------------------------------------------------------------------------------------------------------"
echo "Verify sonar.branch.name has been updated with the synched branch name"

cat $SONAR_PATH

if grep -Fq "sonar.branch.name=$BRANCH_TO_SYNC" $SONAR_PATH
then
    echo "Branch name has successfully been added to the sonar.branch.name"
else
    echo "Error. Branch name has NOT been added to the sonar.branch.name"
    exit 1
fi

echo "-----"
echo "Include files to synced branch"

git add .
git commit -m "include remaining pipeline files"
git push origin $BRANCH_TO_SYNC
