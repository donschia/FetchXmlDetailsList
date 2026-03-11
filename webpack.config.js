/* eslint-env node */
const webpack = require('webpack');

module.exports = {
  devtool: "cheap-module-source-map",
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })
  ]
};
