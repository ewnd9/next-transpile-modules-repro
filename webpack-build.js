const path = require('path');
const {
  ProfilingPlugin,
} = require('next/dist/build/webpack/plugins/profiling-plugin');
const { trace } = require('next/dist/trace');
const { init } = require('next/dist/compiled/webpack/webpack');
init();
const { webpack } = require('next/dist/compiled/webpack/webpack');

webpack(getConfig(), (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(stats);
    process.exit(1);
  }
});

function getConfig() {
  const config = {
    mode: 'production',
    entry: './webpack-entry.js',
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    optimization: {
      minimize: false,
    },
    target: 'node12.22',
    plugins: [
      new ProfilingPlugin({
        runWebpackSpan: trace('hot-reloader'),
      }),
    ],
    externals: async (options) => {
      if (['a-3'].includes(options.request)) {
        return `module ${options.request}`;
      }
    },
    module: {
      rules: [
        {
          test: /\.js/,
          use: {
            loader: require.resolve(
              'next/dist/build/webpack/loaders/next-swc-loader'
            ),
            options: {
              isServer: true,
              pagesDir: `${__dirname}/src/pages`,
              hasReactRefresh: false,
            },
          },
          type: 'javascript/auto',
        },
      ],
    },
  };

  return config;
}
