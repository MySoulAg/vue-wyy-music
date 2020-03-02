/**
 * axios的二次封装
 */

import axios from 'axios'


axios.defaults.timeout = 10000 //请求超时时间
axios.defaults.baseURL = 'http://49.235.193.247:3000/'

/**请求拦截器 */
axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

/**响应拦截器 */
axios.interceptors.response.use(
    response => {
        const res = response.data;
        //根据返回的状态码 作出逻辑处理
        //.......
        return res
    },
    error => {
        if (error.message.indexOf('timeout') != -1) {
            Message.error('本次请求超时，请重试！')
        } else {
            Message.error('系统请求异常')
        }
        NProgress.done();
        return Promise.reject(error);
    }
);


export default axios