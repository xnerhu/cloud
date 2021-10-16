# Third-party dependencies fetched by Bazel
# Unlike WORKSPACE, the content of this file is unordered.
# We keep them separate to make the WORKSPACE file more maintainable.

# Install the nodejs "bootstrap" package
# This provides the basic tools for running and packaging nodejs programs in Bazel
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

def fetch_dependencies():
    http_archive(
        name = "bazel_skylib",
        urls = [
            "https://github.com/bazelbuild/bazel-skylib/releases/download/1.1.1/bazel-skylib-1.1.1.tar.gz",
            "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.1.1/bazel-skylib-1.1.1.tar.gz",
        ],
        sha256 = "c6966ec828da198c5d9adbaa94c05e3a1c7f21bd012a0b29ba8ddbccb2c93b0d",
    )

    http_archive(
        name = "build_bazel_rules_nodejs",
        sha256 = "4501158976b9da216295ac65d872b1be51e3eeb805273e68c516d2eb36ae1fbb",
        urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.4.1/rules_nodejs-4.4.1.tar.gz"],
    )

    # http_archive(
    #     name = "io_bazel_rules_docker",
    #     sha256 = "92779d3445e7bdc79b961030b996cb0c91820ade7ffa7edca69273f404b085d5",
    #     strip_prefix = "rules_docker-0.20.0",
    #     urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.20.0/rules_docker-v0.20.0.tar.gz"],
    # )

    http_archive(
        name = "com_google_protobuf",
        sha256 = "9111bf0b542b631165fadbd80aa60e7fb25b25311c532139ed2089d76ddf6dd7",
        strip_prefix = "protobuf-3.18.1",
        urls = ["https://github.com/protocolbuffers/protobuf/archive/v3.18.1.tar.gz"],
    )

    http_archive(
        name = "rules_proto",
        sha256 = "66bfdf8782796239d3875d37e7de19b1d94301e8972b3cbd2446b332429b4df1",
        strip_prefix = "rules_proto-4.0.0",
        urls = [
            "https://mirror.bazel.build/github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
            "https://github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
        ],
    )

    http_archive(
        name = "rules_proto_grpc",
        sha256 = "28724736b7ff49a48cb4b2b8cfa373f89edfcb9e8e492a8d5ab60aa3459314c8",
        strip_prefix = "rules_proto_grpc-4.0.1",
        urls = ["https://github.com/rules-proto-grpc/rules_proto_grpc/archive/4.0.1.tar.gz"],
    )
