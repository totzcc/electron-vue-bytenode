console.log('www.baidu.com.js')
async function getLoginUser() {
    const username = document.querySelector('div[class^=siderbar-name]')
    if (username) {
        return {
            username: username.textContent.trim(),
            isLogin: true
        }
    }
}
