// pages/music-player/index.js
import { NavigationBarHeight } from '../../../constants/device-const'
import { audioContext, playerStore } from '../../../store/player-store'
const playModeNames = ['order', 'repeat', 'random']
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 歌曲信息
        id: '',
        currentSong: {},
        duration: 0,
        lyricInfos: [],

        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: "",

        // 页面控制
        currentPage: 0, // 0:歌曲 1:歌词
        contentHeight: 0,
        isMusicLyric: 0,
        sliderValue: 0,
        isSliderChanging: false,
        lyricScrollTop: 0,

        // 歌曲控制
        playModeIndex: 0,
        playModeName: "order",
        isPlaying: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { id } = options
        if (id) {
            this.setData({ id })
        }
        this.setPlayerStoreListener()
        const globalData = getApp().globalData
        const screenHeight = globalData.screenHeight
        const statusBarHeight = globalData.statusBarHeight
        const contentHeight = screenHeight - statusBarHeight - NavigationBarHeight
        const deviceRadio = globalData.deviceRadio
        this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })
    },

    handleSwiperChange(event) {
        const current = event.detail.current
        this.setData({ currentPage: current })
    },
    // 进度条改变结束时触发
    handleSliderChange(event) {
        const value = event.detail.value
        const currentTime = this.data.duration * value / 100
        // audioContext.pause()
        audioContext.seek(currentTime / 1000)
        // 改变结束时需要把正在改变的状态去除，使其根据歌曲播放自动变换进度条与时间的状态
        this.setData({ sliderValue: value, isSliderChanging: false, currentTime })
    },
    // 进度条滑动时触发
    handleSliderChanging(event) {
        const value = event.detail.value
        const currentTime = this.data.duration * value / 100
        this.setData({ isSliderChanging: true, currentTime })
    },
    // 播放模式
    handleModeBtnClick() {
        let playModeIndex = (this.data.playModeIndex + 1) % 3
        playerStore.setState('playModeIndex', playModeIndex)
    },

    handlePlayBtnClick() {
        playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
    },

    handlePrevBtnClick() {
        playerStore.dispatch('changeNewMusicAction', false)
    },

    handleNextBtnClick() {
        playerStore.dispatch('changeNewMusicAction')
    },

    setPlayerStoreListener() {
        playerStore.onStates(['currentSong', 'duration', 'lyricInfos'], ({
            currentSong, duration, lyricInfos
        }) => {
            if (currentSong) this.setData({ currentSong })
            if (duration) this.setData({ duration })
            if (lyricInfos) this.setData({ lyricInfos })
        })

        playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({
            currentTime, currentLyricIndex, currentLyricText
        }) => {
            // 正在滑动进度条时不根据歌曲播放进度来设置时间与进度条的值
            if (currentTime && !this.data.isSliderChanging) {
                const sliderValue = currentTime / this.data.duration * 100
                this.setData({ currentTime, sliderValue })
            }
            if (currentLyricIndex) {
                this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
            }
            if (currentLyricText) this.setData({ currentLyricText })
        })

        playerStore.onStates(['playModeIndex', 'isPlaying'], ({
            playModeIndex, isPlaying
        }) => {
            if (playModeIndex !== undefined) {
                this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] })
            }
            if (isPlaying !== undefined) {
                this.setData({ isPlaying })
            }

        })
    },

    handleBackClick() {
        wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },
})