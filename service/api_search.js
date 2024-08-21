import whRequest from '../service/index'

export function getSearchHot() {
    return whRequest.get('/search/hot')
}

export function getSearchSuggest(keywords) {
    return whRequest.get('/search/suggest', {
        keywords,
        type: 'mobile'
    })
}

export function getSearchResult(keywords) {
    return whRequest.get("/search",{
        keywords
    })
}