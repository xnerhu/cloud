load("@build_bazel_rules_nodejs//:index.bzl", _pkg_npm = "pkg_npm")

def pkg_npm(
        substitutions = {},
        **kwargs):
    _substitions = {
        "0.0.0-PLACEHOLDER": "{BUILD_TAG}",
    }

    _substitions.update(substitutions)

    _pkg_npm(
        substitutions = _substitions,
        **kwargs
    )
