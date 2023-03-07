# Electron

## 解决安装依赖失败

新增.npmrc

```
registry = https://registry.npm.taobao.org
ELECTRON_MIRROR = https://npmmirror.com/mirrors/electron/
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