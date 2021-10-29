const path = require('path');
const { webpack } = require('webpack');

webpack(getConfig(['a-3']), (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(stats);
    process.exit(1);
  }
});

function getConfig(externalModules) {
  const config = {
    mode: 'production',
    entry: './index.js',
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    optimization: {
      minimize: false,
    },
    target: 'node12.22',
    externals: async (options) => {
      if (externalModules.includes(options.request)) {
        return `module ${options.request}`;
      }
    },
  };

  return config;
}
