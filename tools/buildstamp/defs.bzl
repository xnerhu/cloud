def _stamp_impl(ctx):
    stamps = [ctx.version_file]

    args = [
        "--stamp=%s" % sf.path
        for sf in stamps
    ]

    output_file = "stamp.json"

    file = ctx.actions.declare_file(output_file)

    ctx.actions.run(
        executable = ctx.executable._stamper,
        arguments = [
            "--output=%s" % file.path,
        ] + args,
        inputs = stamps + ctx.files.deps,
        tools = [ctx.executable._stamper],
        outputs = [file],
        mnemonic = "Stamp",
    )

    outs = [file]

    return [
        DefaultInfo(
            files = depset(outs),
            runfiles = ctx.runfiles(
                files = outs,
            ),
        ),
    ]

build_stamp = rule(
    implementation = _stamp_impl,
    attrs = {
        "_stamper": attr.label(
            default = Label("//tools/buildstamp:stamper"),
            cfg = "host",
            executable = True,
            allow_files = True,
        ),
        "deps": attr.label_list(allow_files = True),
    },
)
