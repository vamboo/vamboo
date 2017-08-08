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
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              sourceMap: true
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
  devtool: 'source-map',
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
