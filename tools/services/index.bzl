load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_image", "container_push")
load("//tools/nodejs:index.bzl", "nodejs_app")

def nodejs_service(
        name,
        service_name,
        data,
        port = "80/tcp",
        dev_data = [],
        **kwargs):
    nodejs_app(name, data, dev_data, **kwargs)

    container_image(
        name = "image.base",
        base = "@nodejs_image_base//image",
        ports = [port],
        stamp = True,
    )

    nodejs_image(
        name = "image",
        binary = name,
        base = "image.base",
        tags = ["manual"],
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
        tags = ["manual"],
    )
