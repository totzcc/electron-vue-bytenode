import {ipcMain, webContents} from 'electron'

export default class EventBusMain {
  static eventHandler = new Map();

  /**
   * 主线程注册
   */
  static registerOnMainThread () {
    ipcMain.on('event-bus', (e, args) => {
      const {sender} = e
      const {callId, event, data} = args
      this.mainEventHandler(sender, callId, event, data)
    })
    this.registerDefaultHandler()
  }

  /**
   * 注册处理
   * @param name
   * @param funcBody
   */
  static registerEventBusHandler (name, funcBody) {
    this.eventHandler.set(name, funcBody)
  }

  /**
   * 处理请求
   * @param sender
   * @param callId
   * @param event
   * @param data
   */
  static mainEventHandler (sender, callId, event, data) {
    const handleFunc = this.eventHandler.get(event)
    if (handleFunc) {
      handleFunc(data)
        .then((result) => {
          sender.send(callId, { result })
        })
        .catch((error) => {
          sender.send(callId, { error })
        })
    } else {
      sender.send(callId, { error: `event not found ${event}`})
    }
  }

  /**
   * 注册默认处理
   */
  static registerDefaultHandler () {
    this.eventHandler = new Map()

    this.registerEventBusHandler('open-dev-tools', async () => {
      for (let wc of webContents.getAllWebContents()) {
        wc.openDevTools()
      }
      return true
    })
    this.registerEventBusHandler('set-cookies', async (params) => {
      console.log('set-cookies', { params })
      const { wid, clear, list } = params
      const wc = webContents.fromId(wid)
      if (clear) {
        await wc.session.clearHostResolverCache()
        await wc.session.clearCache()
        await wc.session.clearAuthCache()
        await wc.session.clearStorageData()
        await wc.session.clearCodeCaches({})
      }
      for (const item of list) {
        console.log('xxx', {item, list})
        await wc.session.cookies.set(item)
      }
      return true
    })
  }
}
