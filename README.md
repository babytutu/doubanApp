# Electron

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

### 创建可分发的应用程序

```
npm run make
```

Electron-forge 会创建 out 文件夹

### 自定义信息

forge.config.js

调整packagerConfig实现打包app的图标和名称自定义

```js
module.exports = {
  packagerConfig: {
    icon: 'icon.png',
    name: '豆瓣FM',
  },
}
```
