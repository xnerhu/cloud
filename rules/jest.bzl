load("@npm//jest-cli:index.bzl", "jest", _jest_test = "jest_test")
load("//:deps.bzl", "BABEL_DEPS")

def jest_test(
        name,
        srcs,
        deps = [],
        env = {},
        jest_config = "//:jest.config.js",
        coverage = False,
        is_web = False,
        size = "small",
        **kwargs):
    DEPS = deps + [
        "@npm//@types/jest",
        "@npm//jest",
    ]

    templated_args = [
        "--no-cache",
        "--no-watchman",
        "--ci",
        "--colors",
        "--gen_dir=$(GENDIR)",
        "--rule_dir=$(RULEDIR)",
    ]

    if coverage:
        templated_args.extend(["--coverage"])

    templated_args.extend(["--config", "$(rootpath %s)" % jest_config])

    for src in srcs:
        templated_args.extend(["--runTestsByPath", "$(rootpaths %s)" % src])

    test_env = "node"

    if is_web:
        test_env = "web"

        DEPS.extend([
            "@npm//babel-jest",
            "@npm//@testing-library/jest-dom",
            "@npm//@testing-library/react",
            "@npm//@testing-library/user-event",
        ] + BABEL_DEPS)

    data = [jest_config] + srcs + DEPS + [
        "//:jest-reporter.js",
        # "@npm//c8",
    ]

    env.update({
        "TEST_ENVIRONMENT": test_env,
        "NODE_ENV": "test",
    })

    _jest_test(
        name = name,
        data = data,
        templated_args = templated_args,
        env = env,
        size = size,
        **kwargs
    )

    # This rule is used specifically to update snapshots via `bazel run`
    jest(
        name = "%s.update" % name,
        data = data,
        templated_args = templated_args + ["-u"],
        **kwargs
    )
