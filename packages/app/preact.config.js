import { resolve } from "path";
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
var copyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

export default {
  /**
  * Function that mutates the original webpack config.
  * Supports asynchronous changes when a promise is returned (or it's an async function).
  *
  * @param {object} config - original webpack config.
  * @param {object} env - options passed to the CLI.
  * @param {WebpackConfigHelpers} helpers - object with useful helpers for working with the webpack config.
  * @param {object} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
  **/
  webpack(config, env, helpers, options) {
    
    const isDevBuild = !(env && env.prod);
    const analyzeBundle = env && env.analyze;


    const css_rule = config.module.rules[4];
    const css_rule_2 = config.module.rules[5];

    // ORIG
    css_rule.use.splice(1, 0, {
      loader: "@teamsupercell/typings-for-css-modules-loader",
      options: {
        banner:
        "// This file is automatically generated from your CSS. Any edits will be overwritten.",
        disableLocalsExport: true
      }
    });

    // // PORTED FROM WEBPACK
    // css_rule.use.splice(0, 0, {
    //   loader: 'style-loader',
    //   options: { injectType: 'singletonStyleTag' }
    // });
    // css_rule_2.use.splice(0, 0, {
    //   loader: 'style-loader',
    //   options: { injectType: 'singletonStyleTag' }
    // });

    // css_rule.use.splice(1, 0, {
    //   // allows import CSS as modules
    //   loader: 'css-loader',
    //   options: {
    //     modules: {
    //       // css class names format
    //       localIdentName: '[name]-[local]-[hash:base64:5]'
    //     },
    //     sourceMap: isDevBuild
    //   }
    // });
    // css_rule.use.push({
    //   loader: 'sass-loader',
    //   options: {
    //     sourceMap: true,
    //   },
    // });
    // css_rule_2.use.splice(1, 0, {
    //   // allows import CSS as modules
    //   loader: 'css-loader',
    //   options: {
    //     modules: {
    //       // css class names format
    //       localIdentName: '[name]-[local]-[hash:base64:5]'
    //     },
    //     sourceMap: isDevBuild
    //   }
    // });
    // css_rule_2.use.push({
    //   loader: 'sass-loader',
    //   options: {
    //     sourceMap: true,
    //   },
    // });

    css_rule.include = [
      path.resolve(__dirname, 'src', 'routes'),
      path.resolve(__dirname, 'src', 'components'),
      path.resolve(__dirname, 'node_modules', '@vestico', 'common', 'lib')
    ];

    config.module.rules[5].exclude = [
      path.resolve(__dirname, 'src', 'routes'),
      path.resolve(__dirname, 'src', 'components'),
      path.resolve(__dirname, 'node_modules', '@vestico', 'common', 'lib')
    ];

    config.module.rules[4] = css_rule;

    const customRules = [
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
        
        // use babel-loader for TS and JS modeles,
        // starting v7 Babel babel-loader can transpile TS into JS,
        // so no need for ts-loader
        // note, that in dev we still use tsc for type checking
        // {
        //   test: /\.(js|ts|tsx|jsx)$/,
        //   exclude: /node_modules/,
        //   use: [
        //     {
        //       loader: 'babel-loader',
        //       options: {
        //         presets: [
        //           ['@babel/preset-env', {
        //             'targets': {
        //               'browsers': ['IE 11, last 2 versions']
        //             },
        //             // makes usage of @babel/polyfill because of IE11
        //             // there is at least async functions and for..of
        //             useBuiltIns: 'usage',
        //             corejs: { version: 3, proposals: true }
        //           }],
        //           [
        //             // enable transpiling ts => js
        //             "@babel/typescript",
        //             // tell babel to compile JSX using into Preact
        //             { jsxPragma: "h" }
        //           ]
        //         ],
        //         'plugins': [
        //           // syntax sugar found in React components
        //           '@babel/proposal-class-properties',
        //           '@babel/proposal-object-rest-spread',
        //           // transpile JSX/TSX to JS
        //           ['@babel/plugin-transform-react-jsx', {
        //             // we use Preact, which has `Preact.h` instead of `React.createElement`
        //             pragma: 'h',
        //             pragmaFrag: 'Fragment'
        //           }]
        //         ]
        //       }
        //     }
        //   ]
        // }
      ];
      config.module.rules.push(...customRules)
      
      // Use any `index` file, not just index.js
      config.resolve.alias["preact-cli-entrypoint"] = resolve(
        process.cwd(),
        "src",
        "index"
      );
      config.resolve.extensions = ['*', '.js', '.ts', '.tsx'];
      config.resolve.alias["react"] = "preact/compat";
      config.resolve.alias["react-dom"] = "preact/compat";
      config.resolve.alias["preact"] = path.resolve(__dirname, 'node_modules', 'preact');
      config.resolve.alias["preact/hooks"] = path.resolve(__dirname, 'node_modules', 'preact', 'hooks');
      }
    };
    