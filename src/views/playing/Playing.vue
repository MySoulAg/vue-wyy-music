<template>
  <article>
    <div class="palyIng-bg" :style="{ backgroundImage: 'url(' + bgcPicUrl + ')' }"></div>

    <div class="palyIng-warp">
      <header>
        <h3>{{musicName}}</h3>
        <p>{{authorName}}</p>
      </header>
      <main @click="isShowLyrics=!isShowLyrics">
        <transition name="fade">
          <div
            class="pic"
            :class="[getIsPlaying?'rotation':'',isShowLyrics?'opacity':'']"
            v-lazy:background-image="picUrl"
          ></div>
        </transition>
        <transition name="fade">
          <div ref="lyricBoxRef" class="lyric-box" :class="[!isShowLyrics?'opacity':'']">
            <ul v-if="!nolyric" ref="ulRef">
              <li
                ref="liRef"
                :class="[currentIndex==index?'activeLyric':'']"
                v-for="(item,index) in lyricArr"
                :key="index"
              >{{item.text}}</li>
            </ul>
            <div v-else class="noLyric">无歌词</div>
          </div>
        </transition>
      </main>
      <footer>
        <div class="progress">
          <div class="currentTime">{{currentTime | format}}</div>
          <van-slider
            step="0.1"
            v-model="progressValue"
            inactive-color="#999"
            active-color="#fefefe"
            @input="progressInput"
            @change="progressChange"
            @drag-end="dargEnd"
            @drag-start="dargStart"
          >
            <div slot="button" class="custom-button">
              <div ref="pointRef" class="point"></div>
            </div>
          </van-slider>
          <div class="totalTime">{{ totalTime | format}}</div>
        </div>
        <div class="icon">
          <i @click="playingType" class="iconfont" :class="[getPlayingType.class]"></i>
          <i @click="playingPrev" class="iconfont icon-shangyiqu"></i>
          <i @click="playing" class="iconfont" :class="[getIsPlaying?'icon-bofang':'icon-zanting']"></i>
          <i @click="playingNext" class="iconfont icon-shangyiqu1"></i>
          <i @click="handleShow" class="iconfont icon-liebiao"></i>
        </div>
      </footer>
    </div>
    <PlayingListPopup :isShow.sync="isShow" :historySongList="historySongList"></PlayingListPopup>
  </article>
