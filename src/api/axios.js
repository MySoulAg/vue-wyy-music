/**
 * axios的二次封装
 */

import axios from 'axios'
import {
    Toast
} from 'vant';


axios.defaults.timeout = 10000 //请求超时时间
// axios.defaults.baseURL = 'http://49.235.193.247:3000/'

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
        if (res && res.code == 200) {
            return res
        }
    },
    error => {
        console.log(1111)
        if (error.message.indexOf('timeout') != -1) {
            Toast('本次请求超时，请重试！')
        } else {
            Toast('系统请求异常')
        }
        return Promise.reject(error);
    }
);


export default axios