/**
 * 根据打包日期生成版本号
 * @returns 版本号
 */
const buildVersion = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}

module.exports = {
  packagerConfig: {
    icon: 'img/icon',
    buildVersion: buildVersion(),
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: './img/background.png',
        icon: './img/icon.icns',
      }
    }
  ]
}
