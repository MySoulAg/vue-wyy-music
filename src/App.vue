<template>
  <div id="app">
    <router-view />
    <audio
      ref="audioRef"
      preload
      src="http://m7.music.126.net/20200303141259/7eb0ffe3a4aa1c93b4f4792d5718ebff/ymusic/545e/065a/530b/c413a59407100320b8f9da233b35f938.mp3"
    ></audio>
  </div>
</template>
<script>
import { mapGetters,mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["getIsPlaying","getcurrentTime"])
  },

  watch: {
    getIsPlaying: {
      handler(flag) {
        if (flag) {
          this.$nextTick(() => {
            this.$refs.audioRef.currentTime = this.getcurrentTime
            this.$refs.audioRef.play();
            this.asyncSetAudioEle(this.$refs.audioRef)
          });
        } else {
          this.$nextTick(() => {
              this.asyncSetCurrentTime(this.$refs.audioRef.currentTime)
            this.$refs.audioRef.pause();
          });
        }
      },
      immediate: true
    },
    getcurrentTime: {
      handler() {
        if (this.getIsPlaying) {
          this.$nextTick(() => {
            this.$refs.audioRef.currentTime = this.getcurrentTime
            this.$refs.audioRef.play();
          });
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions(["asyncSetCurrentTime","asyncSetAudioEle"]),
  }
};
</script>
<style lang="scss">
@import "@/assets/css/common.scss";
#app {
  width: 100%;
  height: 100%;
  color: #fff;
}
</style>