</template>
<script>
import { Slider, Toast } from "vant";
import { mapGetters, mapActions } from "vuex";
import { format, parseLyric } from "@/utils/utils.js";
import PlayingListPopup from "@/components/PlayingListPopup";
import request from "@/api/index";
export default {
  name: "Playing",
  components: {
    [Slider.name]: Slider,
    PlayingListPopup
  },
  data() {
    return {
      isShow: false, //是否显示播放列表弹出层
      progressValue: 0, //进度条的值
      totalTime: "", //歌曲总时间
      currentTime: 0, //播放歌曲的当前时间
      nolyric: true, //是否无歌词
      lyricArr: [], //歌词
      currentIndex: 0, //当前播放的歌词下表
      scrollHeight: 0, //歌词滚动的高度
      historySongList: [],

      isShowLyrics: false, //是否显示歌词

      timeInterval: "", //定时器
      timeInterval2: "", //定时器

      authorName: "", //作者
      musicName: "", //歌曲名
      picUrl: "", //歌曲图片
      bgcPicUrl: "" //模糊背景图
    };
  },

  filters: {
    format
  },

  activated() {
    if (this.getCurrentSongList.length == 0) {
      // Toast("当前无播放");
    }
  },

  computed: {
    ...mapGetters([
      "getIsPlaying",
      "getcurrentTime",
      "getaudioEle",
      "getSongId",
      "getPlayingType",
      "getMusicUrl",
      "getCurrentSongList",
      "getCurrentSong"
    ])
  },

  watch: {
    getSongId: {
      handler() {
        this.progressValue = 0;
        this.currentTime = 0;
        if(this.$refs.ulRef){
          this.$refs.ulRef.style.transform = `translateY(135px)`;
        }
          
        
        this.lyricArr = [];
        this.picUrl = "";
        this.musicName = "";
        this.authorName = "";
      }
    },
    getPlayingType: {
      handler(value) {
        if (value.type == 0) {
          Toast("列表循环");
        } else if (value.type == 1) {
          Toast("单曲循环");
        } else {
          Toast("随机播放");
        }
      }
    },
    getMusicUrl: {
      handler(value) {
        if (!value) {
          // Toast("当前无播放");
          return;
        } else {
          this.asyncSetCurrentTime(0);
          this.getMusicDetail(this.getSongId);
          this.getLyric(this.getSongId);
        }
      },
      immediate: true
    },
    getIsPlaying: {
      handler(flag) {
        if (flag) {
          this.timeInterval = window.setInterval(() => {
            this.currentTime = Math.round(this.getaudioEle.currentTime);
            this.progressValue =
              (this.getaudioEle.currentTime * 100) / this.totalTime;
            this.lyricScroll(this.getaudioEle.currentTime);
          }, 300);

          //如果播放了一半的时间，就存入历史列表
          this.timeInterval2 = window.setTimeout(() => {
            this.setHistoryList();
            window.clearInterval(this.timeInterval2);
          }, (this.totalTime / 2) * 1000);
        } else {
          window.clearInterval(this.timeInterval);
          window.clearInterval(this.timeInterval2);
        }
      },
      immediate: true
    },

    getcurrentTime: {
      handler(value) {
        console.log(value);
        if (!this.getIsPlaying) {
          this.lyricScroll(value);
        }
      }
    },

    currentIndex: {
      handler(value) {
        this.scrollHeight = 0;

        for (let i = 0; i < value; i++) {
          this.scrollHeight += this.$refs.liRef[
            i
          ].getBoundingClientRect().height;
        }
        this.$refs.ulRef.style.transform = `translateY(${-(
          this.scrollHeight - 135
        )}px)`;
      }
    }
  },

  methods: {
    ...mapActions([
      "asyncSetPlayingState",
      "asyncSetCurrentTime",
      "asyncSetSongId",
      "asyncSetPlayingType",
      "asyncOrderNextSong",
      "asyncOrderPrevSong",
      "asyncRandomSong"
    ]),

    /**点击列表 */
    handleShow() {
      let temArr = JSON.parse(window.localStorage.getItem("historySongList"));
      console.log(Boolean(temArr));
      if (temArr) {
        this.historySongList = temArr;
        console.log(this.historySongList, 111111111);
      }

      this.isShow = !this.isShow;
    },

    /**存历史播放 */
    setHistoryList() {
      let historySongString = window.localStorage.getItem("historySongList");
      if (historySongString) {
        let historySongList = JSON.parse(historySongString);
        //判断历史列表中是否已存在该歌曲，如果存在，就把该歌曲移动到数组的开头
        for (let i = 0, len = historySongList.length; i < len; i++) {
          if (this.getCurrentSong.id == historySongList[i].id) {
            historySongList.splice(i, 1);
            historySongList.unshift(this.getCurrentSong);
            window.localStorage.setItem(
              "historySongList",
              JSON.stringify(historySongList)
            );
            return;
          }
        }

        //最大历史存300首
        if (historySongList.length == 300) {
          historySongList.pop();
        }

        historySongList.unshift(this.getCurrentSong);
        window.localStorage.setItem(
          "historySongList",
          JSON.stringify(historySongList)
        );
      } else {
        let temArr = [];
        temArr.unshift(this.getCurrentSong);
        window.localStorage.setItem("historySongList", JSON.stringify(temArr));
      }
    },

    /**歌词滚动 */
    lyricScroll(newTime) {
      for (let i = 0, len = this.lyricArr.length; i < len; i++) {
        if (newTime > this.lyricArr[i].time) {
          this.currentIndex = i;
          continue;
        }
      }
    },

    /**点击上一曲 */
    playingPrev() {
      if (this.getCurrentSongList.length == 0) {
        Toast("当前无播放");
        return;
      }
      if (this.getCurrentSongList.length == 1) {
        Toast("当前列表只有一首，快去歌单添加吧");
        return;
      }
      if (this.getPlayingType.type == 0 || this.getPlayingType.type == 1) {
        //顺序的上一曲
        this.asyncOrderPrevSong();
      }
      if (this.getPlayingType.type == 2) {
        //随机的上一曲
        this.asyncRandomSong();
      }
    },

    /**点击下一曲 */
    playingNext() {
      if (this.getCurrentSongList.length == 0) {
        Toast("当前无播放");
        return;
      }
      if (this.getCurrentSongList.length == 1) {
        Toast("当前列表只有一首，快去歌单添加吧");
        return;
      }
      if (this.getPlayingType.type == 0 || this.getPlayingType.type == 1) {
        //顺序的下一曲
        this.asyncOrderNextSong();
      }
      if (this.getPlayingType.type == 2) {
        //随机的下一曲
        this.asyncRandomSong();
      }
    },

    /**点击播放模式 */
    playingType() {
      this.asyncSetPlayingType();
    },

    /**获取歌词 */
    getLyric(id) {
      request.getLyric(id).then(res => {
        console.log(res);
        if (res.nolyric) {
          this.nolyric = true;
          this.lyricArr = [];
        } else {
          this.nolyric = false;
          this.lyricArr = parseLyric(res.lrc.lyric);
        }
        console.log(this.lyricArr);
      });
    },

    /**获取音乐详情 */
    getMusicDetail(id) {
      request.getMusicDetail(id).then(res => {
        console.log(res);
        this.authorName = res.songs[0].ar[0].name;
        this.musicName = res.songs[0].name;
        // this.picUrl = res.songs[0].al.picUrl + "?param=500y500";
        // this.bgcPicUrl = res.songs[0].al.picUrl + "?param=500y500";
        this.picUrl = res.songs[0].al.picUrl;
        this.bgcPicUrl = res.songs[0].al.picUrl;
        this.totalTime = Math.round(res.songs[0].dt / 1000);
      });
    },

    /**点击播放/暂停 */
    playing() {
      if (!this.getMusicUrl) {
        Toast("当前无播放");
        return;
      }
      this.asyncSetPlayingState(!this.getIsPlaying);
    },

    /**拖动进度条过程中 */
    progressInput(value) {
      console.log(value);
      this.currentTime = (this.totalTime / 100) * value;
    },

    /**拖动进度条结束后 */
    progressChange(value) {
      console.log(value);
      console.log(this.currentTime);
      this.asyncSetCurrentTime(this.currentTime);
    },

    /**拖动结束 */
    dargEnd() {
      this.$refs.pointRef.style.width = "8px";
      this.$refs.pointRef.style.height = "8px";
    },

    /**开始拖动 */
    dargStart() {
      this.$refs.pointRef.style.width = "15px";
      this.$refs.pointRef.style.height = "15px";
    }
  }
};
</script>
<style lang="scss" scoped>
article {
  width: 100%;
  height: 100%;

  flex-shrink: 0;
}

