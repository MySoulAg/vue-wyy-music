<template>
  <div id="app">
    <router-view />
    <audio
      ref="audioRef"
      preload
      autoplay
      @play='startPlaying'
      :src="songUrl"
    ></audio>
  </div>
</template>
<script>
import { mapGetters,mapActions } from "vuex";
import request from "@/api/index";
export default {
  data(){
    return {
      songUrl:'',//歌曲url
    }
  },
  computed: {
    ...mapGetters(["getIsPlaying","getcurrentTime","getSongId","getCurrentTabBar"])
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
    },

    getSongId:{
      handler(value){
        this.getSongUrl(value)
        this.asyncSetCurrentTime(0);
      }
    }
  },

  updated(){
    console.log(this.getCurrentTabBar)
  },

  methods: {
    ...mapActions(["asyncSetCurrentTime","asyncSetAudioEle","asyncSetPlayingState"]),

    /**获取歌曲Url */
    getSongUrl(id){
      request.getSongUrl(id).then(res=>{
        console.log(res)
        this.songUrl = res.data[0].url
      })
    },

    startPlaying(){
      console.log('开始播放')
      this.asyncSetPlayingState(true)
    }
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
