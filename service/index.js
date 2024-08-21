import { token_key } from '../constants/token-const'
const token = wx.getStorageSync(token_key)
// const BASE_URL = "http://123.207.32.32:9000" // 旧版API
const LOGIN_SERVER = "http://123.207.32.32:3000"

const BASE_URL = "http://localhost:3000" // 新版API
// const BASE_URL = "http://192.168.50.62:3000" // 新版API：局域网调试

class WHRequest {
    constructor(baseUrl, authHeader = {}) {
        this.baseUrl = baseUrl
        this.authHeader = authHeader
    }
    request(url, method, params, isAuth = false, header = {}) {
        const requestHeader = isAuth ? { ...this.authHeader, header } : header
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                method,
                header: requestHeader,
                data: params,
                success: (res) => {
                    resolve(res.data)
                },
                fail: reject
            })
        })
    }

    get(url, params, isAuth = false, header) {
        return this.request(url, "GET", params, isAuth, header)
    }
    post(url, data, isAuth = false, header) {
        return this.request(url, "POST", data, isAuth, header)
    }
}

export default new WHRequest(BASE_URL)

const loginRequest = new WHRequest(LOGIN_SERVER, { token })
export {
    loginRequest
}