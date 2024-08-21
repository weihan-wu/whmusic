// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../../service/api_search.js'
import debounce from '../../../utils/debounce'
import stringToNodes from '../../../utils/string2nodes'
const debounceGetSearchSuggest = debounce(getSearchSuggest)
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: "",
        hotKeywords: [],
        suggestSongs: [],
        suggestSongsNodes: [],
        resultSongs: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getPageData()
    },

    getPageData() {
        getSearchHot().then((res) => {
            this.setData({ hotKeywords: res.result.hots })
        })
    },

    handleSearchChange(event) {
        const searchValue = event.detail
        this.setData({ searchValue })
        if (!searchValue.length) {
            this.setData({ suggestSongs: [], resultSongs: [] })
            debounceGetSearchSuggest.cancel()
            return
        }
        debounceGetSearchSuggest(searchValue).then(res => {
            const suggestSongs = res.result?.allMatch || []
            this.setData({ suggestSongs })

            if (!suggestSongs) return
            const suggestKeywords = suggestSongs.map(item => item.keyword)
            const suggestSongsNodes = []
            for (const keyword of suggestKeywords) {
                const nodes = stringToNodes(keyword, searchValue)
                suggestSongsNodes.push(nodes)
            }
            this.setData({ suggestSongsNodes })
        })
    },

    handleSearchAction() {
        const searchValue = this.data.searchValue
        getSearchResult(searchValue).then(res => {
            this.setData({
                resultSongs: res.result.songs
            })
        })
    },

    handleKeywordItemClick(event) {
        const keyword = event.currentTarget.dataset.keyword
        this.setData({ searchValue: keyword })
        this.handleSearchAction()
    }
})