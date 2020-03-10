<template>
  <div class="ranking-warp">
    <h5>排行榜单</h5>
    <div class="container">
      <div
        @click="goPlaylistDetail(item.id)"
        class="item"
        v-for="(item,index) in rankingList"
        :key="index"
      >
        <!-- <div class="img" :style="{ backgroundImage: 'url(' + item.coverImgUrl + '?param=200y200)' }"></div> -->
        <div class="box">
          <div class="img">
            <img v-lazy="item.coverImgUrl" alt />
          </div>
          <p>{{item.name}}</p>
        </div>
      </div>
      <div class="null"></div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import request from "@/api/index";
export default {
  name: "Ranking",
  data() {
    return {
      rankingList: [] //排行歌单列表
    };
  },

  created() {
    this.getRankingList();
    console.log("created");
  },
  activated() {
    this.asyncSetCurrentTabBar(2);
    console.log("activated");
    this.rankingList = JSON.parse(window.sessionStorage.getItem("rankingList"));
  },
  methods: {
    ...mapActions(["asyncSetCurrentTabBar"]),

    /**获取排行歌单 */
    getRankingList() {
      request.getRankingList().then(res => {
        console.log(res);
        if (res && res.code == 200) {
          this.rankingList = res.list;
          window.sessionStorage.setItem(
            "rankingList",
            JSON.stringify(res.list)
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
.ranking-warp {
  overflow-y: scroll;
  flex-shrink: 0;
  width: 100%;

  h5 {
    font-size: 20px;
    font-weight: bold;
    padding: 5px 15px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.9);
  }

  .container {
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
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