.palyIng-bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(30px);
}

.palyIng-warp {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;

  header {
    margin-top: 20px;
    height: 50px;
    h3 {
      margin: 0 auto;
      width: 80%;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    p {
      text-align: center;
      font-size: 12px;
    }
  }

  main {
    height: calc(100% - 186px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .lyric-box {
      width: 100%;
      height: 310px;
      overflow-y: hidden;
      transition: all 1s;
      position: relative;
      ul {
        width: 100%;
        height: 100%;
        transform: translateY(50%);
        transition: all 0.8s;
        li {
          margin: 0 auto;
          width: 80%;
          text-align: center;
          padding: 8px 0;
          transition: all 0.5s;
        }

        li.activeLyric {
          color: aqua;
          // font-size: 15px;
        }
      }

      .noLyric {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .pic {
      position: absolute;
      width: 200px;
      height: 200px;
      //   background-color: aqua;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      transition: all 1s;
    }

    @-webkit-keyframes rotation {
      from {
        -webkit-transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
      }
    }

    .rotation {
      -webkit-transform: rotate(360deg);
      animation: rotation 40s linear infinite;
      -moz-animation: rotation 40s linear infinite;
      -webkit-animation: rotation 40s linear infinite;
      -o-animation: rotation 40s linear infinite;
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 1s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
  }

  footer {
    width: 100%;
    padding: 20px 0 10px;

    .progress {
      display: flex;
      align-items: center;
      width: 90%;
      margin: 0 auto;

      .currentTime,
      .totalTime {
        width: 32px;
        flex-shrink: 0;
        font-size: 10px;
        line-height: 10px;
        font-weight: 100;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
      }

      .van-slider {
        margin: 0 5px;
        .custom-button {
          padding: 10px;
          .point {
            width: 8px;
            height: 8px;
            background-color: #fff;
            border-radius: 50%;
            transition: all 0.5s;
          }
        }

        .custom-button:hover .point {
          width: 15px;
          height: 15px;
        }
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: space-around;

      i {
        font-size: 27px;
        padding: 5px;
      }

      i.icon-zanting,
      i.icon-bofang {
        font-size: 70px;
        padding: 0;
      }
    }
  }
}

.opacity {
  opacity: 0;
}
</style>