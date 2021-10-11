const IS_DEV = process.env.NODE_ENV === "development";
const IS_TEST = process.env.NODE_ENV === "test";
const IS_WEB = process.env.TEST_ENVIRONMENT === "web";

const presets = [
  [
    "@babel/preset-env",
    {
      loose: true,
      targets: {
        esmodules: true,
      },
    },
  ],
  "@babel/preset-typescript",
  ...(IS_WEB ? ["@babel/preset-react"] : []),
];

const plugins = [
  "babel-plugin-transform-typescript-metadata",
  ["@babel/plugin-proposal-decorators", { legacy: true }],
  "@babel/plugin-transform-runtime",
  ["@babel/plugin-proposal-class-properties", { loose: true }],
  "@babel/plugin-syntax-dynamic-import",
];

if (IS_DEV) {
  if (IS_WEB) {
    plugins.push(...["react-refresh/babel"]);
  }
}

module.exports = { plugins, presets };
