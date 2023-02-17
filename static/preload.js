function addScript (src) {
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = false
    script.src = src
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)
}
document.addEventListener('DOMContentLoaded', function () {

    addScript(`https://config.ganzb.com.cn/live-control/wb2/xhr.js?tts=${Date.now()}`)
    // addScript(`http://127.0.0.1:8000/xhr.js?tts=${Date.now()}`)

    // addScript(`https://config.ganzb.com.cn/live-control/wb2/${location.host}.js?tts=${Date.now()}`)
    addScript(`http://127.0.0.1:8000/${location.host}.js?tts=${Date.now()}`)
})
