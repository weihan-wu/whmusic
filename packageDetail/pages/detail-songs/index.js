import { rankingStore } from "../../../store/index"

import { getPlayListDetail } from '../../../service/api_music'
import { playerStore } from '../../../store/index'
// pages/detail-songs/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: "",
        ranking: "",
        songInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { ranking, type, id } = options
        this.setData({ type })
        if (type === "menu") {
            getPlayListDetail(id).then(res => {
                this.setData({ songInfo: res.playlist })
            })
        } else if (type === "rank") {
            this.setData({ ranking })
            rankingStore.onState(ranking, this.getRankingDataHanlder)
        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        if (this.data.ranking) {
            rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
        }
    },

    getRankingDataHanlder(res) {
        console.log(res);
        this.setData({ songInfo: res })
    },

    handleSongItemClick(event){
        const index = event.currentTarget.dataset.index
        playerStore.setState("playListIndex", index)
        playerStore.setState("playListSongs", this.data.songInfo.trackIds)
    }

})