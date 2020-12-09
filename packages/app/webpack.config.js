const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
var copyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const bundleOutputDir = './dist';

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);
  const analyzeBundle = env && env.analyze;

  // call dotenv and it will return an Object with a parsed key 
  const dotEnv = isDevBuild ? dotenv.config( {path: './.env.development'}).parsed : dotenv.config().parsed;
  
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(dotEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(dotEnv[next]);
    return prev;
  }, {});

  const plugins = [new webpack.DefinePlugin(envKeys)];
  if (isDevBuild) {
    plugins.push(new webpack.SourceMapDevToolPlugin(), new copyWebpackPlugin([{ from: 'dev/' }]));
  } else {
    plugins.push(new webpack.DefinePlugin(envKeys));
  }

  if (analyzeBundle) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return [{
    entry: './src/index.ts',
    output: {
      filename: 'widget.js',
      path: path.resolve(bundleOutputDir)
    },
    devServer: {
      host: '0.0.0.0',//your ip address
      port: 8080,
      disableHostCheck: true,
      contentBase: bundleOutputDir,
    },
    plugins: plugins,
    optimization: {
      minimize: !isDevBuild,
      nodeEnv: 'production'
    },
    mode: isDevBuild ? 'development' : 'production',
    module: {
      rules: [
        // packs PNG's discovered in url() into bundle
        { 
          test: /\.(jpe?g|png|webp)$/i,
          use: [ 
            {
              loader: 'responsive-loader',
              options: { 
                adapter: require('responsive-loader/sharp'),
                sizes: [160, 320, 640, 960, 1280],
                name: '[path][name]-[width].[ext]'
              }
            }
          ]
        },
        // packs SVG's discovered in url() into bundle
        { test: /\.svg/, use: 'svg-url-loader' },
        {
          test: /\.(css|scss)$/i,
          use: [
            {
              loader: 'style-loader',
              options: { injectType: 'singletonStyleTag' }
            },
            {
              // allows import CSS as modules
              loader: 'css-loader',
              options: {
                modules: {
                  // css class names format
                  localIdentName: '[name]-[local]-[hash:base64:5]'
                },
                sourceMap: isDevBuild
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            }
          ]
        },
        // use babel-loader for TS and JS modeles,
        // starting v7 Babel babel-loader can transpile TS into JS,
        // so no need for ts-loader
        // note, that in dev we still use tsc for type checking
        {
          test: /\.(js|ts|tsx|jsx)$/,
          include: "/node_modules/@vestico/common",
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    'targets': {
                      'browsers': ['IE 11, last 2 versions']
                    },
                    // makes usage of @babel/polyfill because of IE11
                    // there is at least async functions and for..of
                    useBuiltIns: 'usage',
                    corejs: { version: 3, proposals: true }
                  }],
                  [
                    // enable transpiling ts => js
                    "@babel/typescript",
                    // tell babel to compile JSX using into Preact
                    { jsxPragma: "h" }
                  ]
                ],
                'plugins': [
                  // syntax sugar found in React components
                  '@babel/proposal-class-properties',
                  '@babel/proposal-object-rest-spread',
                  // transpile JSX/TSX to JS
                  ['@babel/plugin-transform-react-jsx', {
                    // we use Preact, which has `Preact.h` instead of `React.createElement`
                    pragma: 'h',
                    pragmaFrag: 'Fragment'
                  }]
                ]
              }
            }
          ]
        }]
    },
    resolve: {
      extensions: ['*', '.js', '.ts', '.tsx'],
      alias: {
        "react": "preact/compat",
        "react-dom": "preact/compat",
        "preact": path.resolve(__dirname, 'node_modules', 'preact'),
        "preact/hooks": path.resolve(__dirname, 'node_modules', 'preact', 'hooks')
      }
    }
  }];
};
