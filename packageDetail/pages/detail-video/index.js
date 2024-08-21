// pages/detail-video/index.js
import { getMVURL, getMVDetail, getRelatedVideo } from '../../../service/api_video'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mvURLInfo: {},
        mvDetail: {},
        relatedVideos: [],
        danmuList: [
            {
                text: '123',
                color: "#ff0000",
                time: 1
            },
            {
                text: '456',
                color: "#fff",
                time: 2
            },
            {
                text: '789',
                color: "#fff",
                time: 10
            }
        ],
        list: Array(100).fill(0).map((item, index) => index)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const id = options.id
        this.getPageData(id)
    },

    getPageData(id) {
        getMVURL(id).then(res => {
            this.setData({ mvURLInfo: res.data })
        })
        getMVDetail(id).then(res => {
            this.setData({ mvDetail: res.data })
        })
        getRelatedVideo(id).then(res => {
            this.setData({ relatedVideos: res.data })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})