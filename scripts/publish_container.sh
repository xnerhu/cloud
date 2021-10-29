#!/usr/bin/env bash

set -u -e -o pipefail

readonly BAZEL=./node_modules/.bin/bazel
readonly CONTAINER=$(echo $1 | cut -d '-' -f1)

target="//$CONTAINER:image.push"

$BAZEL run $target
