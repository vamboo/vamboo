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
        test: /\.pug$/,
        exclude: /node_modules/,
        use: 'pug-loader'
      },
      {
        test: /\.ts$/,
        exclude: '/node_modules/',
        use: 'ts-loader'
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
