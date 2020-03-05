import request from './axios'

export default {

    /**获取歌曲详情 */
    getMusicDetail(ids) {
        return request({
            method: 'get',
            url: '/song/detail',
            params: {
                ids
            }
        })
    },

    /**获取歌词 */
    getLyric(id) {
        return request({
            method: 'get',
            url: '/lyric',
            params: {
                id
            }
        })
    },

    /**获取推荐歌单 */
    getRecommendedList() {
        return request({
            method: 'get',
            url: '/personalized',
        })
    },

    /**获取歌单详情 */
    getPlaylistDetail(id) {
        return request({
            method: 'get',
            url: '/playlist/detail',
            params: {
                id
            }
        })
    },

    /**获取歌曲Url */
    getSongUrl(id) {
        return request({
            method: 'get',
            url: '/song/url',
            params: {
                id
            }
        })
    }
}