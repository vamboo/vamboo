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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
              sourceMap: true,
              getLocalIdent: ({resourcePath}, _, className) => {
                const relativeFilePath = resourcePath.replace(`${__dirname}/`, '')
                return `${relativeFilePath}/${className}`
              }
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
    extensions: ['.ts', '.js', '.styl', '.css']
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
