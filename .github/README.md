# Bazel cache

If Bazel behaves weird, change cache version in the secrets.

Why secrets? Because Github actions doesn't support global env variables and we need them in two different workflows.

**Update them also here.**

- BAZELISK_CACHE_VERSION = 2
- BAZEL_CACHE_VERSION = 5
