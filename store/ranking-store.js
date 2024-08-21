import { HYEventStore } from 'hy-event-store'

import { getTopList, getPlayListDetail } from '../service/api_music'

const rankingMap = {
    0: "newRanking",
    1: "hotRanking",
    2: "originRanking",
    3: "upRanking",
}

const rankingNameArr = ['新歌榜', '热歌榜', '原创榜', '飙升榜']

const rankingStore = new HYEventStore({
    state: {
        newRanking: {},
        hotRanking: {},
        originRanking: {},
        upRanking: {}
    },
    actions: {
        // 0:新歌榜 1:热歌榜 2:原创榜 3:飙升榜
        async getRankingDataAction(ctx) {
            // 由于在线接口旧版已经弃用，所以要先从歌单列表中取出歌单信息，再用歌单信息去请求歌单详情
            // 先从歌单列表中将需要的榜单粗鲁信息提取出来
            let { list = [] } = await getTopList()
            let rankingArr = []
            // 按照我们需要的顺序组装数据
            for (const item of rankingNameArr) {
                let rankingListInfo = list.find(it => it.name == item)
                rankingArr.push(rankingListInfo)
            }
            // 将组装好的榜单id依次调用榜单详情去获取其详情，并放入定义好的map中
            for (let i = 0; i < rankingArr.length; i++) {
                getPlayListDetail(rankingArr[i].id).then(res => {
                    ctx[rankingMap[i]] = res.playlist
                })
            }
        }
    }
})

export { rankingStore, rankingMap } 