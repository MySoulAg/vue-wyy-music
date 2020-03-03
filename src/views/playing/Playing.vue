<template>
  <article>
    <div class="palyIng-bg" :style="{ backgroundImage: 'url(' + picUrl + ')' }"></div>

    <div class="palyIng-warp">
      <header>
        <h3>{{musicName}}</h3>
        <p>{{authorName}}</p>
      </header>
      <main>
        <div class="pic" :class="[getIsPlaying?'rotation':'']" :style="{ backgroundImage: 'url(' + picUrl + ')' }"></div>
      </main>
      <footer>
        <div class="progress">
          <div class="currentTime">{{currentTime | format}}</div>
          <van-slider
            step="1"
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
          <i class="iconfont icon-xunhuan-wangyiicon"></i>
          <i class="iconfont icon-shangyiqu"></i>
          <i @click="playing" class="iconfont" :class="[getIsPlaying?'icon-bofang':'icon-zanting']"></i>
          <i class="iconfont icon-shangyiqu1"></i>
          <i class="iconfont icon-liebiao"></i>
        </div>
      </footer>
    </div>
  </article>
</template>
<script>
import { Slider } from "vant";
import { mapGetters, mapActions } from "vuex";
import { format } from "@/utils/utils.js";
import request from "@/api/index";
export default {
  components: {
    [Slider.name]: Slider
  },
  data() {
    return {
      progressValue: 0, //进度条的值
      totalTime: "", //歌曲总时间
      currentTime: 0, //播放歌曲的当前时间

      timeInterval:'',//定时器

      authorName: "", //作者
      musicName: "", //歌曲名
      picUrl: "" //歌曲图片
    };
  },

  filters: {
    format
  },

  created() {
    this.getMusicDetail();
  },

  computed: {
    ...mapGetters(["getIsPlaying","getcurrentTime","getaudioEle"])
  },

  watch:{
    getIsPlaying: {
      handler(flag) {
        if (flag) {
            this.timeInterval = window.setInterval(()=>{
              console.log(this.getaudioEle.currentTime)
              this.currentTime = Math.round(this.getaudioEle.currentTime)
              this.progressValue = this.getaudioEle.currentTime * 100 / this.totalTime
              if(this.getaudioEle.ended){
                console.log('播放完毕')
                window.clearInterval(this.timeInterval)
                this.currentTime = 0;
                this.progressValue = 0;
                this.asyncSetPlayingState(false);
              }
            },1000)
        }else {
          window.clearInterval(this.timeInterval)
        }
      },
      immediate: true
    },
  },

  methods: {
    ...mapActions(["asyncSetPlayingState","asyncSetCurrentTime"]),

    /**获取音乐详情 */
    getMusicDetail() {
      request.getMusicDetail(1400256289).then(res => {
        console.log(res);
        this.authorName = res.songs[0].ar[0].name;
        this.musicName = res.songs[0].al.name;
        this.picUrl = res.songs[0].al.picUrl;
        this.totalTime = Math.round(res.songs[0].dt / 1000);
      });
    },

    /**点击播放/暂停 */
    playing() {
      this.asyncSetPlayingState(!this.getIsPlaying);
    },

    /**拖动进度条过程中 */
    progressInput(value) {
      console.log(value);
      this.currentTime = this.totalTime / 100 * value
    },

    /**拖动进度条结束后 */
    progressChange(value) {
      console.log(value);
      console.log(this.currentTime)
      this.asyncSetCurrentTime(this.currentTime)
    },

    /**拖动结束 */
    dargEnd(){
      this.$refs.pointRef.style.width = '8px'
      this.$refs.pointRef.style.height = '8px'
    },

    /**开始拖动 */
    dargStart(){
      this.$refs.pointRef.style.width = '15px'
      this.$refs.pointRef.style.height = '15px'
    }
  }
};
</script>
<style lang="scss" scoped>
article {
  width: 100%;
  height: 100%;
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
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .pic {
      position: relative;
      top: -20px;
      width: 200px;
      height: 200px;
      //   background-color: aqua;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
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
  }

  footer {
    width: 100%;
    padding-bottom: 10px;

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
</style>