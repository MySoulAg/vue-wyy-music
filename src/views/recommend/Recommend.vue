<template>
  <div class="recommend-warp">

    <div class="swipe-box">
      <van-swipe class="my-swipe" :autoplay="5000" indicator-color="#FD461F">
        <van-swipe-item v-for="item in bannerList" :key="item.targetId">
          <div class="img-box" @click="handleSwipe(item)">
            <img :src="item.pic" />
            <div class="type" :class="[item.titleColor=='red'?'red':'blue']">{{item.typeTitle}}</div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <h5>精选歌单</h5>
    <div class="container">
      <div
        @click="goPlaylistDetail(item.id)"
        class="item"
        v-for="(item,index) in recommendedList"
        :key="index"
      >
        <!-- <div class="img" :style="{ backgroundImage: 'url(' + item.picUrl + '?param=200y200)' }"></div> -->
        <div class="box">
          <div class="img">
            <img v-lazy="item.picUrl" alt />
          </div>
          <p>{{item.name}}</p>
        </div>
      </div>
      <div class="null"></div>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem } from "vant";
import { mapActions } from "vuex";
import request from "@/api/index";
export default {
  name: "Recommend",
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  },
  data() {
    return {
      bannerList: [],
      recommendedList: [] //推荐歌单列表
    };
  },

  created() {
    this.getRecommendedList();
    console.log("created");
    this.getBanner();
  },

  activated() {
    this.asyncSetCurrentTabBar(1);
    console.log("activated");
    this.recommendedList = JSON.parse(
      window.sessionStorage.getItem("recommendedList")
    );
  },

  methods: {
    ...mapActions(["asyncSetCurrentTabBar","asyncSetSongId"]),

    /**点击轮播图 */
    handleSwipe(item){
      if(item.targetType==1){
        //歌曲
        this.asyncSetSongId(item.song.id);
        this.$router.push("/playing")
      }
    },

    /**获取Banner轮播 */
    getBanner() {
      request.getBanner().then(res => {
        console.log(res);
        this.bannerList = res.banners;
      });
    },

    /**获取推荐歌单 */
    getRecommendedList() {
      request.getRecommendedList().then(res => {
        console.log(res);
        if (res && res.code == 200) {
          this.recommendedList = res.result;
          window.sessionStorage.setItem(
            "recommendedList",
            JSON.stringify(res.result)
          );
        }
      });
    },

    /**点击歌单 去歌单详情 */
    goPlaylistDetail(id) {
      console.log(id);
      this.$router.push({ path: "playlistDetail", query: { id } });
    }
  }
};
</script>
<style lang="scss" scoped>
.recommend-warp {
  overflow-y: scroll;
  flex-shrink: 0;
  width: 100%;

  .swipe-box {
    padding: 15px 0;

    .van-swipe {
      // height: 130px;

      .van-swipe-item {
        border-radius: 6px;
        display: flex;
        justify-content: center;
        padding: 0 15px;

        .img-box {
          width: 100%;
          border-radius: 6px;
          position: relative;

          img {
            width: 100%;
            border-radius: 6px;
          }

          .type {
            position: absolute;
            right: 0;
            bottom: 0;
            color: #fff;
            padding: 0px 5px;
            border-radius: 6px 0 6px 0;
            font-size: 11px;
          }
          .type.red {
            background-color: #fe3d15;
          }

          .type.blue {
            background-color: #1e3eec;
          }
        }
      }
    }
  }

  h5 {
    font-size: 20px;
    font-weight: bold;
    padding: 5px 15px;
    // position: fixed;
    // left: 0;
    // top: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.9);
  }

  .container {
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    // margin-top: 50px;
    // justify-content: space-around;

    .item:nth-of-type(3n+1){
      justify-content: flex-start;
    }
    .item:nth-of-type(3n+2){
      justify-content: center;
    }
    .item:nth-of-type(3n){
      justify-content: flex-end;
    }

    .item {
      width: 33%;
      display: flex;

      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90%;

        .img {
          // width: 100px;
          // height: 100px;

          img {
            width: 100%;
            // height: 100%;
            border-radius: 6px;
          }
        }

        p {
          width: 100%;
          height: 28px;
          line-height: 14px;
          padding-top: 2px;
          box-sizing: content-box;
          margin-bottom: 15px;
          text-align: justify;
          overflow: hidden;
          /* text-overflow: ellipsis; */
          /* //作为弹性伸缩盒子模型显示。 */
          display: -webkit-box;
          /* //设置伸缩盒子的子元素排列方式--从上到下垂直排列 */
          -webkit-box-orient: vertical;
          /* //显示的行，文本超出 显示几行 */
          -webkit-line-clamp: 2;
          font-size: 11px;
        }
      }
    }

    .null {
      width: 100%;
      height: 50px;
    }
  }
}
</style>