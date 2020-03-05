export default {
    /**修改播放状态 */
    asyncSetPlayingState({
        commit
    }, playingState) {
        commit('setPlayingState', playingState)
    },

    /**修改当前播放时间 */
    asyncSetCurrentTime({
        commit
    }, currentTime) {
        commit('setCurrentTime', currentTime)
    },

    /**修改播放器元素 */
    asyncSetAudioEle({
        commit
    }, audioEle) {
        commit("setAudioEle", audioEle)
    },

    /**修改音乐ID */
    asyncSetSongId({
        commit
    }, songId) {
        commit("setSongId", songId)
    },

    /**修改当前TabBar */
    asyncSetCurrentTabBar({
        commit
    }, currentTabBar) {
        commit("setCurrentTabBar", currentTabBar)
    },

    /**修改当前播放的歌曲列表 */
    asyncSetCurrentSongList({
        commit
    }, currentSongList) {
        commit("setCurrentSongList", currentSongList)
    }
}