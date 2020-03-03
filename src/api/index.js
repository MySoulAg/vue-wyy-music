import request from './axios'

export default {

    //获取歌曲详情
    getMusicDetail(ids) {
        return request({
            method: 'get',
            url: '/song/detail',
            params: {
                ids
            }
        })
    }
}