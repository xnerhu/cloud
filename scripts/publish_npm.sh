#!/usr/bin/env bash

set -u -e -o pipefail

readonly BAZEL=./node_modules/.bin/bazel
readonly PKG_NPM_LABELS=`$BAZEL query --output=label 'kind("pkg_npm rule", //...)'`

$BAZEL build $PKG_NPM_LABELS

for pkg in $PKG_NPM_LABELS ; do
  $BAZEL run ${pkg}.publish --stamp -- --access=restricted --@${NPM_SCOPE}:registry/https://${NPM_REGISTRY}
done
