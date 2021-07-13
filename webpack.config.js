const path = require('path');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'
  return  {
    entry: {
      'svg-progress-steps' : './src/index.js'
    },
    output: {
      filename: `[name].min.js`,
      path: path.resolve(__dirname, isProd ? 'dist' : 'build')
    },
    module: {
      rules: [
        {
          test: /\.js$/, //Regular expression
          exclude: /(node_modules|bower_components)/, //excluded node_modules
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'] //Preset used for env setup
            }
          }
        }
      ]
    },
    devtool: isProd ? false : 'source-map',
  }
};