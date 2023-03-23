# 使用Electron制作豆瓣FM的Mac版

仅通过`Electron`的API`loadURL`实现窗口内嵌套豆瓣FM网址生成app和dmg
[github代码仓库](https://github.com/babytutu/doubanApp)

## 创建项目

```bash
mkdir my-electron-app && cd my-electron-app
npm init
```

安装依赖包

```bash
npm install -D electron
```

### 解决安装依赖失败

新增.npmrc

```
registry = https://registry.npm.taobao.org
ELECTRON_MIRROR = https://npmmirror.com/mirrors/electron/
```

## 核心实现代码

基于[官方文档](https://www.electronjs.org/docs/latest/tutorial/quick-start)，修改部分内容实现，使用`loadURL`加载url即可

```js
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    resizable: false,
    icon: path.join(__dirname, 'img/icon.png')
  })

  // 加载 url
  mainWindow.loadURL('https://fm.douban.com')
```

## DOCK设置

```js
const { app } = require('electron')
const path = require('path')

// dock弹跳效果
setTimeout(() => {
  app.dock.bounce()
}, 5000)

// 设置dock图标
app.dock.setIcon(path.join(__dirname, 'img/icon.png'))
```

## 禁用默认菜单

在app.whenReady()之前调用

```js
// 禁用默认菜单
Menu.setApplicationMenu(null)
```

或者自定义菜单

```js
const menuTemp = [
  {
    label: '设置',
    submenu: [
      {
        label: '关于',
        role: 'about',
      },
      { type: 'separator' },
      {
        label: '退出',
        role: 'quit',
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(menuTemp)
Menu.setApplicationMenu(menu)
```

## 生成app

### 使用 Electron Forge

```
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

### 自定义信息

forge.config.js

调整packagerConfig实现打包app的图标和名称自定义

需要新增img文件夹，准备icon.icns文件作为app的图标

```js
module.exports = {
  packagerConfig: {
    name: '豆瓣FM',
    icon: 'img/icon',
    buildVersion: '2023-03-23',
  },
}
```

### 创建可分发的应用程序

```
npm run package
```

Electron-forge 会创建 out 文件夹


## 生成DMG文件

直接使用maker-dmg打包生成的部分自定义参数未生效，调整为直接使用appdmg实现打包成DMG文件

### 新增依赖包

```bash
yarn add appdmg -D
```

### 新增appdmg.js

```js
const fs = require('fs')
const appdmg = require('appdmg')
const { version } = require('./package.json')
const { packagerConfig: { name } } = require('./forge.config')

const dmgName = `out/${name}@${version}.dmg`
const appPath = `out/${name}-darwin-x64/${name}.app`

const setting = {
  "title": name,
  "icon": "img/icon.icns",
  "icon-size": 100,
  "background": "img/background.png",
  "format": "ULMO",
  "window": {
    "size": {
      "width": 600,
      "height": 400
    },
    "position": {
      "x": 100,
      "y": 100
    }
  },
  "contents": [
    { "x": 150, "y": 240, "type": "file", "path": appPath },
    { "x": 300, "y": 240, "type": "link", "path": "/Applications" },
    { "x": 450, "y": 240, "type": "file", "path": "README.md" }
  ]
}

// 检查是否已生成app文件
if (!fs.existsSync(appPath)) {
  console.log('请先打包app')
  return
}

// 删除已有文件
if (fs.existsSync(dmgName)) {
  fs.unlinkSync(dmgName)
  console.log('删除已有文件并开始打包')
} else {
  console.log('开始打包')
}

const dmg = appdmg({
  target: dmgName,
  basepath: __dirname,
  specification: setting
})

dmg.on('progress', function (info) {
  const {
    title,
    current,
    total,
  } = info
  if (title) {
    console.log(`[${String(current).padStart(2, '0')}/${total}]${title}`)
  }
})

dmg.on('finish', function () {
  // There now is a `test.dmg` file
  console.log('打包已完成')
})

dmg.on('error', function (err) {
  // An error occurred
  console.error('打包失败', err)
})

```

### package.json新增打包脚本

```json
{
  "script": {
    "dmg": "node appdmg.js"
  }
}
```

### 生成dmg文件

```bash
npm run dmg
```
