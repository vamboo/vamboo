const HtmlWebpackPlugin = require('html-webpack-plugin')
const {LoaderOptionsPlugin} = require('webpack')

module.exports = {
  entry: [
    './src/index.ts'
  ],
  output: {
    path: __dirname + '/static',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: 'source-map-loader'
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: 'pug-loader'
      },
      {
        test: /\.ts$/,
        exclude: '/node_modules/',
        use: 'awesome-typescript-loader'
      },
      {
        test: /\.styl$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'stylus-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.styl']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './static'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    }),
    new LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [require('poststylus')(['autoprefixer'])]
        }
      }
    })
  ]

}
