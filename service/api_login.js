import whRequest from './index'
import { loginRequest } from './index'

export function getLoginCode() {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 1000,
            success: res => {
                const code = res.code
                resolve(code)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

export function codeToToken(code) {
    return loginRequest.post('/login', { code })
}

export function checkToken() {
    return loginRequest.post('/auth', {}, true)
}

export function postFavorRequest(id) {
    return loginRequest.post("/api/favor", { id }, true)
}

export function checkSession() {
    return new Promise((resolve) => {
        wx.checkSession({
            success: () => {
                resolve(true)
            },
            fail: () => {
                resolve(false)
            }
        })
    })
}