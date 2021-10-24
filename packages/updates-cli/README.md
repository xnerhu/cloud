## Dev

```bash
$ bazel run //packages/updates-cli -- -- help

$ bazel run //packages/updates-cli -- -- publish -x xd --api=http://localhost:3000 --tag 4.0.0 --channel stable --notes xdd --os windows --architecture "x64" --path C:\Users\xnerhu\Desktop\files\6.0.5.2.packed.7z --ignore_hash
```

Create release

$ bazel run //packages/updates-cli -- -- create release -x xd --api=http://localhost:3000 --tag 4.0.0 --channel stable --notes xdd

Fetch diff info

$ bazel run //packages/updates-cli -- -- fetch diff -x xd --api=http://localhost:3000 --tag 4.0.0 --channel stable --os windows --architecture x64

Make patch
$ bazel run //packages/updates-cli -- -- patch --path C:\Users\xnerhu\AppData\Local\Temp\692973fe6029\wexond.7z --path_previous C:\Users\xnerhu\projects\wexond\cloud\.dev\updates_files\files\patches\2.1.0-windows.packed.7z --out C:\Users\xnerhu\Desktop\GENERATED_PATCH.patch

Upload asset
$ bazel run //packages/updates-cli -- -- upload asset -x xd --api=http://localhost:3000 --tag 4.0.0 --channel stable --path C:\Users\xnerhu\Desktop\GENERATED_PATCH.patch

Publish
$ bazel run //packages/updates-cli -- -- publish -x xd --api=http://localhost:3000 --tag 4.0.0 --channel stable --notes lmao --os windows --architecture x64 --path C:\Users\xnerhu\Desktop\2.0.0-windows.packed.7z --installer C:\Users\xnerhu\Desktop\wexond.exe --ignore_hash

Rollout
$ bazel run //packages/updates-cli -- -- release rollout -x xd --api=http://localhost:3000 --tag 4.0.0 --channel stable

## Publish

```bash
$ bazel run //packages/updates-cli:npm.publish -- --
```
