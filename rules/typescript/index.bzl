load("@npm//@bazel/typescript:index.bzl", "ts_project")
load("//rules:jest.bzl", "jest_test")

def ts_test(
        name,
        srcs,
        test_srcs,
        tsconfig,
        src_components,
        deps,
        declarations = True,
        **kwargs):
    TEST_DEPS = deps + ["@npm//@types/jest"]

    ts_project(
        name = "test_components",
        srcs = test_srcs,
        deps = TEST_DEPS + src_components,
        composite = True,
        declaration = declarations,
        incremental = True,
        source_map = True,
        tsconfig = tsconfig,
        tags = ["manual"],
        target_compatible_with = select({
            "@platforms//os:osx": [],
            "@platforms//os:linux": [],
            "//conditions:default": ["@platforms//os:linux"],
        }),
    )

    jest_test(
        name = name,
        srcs = [":test_components"],
        target_compatible_with = select({
            "@platforms//os:osx": [],
            "@platforms//os:linux": [],
            "//conditions:default": ["@platforms//os:linux"],
        }),
    )

    ts_project(
        name = "test_components_win",
        srcs = srcs + test_srcs,
        deps = TEST_DEPS,
        composite = True,
        declaration = declarations,
        incremental = True,
        out_dir = "build",
        source_map = True,
        tsconfig = tsconfig,
        tags = ["manual"],
        target_compatible_with = [
            "@platforms//os:windows",
        ],
    )

    jest_test(
        name = name + "_win",
        srcs = [":test_components_win"],
        target_compatible_with = [
            "@platforms//os:windows",
        ],
    )
