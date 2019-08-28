#!/bin/sh

echo "git push"
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git config --global push.default current
git stash
git checkout ${TARGET_BRANCH}
git stash pop
git add .
local message = "Pushing updates from Master"+$TRAVIS_BUILD_NUMBER
git commit -m $message
git push https://${GH_TOKEN}@github.com/assistify/outlook-plugin.git