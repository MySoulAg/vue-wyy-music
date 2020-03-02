import request from '@/api/axios.js'

export default {

    /**登陆 */
    login() {
        return request({
            method: 'post',
            url: '/login',
        })
    },
}