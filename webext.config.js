const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: (config) => {
    config.output.hashFunction = 'sha256';
    config.output.filename = '[name].js';
    config.entry = {
      'content-script': './content-script.js'
    };
    config.resolve = {
      extensions: ['.js', '.json']
    };
    config.plugins.push(new CleanWebpackPlugin());
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          { from: './manifest.json', to: './' },
          { from: './content-script.css', to: './' },
          { from: './_locales', to: './_locales' },
          { from: './images', to: './images' },
          { from: './scripts/launcher.js', to: './' },
          {
            from: '../node_modules/webextension-polyfill/dist/browser-polyfill.js',
            to: './'
          }
        ]
      })
    );

    console.dir(config);
    return config;
  }
};
