const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'standalone.min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: "commonjs2"
  },
  devServer: {
    contentBase: './dist',
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/
    })]
  }
};
