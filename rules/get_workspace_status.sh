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

# The code below presents an implementation that works for git repository
# git_rev=$(git rev-parse HEAD)
# if [[ $? != 0 ]];
# then
#     exit 1
# fi
# echo "BUILD_SCM_REVISION ${git_rev}"

# # Check whether there are any uncommitted changes
# git diff-index --quiet HEAD --
# if [[ $? == 0 ]];
# then
#     tree_status="Clean"
# else
#     tree_status="Modified"
# fi
# echo "BUILD_SCM_STATUS ${tree_status}"

# echo "xd"

git_branch=$(git rev-parse --abbrev-ref HEAD || hg branch)
git_head=$(git log -1 --pretty=%H || hg id -i --debug | tr -d '+')

echo "GIT_BRANCH ${git_branch}"
echo "GIT_HEAD ${git_head}"

echo "XD ${lmao}"