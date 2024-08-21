// pages/home-music/index.js
import { rankingStore, rankingMap } from '../../store/index'
import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
import { playerStore } from '../../store/index'
const throttleQueryRect = throttle(queryRect, 500, { trailing: true })

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: "",
        banners: [],
        swiperHeight: "",
        recommendSongs: [],
        hotSongMenu: [],
        recommendSongMenu: [],
        rankings: { 0: {}, 2: {}, 3: {} },
        currentSong: {},
        isPlaying: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getPageData()
        rankingStore.dispatch("getRankingDataAction")
        this.setPlayerStoreListener()
    },

    handleSearchClick() {
        wx.navigateTo({
            url: '/packageDetail/pages/detail-search/index',
        })
    },

    getPageData() {
        getBanners().then(res => {
            this.setData({ banners: res.banners })
        })
        getSongMenu().then(res => {
            this.setData({ hotSongMenu: res.playlists })
        })
        getSongMenu("华语").then(res => {
            this.setData({ recommendSongMenu: res.playlists })
        })
    },

    setPlayerStoreListener() {
        rankingStore.onState("hotRanking", res => {
            if (!res.tracks) return
            const recommendSongs = res.tracks.slice(0, 6)
            this.setData({ recommendSongs })
        })

        rankingStore.onState("newRanking", this.getRankingHandler(0))
        rankingStore.onState("originRanking", this.getRankingHandler(2))
        rankingStore.onState("upRanking", this.getRankingHandler(3))

        playerStore.onStates(['currentSong', 'isPlaying'], ({ currentSong, isPlaying }) => {
            if (currentSong) this.setData({ currentSong })
            if (isPlaying !== undefined) this.setData({ isPlaying })
        })
    },

    // 轮播图加载完成后回调
    handleSwipeLoaded() {
        // 获取图片高度
        throttleQueryRect('.swiper-image').then(res => {
            const [rect] = res
            this.setData({
                swiperHeight: rect.height
            })
        })
    },

    getRankingHandler(idx) {
        return res => {
            if (Object.keys(res).length === 0) return
            const name = res.name
            const coverImgUrl = res.coverImgUrl
            const playCount = res.playCount
            const songList = res.tracks.slice(0, 3)
            const rankingObj = { name, playCount, coverImgUrl, songList }
            const newRankings = { ...this.data.rankings, [idx]: rankingObj }
            this.setData({
                rankings: newRankings
            })
        }
    },

    handleMoreClick() {
        this.navigateToDetailSongPage("hotRanking")
    },

    handleSongItemClick(event) {
        const index = event.currentTarget.dataset.index
        playerStore.setState("playListIndex", index)
        playerStore.setState("playListSongs", this.data.recommendSongs)
    },

    handleRankingItemClick(event) {
        const idx = event.currentTarget.dataset.idx
        this.navigateToDetailSongPage(rankingMap[idx])
    },

    handlePlayBtnClick() {
        playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
    },

    handlePlayBarClick() {
        wx.navigateTo({
            url: '/packagePlayer/pages/music-player/index?id =' + this.data.currentSong.id,
        })
    },

    navigateToDetailSongPage(rankingName) {
        wx.navigateTo({
            url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
        })
    }
})