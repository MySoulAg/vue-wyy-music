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
    }
}