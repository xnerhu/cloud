load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

def nodejs_app(
        name,
        data,
        dev_data = [],
        **kwargs):
    nodejs_binary(
        name = name,
        data = data,
        env = {
            "NODE_ENV": "production",
        },
        **kwargs
    )

    nodejs_binary(
        name = name + ".dev",
        data = data + dev_data,
        env = {
            "NODE_ENV": "development",
        },
        tags = ["manual"],
        **kwargs
    )
