import { ipcRenderer } from 'electron'

class EventBusRenderer {
  static postRenderEvent (event, data) {
    return new Promise((resolve, reject) => {
      const callId = `${Math.random()}`
      ipcRenderer.send('event-bus', { event, callId, data })
      ipcRenderer.once(callId, (sender, response) => {
        if (response.error) {
          reject(new Error(response.error))
        } else {
          resolve(response.result)
        }
      })
    })
  }
}
export default EventBusRenderer
