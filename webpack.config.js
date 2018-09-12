const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}

const main = {
  entry: './src/main.ts',
  output: {
    filename: 'main.js'
  },
  target: 'electron-main'
}

const renderer = {
  entry: './src/renderer.ts',
  output: {
    filename: 'renderer.js'
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'vamboo'
    })
  ]
}

module.exports = [main, renderer].map(config => ({...config, ...common}))
