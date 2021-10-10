def _resolve_stamp(ctx, output):
    stamps = [ctx.version_file]
    stamp_args = [
        "--stamp-info-file=%s" % sf.path
        for sf in stamps
    ]

    ctx.actions.run(
        executable = ctx.executable._stamper,
        arguments = [
            "--output=%s" % output.path,
        ] + stamp_args,
        inputs = stamps + ctx.files.deps,
        tools = [ctx.executable._stamper],
        outputs = [output],
        mnemonic = "Stamp",
    )

def _stamp_impl(ctx):
    stamp_files = []

    for key in ctx.attr.stamp_keys:
        file_name = "STAMP_" + key

        stamp_file = ctx.actions.declare_file(file_name)
        stamp_files.append(stamp_file)
        _resolve_stamp(ctx, stamp_file)

    return [
        DefaultInfo(
            files = depset(stamp_files),
            runfiles = ctx.runfiles(
                files = stamp_files,
            ),
        ),
    ]

build_stamp = rule(
    implementation = _stamp_impl,
    attrs = {
        "stamp_keys": attr.string_list(),
        "_stamper": attr.label(
            default = Label("//tools/buildstamp:stamper"),
            cfg = "host",
            executable = True,
            allow_files = True,
        ),
        "deps": attr.label_list(allow_files = True),
    },
)
