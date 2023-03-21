const fs = require('fs')
const appdmg = require('appdmg')

const dmgName = 'out/doubanFM.dmg'

const setting = {
  "title": "doubanFM",
  "icon": "img/icon.icns",
  "icon-size": 100,
  "background": "img/BingWallpaper.jpg",
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
    { "x": 150, "y": 100, "type": "file", "path": "out/豆瓣FM-darwin-x64/豆瓣FM.app" },
    { "x": 300, "y": 100, "type": "link", "path": "/Applications" },
    { "x": 450, "y": 100, "type": "file", "path": "README.md" }
  ]
}

if (!fs.existsSync('out/豆瓣FM-darwin-x64/豆瓣FM.app')) {
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
