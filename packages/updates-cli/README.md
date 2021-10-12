# Dev

```bash
$ bazel run //packages/updates-cli -- -- --patch=PATH
```

bazel run //packages/updates-cli -- -- distribution -x xd --api=http://localhost:3000 --os=windows --os_version=any --architecture=x64

bazel run //packages/updates-cli -- -- diff -x xd --api=http://localhost:3000 -t 5.0.0 -c stable -d 1

bazel run //packages/updates-cli -- -- patch -p C:\Users\xnerhu\Desktop\files\wexond.7z -pl C:\Users\xnerhu\AppData\Local\Temp\dbafadbdeb61f6d46480ba25\wexond.7z -o C:\Users\xnerhu\AppData\Local\Temp\dbafadbdeb61f6d46480ba25\xdddd.patch

bazel run //packages/updates-cli -- -- upload -x xd --api=http://localhost:3000 -p C:\Users\xnerhu\AppData\Local\Temp\dbafadbdeb61f6d46480ba25\xdddd.patch -f C:\Users\xnerhu\Desktop\files\6.0.5.2.packed.7z -d 1 -r 9

bazel run //packages/updates-cli -- -- publish -x xd --api=http://localhost:3000 -t 4.0.0 -c stable -n xdd -o windows -a x64 -p C:\Users\xnerhu\Desktop\files\6.0.5.2.packed.7z
