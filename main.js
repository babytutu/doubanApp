// main.js

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, Menu, shell, Tray, nativeImage } = require('electron')
const path = require('path')
const Store = require('electron-store')

const icon = path.join(__dirname, 'img/icon.png')

// 初始化缓存
const schema = {
  showTitle: {
    type: 'boolean',
    default: true
  }
}

const store = new Store({schema})

// 设置顶部图标
let tray

const setTray = () => {
  const image = nativeImage.createFromPath(icon)
  tray = new Tray(image.resize({
    width: 20,
    height: 20
  }))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示标题',
      click: () => {
        store.set('showTitle', true)
        tray.setTitle('豆瓣FM')
      }
    },
    {
      label: '隐藏标题',
      click: () => {
        store.set('showTitle', false)
        tray.setTitle('')
      }
    },
    {
      label: '退出',
      role: 'quit',
    }
  ])
  tray.setContextMenu(contextMenu)
}

// 设置dock图标,macOS
app.dock.setIcon(icon)

// dock弹跳效果
app.dock.bounce()

// 自定义菜单
const menuTemp = [
  {
    label: '设置',
    submenu: [
      {
        label: '关于',
        role: 'about',
      },
      {
        type: 'separator'
      },
      {
        label: '源代码',
        click: () => {
          shell.openExternal('https://github.com/babytutu/doubanApp')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        role: 'quit',
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(menuTemp)
Menu.setApplicationMenu(menu)

// 设置 "关于" 面板选项
app.setAboutPanelOptions({
  credits: '使用Electron制作豆瓣FM的Mac版',
})

// 设置应用窗口
const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 760,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    center: true,
    resizable: false,
    icon: icon, // 应用图标,window
  })

  // 加载 url
  mainWindow.loadURL('https://fm.douban.com')
  // mainWindow.loadFile('index.html')

  mainWindow.on('page-title-updated', (e, title) => {
    // 更新标题到通知区
    if (store.get('showTitle')) {
      tray.setTitle(title)
    } else {
      tray.setTitle('')
    }
  })
  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  setTray()
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