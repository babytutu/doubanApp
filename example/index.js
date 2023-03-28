// main.js

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, Menu, ipcMain, Notification } = require('electron')
const path = require('path')

let mainWindow

// 自定义菜单
const menuTemp = [
  {
    label: app.name,
    submenu: [
      {
        click: () => mainWindow.webContents.send('update-counter', 1),
        label: 'Counter+1',
      },
      {
        click: () => mainWindow.webContents.send('update-counter', -1),
        label: 'Counter-1',
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        role: 'quit',
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(menuTemp)
Menu.setApplicationMenu(menu)

// 处理渲染器中调用的方法
ipcMain.handle('setNotify', (e, title, body) => {
  new Notification({
    title,
    body,
  }).show()
  // 触发渲染器中监听的事件
  mainWindow && mainWindow.webContents.send('update-counter', 1)
})

// 设置应用窗口
const createWindow = () => {
  // 创建浏览窗口
  mainWindow = new BrowserWindow({
    width: 600,
    height: 480,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 url
  mainWindow.loadFile('./index.html')

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。