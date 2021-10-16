#!/usr/bin/env bash

set -u -e -o pipefail

# readonly BAZEL=./node_modules/.bin/bazel
# readonly PKG_NPM_LABELS=`$BAZEL query --output=label 'kind("pkg_npm rule", //...)'`

# $BAZEL build $PKG_NPM_LABELS

# for pkg in $PKG_NPM_LABELS ; do
#   $BAZEL run ${pkg}.publish -- --access=restricted --@wexond:registry/${NPM_REGISTRY}
# done

# IN="npm-1.0.0" 
# arrIN=(${IN//-/ })
# echo ${arrIN[1]}


