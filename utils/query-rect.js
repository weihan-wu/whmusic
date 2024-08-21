export default function (selector) {
    return new Promise((reslove) => {
        const query = wx.createSelectorQuery()
        query.select(selector).boundingClientRect()
        query.exec(reslove)
    })
}