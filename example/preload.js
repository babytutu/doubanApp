// preload.js

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
  setNotify: (title, body) => ipcRenderer.invoke('setNotify', title, body),
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
})