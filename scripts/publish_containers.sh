#!/usr/bin/env bash

set -u -e -o pipefail

readonly BAZEL=./node_modules/.bin/bazel
readonly CONTAINER_LABELS=`${BAZEL} query --output=label 'kind("container_push", //services/...)'`

$BAZEL build $CONTAINER_LABELS

for target in $CONTAINER_LABELS ; do
  $BAZEL run ${target}
done
