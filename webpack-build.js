const path = require('path');
const {
  ProfilingPlugin,
} = require('next/dist/build/webpack/plugins/profiling-plugin');
const { trace } = require('next/dist/trace');
const { init } = require('next/dist/compiled/webpack/webpack');
init();
const { webpack } = require('next/dist/compiled/webpack/webpack');
const enhancedResolve = require('enhanced-resolve');
const CWD = process.cwd();

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
    target: 'node',
    plugins: [
      new ProfilingPlugin({
        runWebpackSpan: trace('hot-reloader'),
      }),
    ],
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
          include: getMatcher(['a-1', 'a-2']),
          type: 'javascript/auto',
        },
      ],
    },
  };

  return config;
}

function getMatcher(modules) {
  const createWebpackMatcher = (modulesToTranspile) => {
    const modulePathsWithDepth = modulesToTranspile.map((modulePath) => [
      modulePath,
      (modulePath.match(/node_modules/g) || []).length,
    ]);

    return (filePath) => {
      const nodeModulesDepth = (filePath.match(/node_modules/g) || []).length;

      return modulePathsWithDepth.some(([modulePath, moduleDepth]) => {
        const transpiled =
          filePath.startsWith(modulePath) && nodeModulesDepth === moduleDepth;
        if (transpiled) console.log(`transpiled: ${filePath}`);
        return transpiled;
      });
    };
  };

  const resolve = enhancedResolve.create.sync({
    symlinks: true,
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.mjs',
      '.css',
      '.scss',
      '.sass',
    ],
    mainFields: ['main', 'module', 'source'],
    conditionNames: ['require'],
    exportsFields: [],
  });

  const getPackageRootDirectory = (module) => {
    try {
      packageLookupDirectory = resolve(CWD, path.join(module, 'package.json'));
      return path.dirname(packageLookupDirectory);
    } catch (err) {
      throw new Error(
        `next-transpile-modules - an unexpected error happened when trying to resolve "${module}". Are you sure the name of the module you are trying to transpile is correct, and it has a package.json with a "main" or an "exports" field?\n${err}`
      );
    }
  };

  return createWebpackMatcher(modules.map(getPackageRootDirectory));
}
