const { resolve } = require('path');

const INCLUDE = resolve(__dirname, 'src');

module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.module.rules.unshift({
      test: /\.(png|gif|jpg|woff2|ttf|svg)$/,
      include: INCLUDE,
      use: [
        {
          loader: 'file-loader',
          options: {
            esModule: false,
          },
        },
      ],
    });

    return config;
  },
};
