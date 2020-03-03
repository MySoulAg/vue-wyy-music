export default {
    getIsPlaying: state => state.isPlaying,//获取是否在播放
    getcurrentTime: state => state.currentTime,//获取当前播放时间
    getaudioEle: state => state.audioEle,//获取播放器元素
}