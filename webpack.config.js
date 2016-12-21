let webpack = require('webpack');
let path = require('path');

module.exports = {
  entry: './index.ts',
  output: {
    path: './dist',
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: true },
      output: { comments: false },
      sourceMap: true
    })
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js']
  },

  devtool: 'source-map'
};
