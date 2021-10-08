load("@npm//jest-cli:index.bzl", "jest", _jest_test = "jest_test")
load("//:deps.bzl", "BABEL_BASE_DEPS", "BABEL_WEB_DEPS", "JEST_DEPS")

def jest_test(
        name,
        srcs,
        deps = [],
        env = {},
        jest_config = "//:jest.config.js",
        coverage = False,
        is_web = False,
        e2e = False,
        size = "small",
        **kwargs):
    DEPS = deps + JEST_DEPS + BABEL_BASE_DEPS

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
            "@npm//@testing-library/jest-dom",
            "@npm//@testing-library/react",
            "@npm//@testing-library/user-event",
        ] + BABEL_WEB_DEPS)

    data = [jest_config] + srcs + DEPS + [
        "//:jest-reporter.js",
        "//:babel.config.js",
        "//:tsconfig.json",
    ]

    _env = {}
    _env.update(env)

    _env.update({
        "TEST_ENVIRONMENT": test_env,
        "NODE_ENV": "test",
    })

    if e2e:
        _env.update({
            "E2E_ENABLED": "true",
        })

    _jest_test(
        name = name,
        data = data,
        templated_args = templated_args,
        env = _env,
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
