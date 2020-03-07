<template>
  <div id="app">
    <router-view />
    <audio
      ref="audioRef"
      :loop="getPlayingType.type==1?true:false"
      @play="startPlaying"
      @canplaythrough="canPlay"
      @loadstart="loadStart"
      :src="songUrl"
    ></audio>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import request from "@/api/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      songUrl: "" //歌曲url
    };
  },
  computed: {
    ...mapGetters([
      "getIsPlaying",
      "getcurrentTime",
      "getSongId",
      "getCurrentTabBar",
      "getPlayingType"
    ])
  },

  watch: {
    getIsPlaying: {
      handler(flag) {
        if (flag) {
          this.$nextTick(() => {
            this.$refs.audioRef.currentTime = this.getcurrentTime;
            this.$refs.audioRef.play();
            this.asyncSetAudioEle(this.$refs.audioRef);
          });
        } else {
          this.$nextTick(() => {
            this.asyncSetCurrentTime(this.$refs.audioRef.currentTime);
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
            this.$refs.audioRef.currentTime = this.getcurrentTime;
            this.$refs.audioRef.play();
          });
        }
      },
      immediate: true
    },

    getSongId: {
      handler(value) {
        this.getSongUrl(value);
        this.asyncSetCurrentTime(0);
      }
    }
  },

  methods: {
    ...mapActions([
      "asyncSetCurrentTime",
      "asyncSetAudioEle",
      "asyncSetPlayingState",
      "asyncSetSongId",
      "asyncSetMusicUrl",
      "asyncOrderNextSong",
      "asyncRandomSong"
    ]),

    canPlay() {
      Toast("能够播放了");
      this.$refs.audioRef.play();
    },

    loadStart(){
      Toast("开始加载了");
    },

    /**获取歌曲Url */
    getSongUrl(id) {
      request.getSongUrl(id).then(res => {
        console.log(res);
        if (res.data[0].url) {
          this.songUrl = res.data[0].url;
          this.asyncSetMusicUrl(res.data[0].url);
          console.log("获取到了url地址");
        } else {
          Toast("该歌曲不可播放,已切换下一曲");
          // this.asyncSetMusicUrl(null)
          this.songUrl = "";
          if (this.getPlayingType.type == 0 || this.getPlayingType.type == 1) {
            //顺序的下一曲
            this.asyncOrderNextSong();
          }
          if (this.getPlayingType.type == 2) {
            //随机的下一曲
            this.asyncRandomSong();
          }
        }
      });
    },

    startPlaying() {
      console.log("开始播放");
      this.asyncSetPlayingState(true);
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
