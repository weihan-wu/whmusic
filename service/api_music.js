import whRequest from './index'

export function getBanners(type = 2) {
    return whRequest.get("/banner", {
        type
    })
}

// 旧版获取榜单接口(由于在线接口出问题所以弃用)
export function getRankings(idx) {
    return whRequest.get("/top/list", {
        idx
    })
}

// 新版获取所有榜单接口
export function getTopList() {
    return whRequest.get("/toplist")
}

// 获取某个榜单的详情接口
export function getPlayListDetail(id) {
    return whRequest.get("/playlist/detail", {
        id
    })
}

export function getSongMenu(cat = '全部', limit = 6, offset = 0) {
    return whRequest.get("/top/playlist", {
        cat,
        limit,
        offset
    })
}