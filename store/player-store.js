// 普通播放
// const audioContext = wx.createInnerAudioContext()
// 允许后台播放模式，需要在app.json中配置，并且额外必填项Object.title
const audioContext = wx.getBackgroundAudioManager()
import { getSongLyric, getSongDetail } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'
import { HYEventStore } from 'hy-event-store'

const playerStore = new HYEventStore({
    state: {
        isFirstPlay: true,

        id: 0,
        currentSong: {},
        duration: 0,
        lyricInfos: [],

        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: "",

        isPlaying: false,
        isStoping: false,
        playModeIndex: 0,// 0 列表循环 1 单曲循环 2 随机
        playListSongs: [],
        playListIndex: 0
    },
    actions: {
        playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
            if (id === ctx.id && !isRefresh) {
                return this.dispatch("changeMusicPlayStatusAction", true)
            }
            ctx.id = id
            ctx.isPlaying = true
            // 在播放新歌时先清空上一次歌曲的信息，避免在未加载完毕歌曲时界面还显示上一首歌的信息。
            ctx.currentSong = {}
            ctx.duration = 0
            ctx.lyricInfos = []
            ctx.currentTime = 0
            ctx.currentLyricIndex = 0
            ctx.currentLyricText = ""

            getSongDetail(id).then(res => {
                ctx.currentSong = res.songs[0]
                ctx.duration = res.songs[0].dt
                audioContext.title = res.songs[0].name
            })

            getSongLyric(id).then(res => {
                const lyricString = res.lrc.lyric
                const lyrics = parseLyric(lyricString)
                ctx.lyricInfos = lyrics
            })

            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.title = id
            audioContext.autoplay = true

            if (ctx.isFirstPlay) {
                this.dispatch('setAudioListenerAction')
                ctx.isFirstPlay = false
            }
        },

        setAudioListenerAction(ctx) {
            audioContext.onCanplay(() => {
                audioContext.play()
            })
            audioContext.onTimeUpdate(() => {
                const currentTime = audioContext.currentTime * 1000
                ctx.currentTime = currentTime

                // 根据当前歌曲时间匹配歌词
                if (!ctx.lyricInfos) return
                let i = 0
                for (; i < ctx.lyricInfos.length; i++) {
                    const lyricInfo = ctx.lyricInfos[i];
                    // 当前时间需小小于该句歌词的结束时间
                    if (currentTime < lyricInfo.time) {
                        break
                    }
                }

                // 匹配到歌词进行存储
                const currentIndex = i - 1
                if (ctx.currentLyricIndex !== currentIndex) {
                    const currentLyricInfo = ctx.lyricInfos[currentIndex]
                    ctx.currentLyricIndex = currentIndex
                    ctx.currentLyricText = currentLyricInfo?.text || ''
                }
            })

            // 歌曲播放完毕播放下一首
            audioContext.onEnded(() => {
                this.dispatch("changeNewMusicAction")
            })
            // 在后台操作播放器时同步播放状态
            audioContext.onPlay(() => {
                ctx.isPlaying = true
            })
            audioContext.onPause(() => {
                ctx.isPlaying = false
            })
            audioContext.onStop(() => {
                ctx.isPlaying = false
                ctx.isStoping = true
            })
        },

        changeMusicPlayStatusAction(ctx, isPlaying = true) {
            ctx.isPlaying = isPlaying
            if (ctx.isPlaying && ctx.isStoping) {
                audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
                audioContext.title = ctx.currentSong.name
                // audioContext.seek(ctx.currentTime)
                audioContext.startTime = ctx.currentTime / 1000
                ctx.isStoping = false
            }
            ctx.isPlaying ? audioContext.play() : audioContext.pause()
        },

        changeNewMusicAction(ctx, isNext = true) {
            let currentIndex = ctx.playListIndex

            switch (ctx.playModeIndex) {
                case 0: // 顺序播放
                    // 上一首或下一首
                    let nextIndex = isNext ? currentIndex + 1 : currentIndex - 1
                    // 当为第一首歌时点击上一首则播放最后一首歌
                    if (nextIndex < 0) nextIndex = ctx.playListSongs.length - 1
                    // 对列表长度取余，保证下一首的索引不超出列表
                    currentIndex = nextIndex % ctx.playListSongs.length
                    break;
                case 1: // 单曲循环
                    break;
                case 2: // 随机播放
                    currentIndex = Math.floor(Math.random() * ctx.playListSongs.length)
                    break;
            }

            let currentSong = ctx.playListSongs[currentIndex]
            if (!currentSong) {
                currentSong = ctx.currentSong
            } else {
                ctx.playListIndex = currentIndex
            }

            this.dispatch('playMusicWithSongIdAction', { id: currentSong.id, isRefresh: true })
        }
    }
})

export {
    audioContext, playerStore
}