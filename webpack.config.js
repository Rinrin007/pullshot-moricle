const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: './dist',
    hot: true,
    port: 1234,
  },
  devtool: argv.mode === 'development' ? 'eval-source-map' : false,
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
      {
      test: /\.(png|jpe?g|gif)$/i,
      type: 'asset/resource',
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  resolve: { extensions: ['.ts', '.js'] },
  plugins: [
    new HtmlWebpackPlugin({ template: 'public/index.html' }),
    new CopyPlugin({ patterns: [{ from: 'assets/' }] }),
  ],
  optimization: {
    minimize: argv.mode === 'production',
    minimizer: [new TerserPlugin({ terserOptions: { compress: { drop_console: true } } })],
  },
});
