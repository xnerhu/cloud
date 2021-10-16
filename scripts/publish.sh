#!/usr/bin/env bash

set -u -e -o pipefail

readonly RAW_TAG=$(git describe --abbrev=7 --tags HEAD)

if [[ $RAW_TAG == npm-* ]] ;
then
  echo Publishing npm packages
  scripts/publish_npm.sh 
else
  echo Deploying service
  ./scripts/publish_service.sh $RAW_TAG
fi
