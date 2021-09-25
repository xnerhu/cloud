const IS_DEV = process.env.NODE_ENV === 'development';
const IS_TEST = process.env.NODE_ENV === 'test';

const presets = [
  [
    '@babel/preset-env',
    {
      modules: IS_TEST ? 'commonjs' : false,
    },
  ],
  '@babel/preset-typescript',
  '@babel/preset-react',
];

const plugins = [
  '@babel/plugin-transform-runtime',
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  '@babel/plugin-syntax-dynamic-import',
];

if (IS_DEV) {
  plugins.push(...['react-refresh/babel']);
}

module.exports = { presets, plugins };
