const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    background: './src/js/background',
    content: './src/js/content',
    devTools: './src/js/devTools',
    options: './src/js/options',
    popup: './src/js/popup'
  },
  output: {
    filename: './js/[name].js'
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.resolve(__dirname, '../src/js')
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.Tether': 'tether',
      Popper: ['popper.js', 'default']
    })
  ]
};
