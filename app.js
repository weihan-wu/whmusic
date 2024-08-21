// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api_login'
import { token_key } from './constants/token-const'
App({
    globalData: {
        screenWidth: 0,
        screenHeight: 0,
        statusBarHeight: 0,
        navigationBarHeight: 44,
        deviceRadio: 0
    },
    async onLaunch() {
        const info = wx.getSystemInfoSync()
        this.globalData.screenWidth = info.screenWidth
        this.globalData.screenHeight = info.screenHeight
        this.globalData.statusBarHeight = info.statusBarHeight
        // 屏幕宽高比
        const deviceRadio = info.screenHeight / info.screenWidth
        this.globalData.deviceRadio = deviceRadio

        this.handleLoging()
    },

    async handleLoging() {
        // 用户无感登陆
        const token = wx.getStorageSync(token_key)
        // 检查token是否过期
        const checkRes = await checkToken()
        // 检查session是否过期
        const isSessionExpire = await checkSession()
        if (!token || checkRes.errorCode || !isSessionExpire) {
            this.loginAction()
        }
    },

    async loginAction() {
        const code = await getLoginCode()
        const result = await codeToToken(code)
        const token = result.token
        wx.setStorageSync(token_key, token)
    }
})