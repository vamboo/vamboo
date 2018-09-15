const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    chrome: '61'
                  }
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.rs$/,
        use: {
          loader: 'rust-native-wasm-loader',
          options: {
            cargoWeb: true
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
}

const main = {
  entry: './src/main.js',
  output: {
    filename: 'main.js'
  },
  target: 'electron-main'
}

const renderer = {
  entry: './src/renderer.js',
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
