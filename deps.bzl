BABEL_BASE_DEPS = [
    "@npm//@babel/plugin-proposal-decorators",
    "@npm//@babel/plugin-syntax-dynamic-import",
    "@npm//@babel/plugin-transform-runtime",
    "@npm//@babel/preset-env",
    "@npm//@babel/preset-typescript",
    "@npm//@babel/plugin-proposal-class-properties",
    "@npm//babel-plugin-transform-typescript-metadata",
]

BABEL_WEB_DEPS = [
    "@npm//@babel/preset-react",
]

WEBPACK_DEPS = [
    "@npm//html-webpack-plugin",
    "@npm//webpack-dev-server",
    "@npm//webpack-merge",
    "@npm//terser-webpack-plugin",
    "@npm//@types/webpack-dev-server",
    "@npm//typescript-require",
    "@npm//@pmmmwh/react-refresh-webpack-plugin",
    "@npm//react-refresh",
    "@npm//ts-node",
]

JEST_DEPS = [
    "@npm//@types/jest",
    "@npm//supertest",
    "@npm//@types/supertest",
    "@npm//c8",
    "@npm//babel-jest",
]
