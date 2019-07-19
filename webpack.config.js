const path = require('path');
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = env => {
  return  {
    entry: {
      'svg-progress-steps' : './src/index.js'
    },
    output: {
      filename: `[name].min.js`,
      path: path.resolve(__dirname, env.production ? 'dist' : 'build')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /src/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['env']
            }
          }
        }
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            compress: false,
            ecma: 6,
            mangle: true
          },
          sourceMap: !env.production
        })
      ]
    },
    plugins: [
      new CleanWebpackPlugin()
    ],
    devtool: 'source-map'
  }
};