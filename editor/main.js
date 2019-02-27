const path = require('path')
const {app, BrowserWindow} = require('electron')

app.on('ready', () => {
  const window = new BrowserWindow({width: 800, height: 600})
  window.loadFile(path.resolve('dist/index.html'))
})
