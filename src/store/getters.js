export default {
    getIsPlaying: state => state.isPlaying, //获取是否在播放
    getcurrentTime: state => state.currentTime, //获取当前播放时间
    getaudioEle: state => state.audioEle, //获取播放器元素
    getSongId: state => state.songId, //获取歌曲ID
    getCurrentTabBar: state => state.currentTabBar, //获取当前选中TabBar
    getCurrentSongList: state => state.currentSongList, //获取当前播放的歌曲列表
}