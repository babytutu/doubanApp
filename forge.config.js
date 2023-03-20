module.exports = {
  packagerConfig: {
    name: '豆瓣FM',
    icon: './icon',
    buildVersion: '2023-03-20',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      /**
       * @see https://github.com/electron/forge/blob/89d0cd290/packages/maker/dmg/src/Config.ts
       */
      config: {
        name: 'doubanFM',
        background: './icon.png',
        format: 'ULFO',
        iconSize: 100,
      },
    },
  ],
}
