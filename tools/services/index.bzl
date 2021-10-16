load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")
load("//tools/nodejs:index.bzl", "nodejs_app")

def nodejs_service(
        name,
        service_name,
        data,
        dev_data = [],
        **kwargs):
    nodejs_app(name, data, dev_data, **kwargs)

    nodejs_image(
        name = "image",
        binary = name,
        **kwargs
    )

    container_push(
        name = "image.push",
        format = "Docker",
        image = ":image",
        registry = "registry.gitlab.com",
        repository = "wexond/cloud/{}".format(service_name),
        tag = "{BUILD_TAG}",
        target_compatible_with = select({
            "@platforms//os:windows": [],
            "@platforms//os:osx": ["@platforms//os:osx"],
            "//conditions:default": [
                "@platforms//os:linux",
            ],
        }),
    )
