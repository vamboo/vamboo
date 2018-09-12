import * as path from 'path'
import {app, BrowserWindow} from 'electron'

app.on('ready', () => {
  const window = new BrowserWindow({width: 800, height: 600})
  window.loadFile(path.resolve('dist/index.html'))
})
