<template>
<div class="container">
  <webview ref="webview" src="about:blank" class="container" :preload="preload" disablewebsecurity />
</div>
</template>

<script>
import {webFrame} from 'electron'
import EventBusRenderer from "../util/event-bus-renderer";

export default {
  name: "WebBaiduLive",
  data() {
    return {
      preload: '',
      cookieList: [[]]
    }
  },
  created() {
    this.preload = `file://${__static}/preload.js`
  },
  mounted() {
    this.$refs.webview.addEventListener('dom-ready', () => {
      this.onWebviewReady(this.$refs.webview)
    })
  },
  methods: {
    onWebviewReady(webview) {
      if (webview.loaded) {
        return
      }
      webFrame.setZoomFactor(1)
      webview.loaded = true
      this.fillWebCookie(webview)
      // EventBusRenderer.postRenderEvent('open-dev-tools')
    },
    getRandomCookie() {
      return this.cookieList.splice(0, 1)[0]
    },
    async fillWebCookie(webview, retry=1) {
      if (retry < 0) {
        return
      }
      const list = this.getRandomCookie()
      await EventBusRenderer.postRenderEvent('set-cookies', {
        wid: webview.getWebContentsId(),
        clear: true,
        list: list
      })
      await webview.loadURL('https://www.baidu.com/my/index')
      setTimeout(() => {
        webview.executeJavaScript('getLoginUser()').then((profile) => {
          console.log('getLoginUser', { profile })
        }).catch((e) => {
          console.log('getLoginUser error', { e })
          this.fillWebCookie(webview, retry - 1)
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>

</style>
