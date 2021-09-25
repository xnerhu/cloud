load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

def nodejs_app(
        name,
        **kwargs):
    nodejs_binary(
        name = name,
        env = {
            "NODE_ENV": "production",
        },
        **kwargs
    )

    nodejs_binary(
        name = name + "_dev",
        env = {
            "NODE_ENV": "development",
        },
        **kwargs
    )
