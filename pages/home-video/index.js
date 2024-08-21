// pages/home-video/index.js
import { getTopMV } from '../../service/api_video.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topMvs: [],
        hasMore: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.getTopMVData(0)
    },
    /**
     * 获取列表数据
     * @param {Number} offset 数据偏移量
     */
    async getTopMVData(offset) {
        // 当没有更多数据时，不进行请求
        if (!this.data.hasMore && offset !== 0) return

        wx.showNavigationBarLoading()
        const res = await getTopMV(offset)
        let newData = this.data.topMvs
        if (offset == 0) {
            newData = res.data
        } else {
            newData = [...newData, ...res.data]
        }
        this.setData({
            topMvs: newData,
            hasMore: res.hasMore
        })
        wx.hideNavigationBarLoading()
        // 停止下拉动画
        wx.stopPullDownRefresh()
    },

    handleVideoItemClick(target) {
        const id = target.currentTarget.dataset.item.id
        wx.navigateTo({
            url: '/packageDetail/pages/detail-video/index?id=' + id,
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    async onReachBottom() {
        this.getTopMVData(this.data.topMvs.length)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {
        this.getTopMVData(0)
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
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})