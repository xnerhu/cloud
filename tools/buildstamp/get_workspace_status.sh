#!/bin/bash

# This script will be run bazel when building process starts to
# generate key-value information that represents the status of the
# workspace. The output should be like
#
# KEY1 VALUE1
# KEY2 VALUE2
#
# If the script exits with non-zero code, it's considered as a failure
# and the output will be discarded.

echo "CI true"
echo "CODECOV_TOKEN ${CODECOV_TOKEN}"
echo "GITHUB_HEAD_REF ${GITHUB_HEAD_REF}"
echo "GITHUB_REF ${GITHUB_REF}"
echo "GITHUB_RUN_ID ${GITHUB_RUN_ID}"
echo "GITHUB_SHA ${GITHUB_SHA}"
echo "GITHUB_PR_SHA ${GITHUB_PR_SHA}"
echo "GITHUB_REPOSITORY ${GITHUB_REPOSITORY}"
echo "GITHUB_EVENT_NAME ${GITHUB_EVENT_NAME}"

NPM_TAG=$(git describe --abbrev=7 --tags HEAD)

echo NPM_STABLE_BUILD_SCM_VERSION $(echo $NPM_TAG | cut -d '-' -f2)

