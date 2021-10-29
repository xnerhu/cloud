#!/usr/bin/env bash

set -u -e -o pipefail

readonly RAW_TAG=$(git describe --abbrev=7 --tags HEAD)

if [[ $RAW_TAG == npm-* ]] ;
then
  scripts/publish_npm.sh 
else
  scripts/publish_container.sh $RAW_TAG
fi
