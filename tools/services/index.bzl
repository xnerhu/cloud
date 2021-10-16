load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")
load("//tools/nodejs:index.bzl", "nodejs_app")

def nodejs_service(
        name,
        data,
        dev_data = [],
        **kwargs):
    nodejs_app(name, data, dev_data, **kwargs)

    nodejs_image(
        name = "image",
        # binary = name,
        data = data,
        env = {
            "NODE_ENV": "production",
        },
        **kwargs
    )

    container_push(
        name = "image.push",
        format = "Docker",
        image = ":image",
        registry = "registry.gitlab.com",
        repository = "wexond/cloud/xd",
        tag = "1.1.2",
        target_compatible_with = select({
            "@platforms//os:windows": [],
            "@platforms//os:osx": ["@platforms//os:osx"],
            "//conditions:default": [
                "@platforms//os:linux",
            ],
        }),
    )
