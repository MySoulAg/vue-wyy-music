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
    }
}