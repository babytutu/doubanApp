# 使用Electron制作豆瓣FM的Mac版

## 解决安装依赖失败

新增.npmrc

```
registry = https://registry.npm.taobao.org
ELECTRON_MIRROR = https://npmmirror.com/mirrors/electron/
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
app.dock.setIcon(path.join(__dirname, 'icon.png'))
```

## 打包

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
    buildVersion: '2023-03-20',
  },
}
```

### 创建可分发的应用程序

```
npm run package
```

Electron-forge 会创建 out 文件夹


### 打包成DMG文件

使用appdmg实现打包成DMG文件

#### 新增依赖包

```bash
yarn add appdmg -D
```

#### 新增appdmg.js

```js
const fs = require('fs')
const appdmg = require('appdmg')

const dmgName = 'out/doubanFM.dmg'

const setting = {
  "title": "doubanFM",
  "icon": "img/icon.icns",
  "icon-size": 100,
  "format": "ULMO",
  "window": {
    "size": {
      "width": 600,
      "height": 400
    }
  },
  "contents": [
    { "x": 150, "y": 100, "type": "file", "path": "./out/豆瓣FM-darwin-x64/豆瓣FM.app" },
    { "x": 300, "y": 100, "type": "link", "path": "/Applications" },
    { "x": 450, "y": 100, "type": "file", "path": "README.md" }
  ]
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

#### package.json新增打包脚本

```json
{
  "script": {
    "dmg": "node appdmg.js"
  }
}
```

#### 生成dmg文件

```bash
npm run dmg
```
