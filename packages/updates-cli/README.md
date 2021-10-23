## Dev

```bash
$ bazel run //packages/updates-cli -- -- help

$ bazel run //packages/updates-cli -- -- publish -x xd --api=http://localhost:3000 --tag 4.0.0 --channel stable --notes xdd --os windows --architecture "x64" --path C:\Users\xnerhu\Desktop\files\6.0.5.2.packed.7z --ignore_hash
```

## Publish

```bash
$ bazel run //packages/updates-cli:npm.publish -- --
```
