// pages/home-profile/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    handleGetUser(e) {
        console.log(e);
        wx.getUserProfile({
            desc: 'desc',
            success: (res) => {
                console.log('res', res);
            }
        })
    }
})