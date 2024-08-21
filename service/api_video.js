import whRequest from './index'

/**
 * 获取MV列表
 * @param {Number} offset 列表数据偏移量
 * @param {Number} limit 每页数据数量（默认10条）
 */
export function getTopMV(offset, limit = 10) {
    return whRequest.get('/top/mv', {
        offset, limit
    })
}

/**
 * 获取MV的URL
 * @param {String｜Number} id MV的id
 */
export function getMVURL(id) {
    return whRequest.get("/mv/url", {
        id
    })
}

/**
 * 获取MV的详情
 * @param {String|Number} mvid MV的id
 */
export function getMVDetail(mvid) {
    return whRequest.get("/mv/detail", {
        mvid
    })
}

/**
 * 获取MV相关视频
 * @param {String|Number} id MV的id
 */
export function getRelatedVideo(id) {
    return whRequest.get("/related/allvideo", {
        id
    })
}