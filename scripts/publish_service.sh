#!/usr/bin/env bash

set -u -e -o pipefail

readonly BAZEL=./node_modules/.bin/bazel
readonly SERVICE=$(echo $1 | cut -d '-' -f1)

target="//$SERVICE:image.push"

$BAZEL run $target
