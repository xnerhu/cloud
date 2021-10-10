load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_test")
load("//tools/jest:index.bzl", "jest_test")
load("//tools/buildstamp:defs.bzl", "build_stamp")

def test_suite(
        name,
        srcs,
        deps = [],
        env = {},
        coverage = False,
        is_web = False,
        e2e = False,
        size = "medium",
        **kwargs):
    jest_test_name = name + "_jest"

    jest_test(
        name = jest_test_name,
        srcs = srcs,
        coverage = coverage,
        is_web = is_web,
        e2e = e2e,
        size = size,
        deps = deps,
        env = env,
    )

    if coverage:
        build_stamp(
            name = "build_stamp",
            deps = srcs + ["//tools/tests:components"],
        )

        nodejs_test(
            name = name,
            templated_args = [native.package_name()],
            data = [
                jest_test_name,
                "//tools/tests:codecov_bin",
                "//tools/tests:components",
                ":build_stamp",
            ],
            entry_point = "//tools/tests:run_tests.ts",
        )
