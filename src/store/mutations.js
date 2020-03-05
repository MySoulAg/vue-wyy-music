export default {
    /**修改播放状态 */
    setPlayingState(state, playingState) {
        state.isPlaying = playingState
    },

    /**修改当前播放时间 */
    setCurrentTime(state, currentTime) {
        state.currentTime = currentTime
    },

    /**修改播放器元素 */
    setAudioEle(state, audioEle) {
        state.audioEle = audioEle
    },

    /**修改歌曲ID */
    setSongId(state, songId) {
        state.songId = songId
    },

    /**修改当前TabBar */
    setCurrentTabBar(state, currentTabBar) {
        if(state.currentTabBar[state.currentTabBar.length-1] == currentTabBar){
            return
        }
        state.currentTabBar.push(currentTabBar)
    },

    /**修改当前播放的歌曲列表 */
    setCurrentSongList(state, currentSongList) {
        state.currentSongList = currentSongList
    }
}