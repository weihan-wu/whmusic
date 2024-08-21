import whRequest from './index'

export function getSongDetail(ids) {
    return whRequest.get("/song/detail", {
        ids
    })
}

export function getSongLyric(id) {
    return whRequest.get("/lyric", {
        id
    })
}