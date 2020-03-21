<template>
  <div class="recommend-warp">
    <div class="search-box">
      <div class="left">
        <!-- <div class="day" @click="goPlaylistDetail(null,true)" v-show="!isShowInput">
          <span>每日</span>
          <span>推荐</span>
        </div> -->
        <div ref="inputBoxRef" class="input" @click="handleInput">
          <van-icon name="search" />
          <span v-show="!isShowInput">{{realkeyword}}</span>
          <input
            @keyup.enter="handleSearch"
            v-model="keyWords"
            ref="inputRef"
            v-show="isShowInput"
            type="text"
            :placeholder="realkeyword"
          />
        </div>
      </div>
      
      <div class="right">
        <!-- <div class="sousuo" @click="handleSearch" v-show="!isShowInput">搜索</div> -->
        <transition name="slide-fade">
          <div @click="handleCancle" v-show="isShowInput" class="button">取消</div>
        </transition>
      </div>
    </div>

    <div v-show="isShowInput" class="search-container">
      <div class="null-history"></div>
      <div class="history" v-if="historySerachList.length>0">
        <h5>
          搜索历史
          <van-icon @click="clearHistorySearch" name="delete" />
        </h5>
        <span
          @click="handleHistory(item)"
          v-for="(item,index) in historySerachList"
          :key="index"
        >{{item}}</span>
      </div>
      <div class="hot">
        <h5>热搜榜</h5>
        <ul class="song-list">
          <li @click="handleHot(item.searchWord)" v-for="(item,index) in hotList" :key="index">
            <div class="number" :class="[index<=2?'active':'']">{{index + 1}}</div>
            <div class="name">
              <p>
                <span class="left" :class="[index<=2?'active':'']">
                  {{item.searchWord}}
                  <i class="iconfont" :class="iconfont(item)"></i>
                </span>
                <span class="right">{{item.score}}</span>
              </p>
              <span>{{item.content}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="null-top"></div>

    <div class="swipe-box">
      <van-swipe class="my-swipe" :autoplay="5000" indicator-color="#FD461F">
        <van-swipe-item v-for="(item,index) in bannerList" :key="'swipe'+index">
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
        @click="goPlaylistDetail(item.id,false)"
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

    <van-popup
      v-model="isShowPopup"
      position="right"
      :overlay-style="{backgroundColor:'transparent'}"
      :style="{ height: '100%' ,width:'100%'}"
    >
      <van-icon @click="hiddenSearchPopup" class="popup-icon" name="arrow" />
      <ul>
        <li @click="hanldeSearchList(item)" v-for="(item,index) in searchList" :key="index">
          <p>{{item.name}}</p>
          <span>{{item.artists[0].name}}-{{item.album.name}}</span>
        </li>
      </ul>
    </van-popup>
  </div>
</template>
<script>
import { Swipe, SwipeItem, Icon, Popup, Dialog } from "vant";
import { mapGetters, mapActions } from "vuex";
import request from "@/api/index";
export default {
  name: "Recommend",
  components: {
    [Swipe.name]: Swipe,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Dialog.name]: Dialog,
    [SwipeItem.name]: SwipeItem
  },
  data() {
    return {
      isShowPopup: false, //是否显示弹出层
      isShowInput: false, //是否显示输入框
      bannerList: [],
      recommendedList: [], //推荐歌单列表
      hotList: [], //热搜列表
      searchList: [], //搜索结果列表
      historySerachList: [], //历史搜索列表
      realkeyword: "", //默认搜索关键词
      keyWords: "" //搜索关键字
    };
  },

  created() {
    this.asyncSetLoadingFlag(true);
    this.getRecommendedList();
    console.log("created");
    this.getBanner();
    this.getHot();
    this.getSearchDefault();
    this.historySerachList =
      JSON.parse(window.localStorage.getItem("historySearchList")) || [];
  },

  activated() {
    this.asyncSetCurrentTabBar(1);
    console.log("activated");
  },

  computed: {
    ...mapGetters(["getLoadingFlag"])
  },

  methods: {
    ...mapActions([
      "asyncSetCurrentTabBar",
      "asyncSetSongId",
      "asyncSetLoadingFlag",
      "asyncSetCurrentSongList"
    ]),

    /**点击搜索结果列表 */
    hanldeSearchList(item) {
      console.log(item);
      this.asyncSetSongId(item.id);
      this.asyncSetCurrentSongList(item);
      this.$router.push("/playing");
    },

    /**点击搜索历史列表 */
    handleHistory(item) {
      this.keyWords = item;
      this.handleSearch();
    },

    /**点击删除历史 */
    clearHistorySearch() {
      Dialog.confirm({
        title: "提示",
        message: "确定删除搜索历史？"
      })
        .then(() => {
          // on confirm
          window.localStorage.removeItem("historySearchList");
          this.historySerachList =
            JSON.parse(window.localStorage.getItem("historySearchList")) || [];
        })
        .catch(() => {
          // on cancel
        });
    },

    /**点击热搜榜 */
    handleHot(name) {
      console.log(name);
      this.keyWords = name;
      this.handleSearch();
    },

    /**点击收起popup */
    hiddenSearchPopup() {
      this.isShowPopup = false;
    },

    /**将搜索记录存入本地 */
    setHistorySearch(keywords) {
      let historySearchString = window.localStorage.getItem(
        "historySearchList"
      );
      if (historySearchString) {
        let historySearchList = JSON.parse(historySearchString);
        //判断历史列表中是否已存在该歌曲，如果存在，就把该歌曲移动到数组的开头
        for (let i = 0, len = historySearchList.length; i < len; i++) {
          if (historySearchList[i] == keywords) {
            historySearchList.splice(i, 1);
            historySearchList.unshift(keywords);
            window.localStorage.setItem(
              "historySearchList",
              JSON.stringify(historySearchList)
            );
            return;
          }
        }

        //最大历史存10个
        if (historySearchList.length == 10) {
          historySearchList.pop();
        }
        historySearchList.unshift(keywords);
        window.localStorage.setItem(
          "historySearchList",
          JSON.stringify(historySearchList)
        );
      } else {
        let temArr = [];
        temArr.unshift(keywords);
        window.localStorage.setItem(
          "historySearchList",
          JSON.stringify(temArr)
        );
      }
    },

    /**搜索 */
    handleSearch() {
      this.asyncSetLoadingFlag(true);
      this.searchList = [];
      this.isShowPopup = true;
      request.search(this.keyWords || this.realkeyword).then(res => {
        console.log(res);
        this.asyncSetLoadingFlag(false);
        this.searchList = res.result.songs;
        this.setHistorySearch(this.keyWords || this.realkeyword);
        this.historySerachList = JSON.parse(
          window.localStorage.getItem("historySearchList")
        );
      });
    },

    /**获取默认搜索关键词 */
    getSearchDefault() {
      request.getSearchDefault().then(res => {
        console.log(res);
        this.realkeyword = res.data.realkeyword;
      });
      window.setInterval(() => {
        request.getSearchDefault().then(res => {
          console.log(res);
          this.realkeyword = res.data.realkeyword;
        });
      }, 120000);
    },

    /**icon处理 */
    iconfont(item) {
      if (item.iconType == 2) {
        return "icon-NEW-";
      } else if (item.iconType == 1) {
        return "icon-hot";
      } else if (item.iconType == 5) {
        return "icon-xiangshangjiantou";
      } else {
        return;
      }
    },

    /**获取热搜列表 */
    getHot() {
      request.getHot().then(res => {
        console.log(res);
        this.hotList = res.data;
      });
    },

    /**点击输入框 */
    handleInput() {
      this.isShowInput = true;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
      this.$refs.inputBoxRef.style.width = "100%";
    },

    /**点击取消 */
    handleCancle() {
      this.keyWords = "";
      this.isShowInput = false;
      this.isShowPopup = false;
      this.$refs.inputBoxRef.style.width = "75%";
    },

    /**点击轮播图 */
    handleSwipe(item) {
      if (item.targetType == 1) {
        //歌曲
        this.asyncSetSongId(item.song.id);
        this.asyncSetCurrentSongList(item.song);
        this.$router.push("/playing");
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
        this.asyncSetLoadingFlag(false);
        if (res && res.code == 200) {
          this.recommendedList = res.result;
        }
      });
    },

    /**点击歌单 去歌单详情 */
    goPlaylistDetail(id,flag) {
      console.log(id);
      this.$router.push({ path: "playlistDetail", query: { id ,flag} });
    }
  }
};
</script>
<style lang="scss" scoped>
.recommend-warp {
  overflow-y: scroll;
  flex-shrink: 0;
  width: 100%;

  .search-box {
    padding: 10px 15px 10px 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 9999;
    background-color: #fff;

    .left {
      width: 80%;
      display: flex;
      justify-content: flex-end;
      position: relative;

      .day {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: #f5f5f5;
        color: #999;
        padding: 0 6px;
        position: absolute;
        left: 10px;
        top: 0;
        height: 100%;

        span {
          font-size: 12px;
          line-height: 12px;
        }
      }

      .input {
        display: flex;
        align-items: center;
        width: 75%;
        justify-content: center;
        height: 35px;
        border-radius: 30px;
        background-color: #f5f5f5;
        transition: all 0.3s;

        .van-icon {
          font-size: 18px;
          color: #999;
        }

        span {
          font-size: 14px;
          color: #999;
          padding-left: 2px;
        }
        input {
          border: none;
          padding-left: 5px;
          font-size: 14px;
          width: 80%;
          background-color: transparent;
        }
      }
      input::placeholder {
        color: #999;
      }
    }

    .right {
      width: 20%;
      position: relative;
      height: 35px;
      .sousuo {
        background-color: #f5f5f5;
        display: inline-block;
        color: #999;
        height: 35px;
        line-height: 35px;
        border-radius: 50%;
        padding: 0 6px;
        font-size: 12px;
        position: absolute;
        top: 0px;
        left: 22px;

      }
      .button {
        color: #333;
        font-size: 15px;
        font-weight: bold;
        // position: absolute;
        text-align: center;
        right: 20px;
        height: 100%;
        line-height: 35px;
      }
    }
  }

  .search-container {
    position: absolute;
    z-index: 99;
    width: 100%;
    background: #fff;
    // padding: 15px;

    .history {
      padding: 15px 15px 0 15px;
      h5 {
        font-size: 16px;
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .van-icon {
          padding: 3px 15px 3px 3px;
        }
      }
      span {
        display: inline-block;
        padding: 5px 10px;
        background-color: #f5f5f5;
        font-size: 12px;
        border-radius: 22px;
        margin: 0 10px 10px 0;
      }
    }

    .hot {
      h5 {
        font-size: 16px;
        padding: 20px 15px 0px 15px;
      }
      .song-list {
        li {
          display: flex;
          align-items: center;
          padding: 8px 0;

          .number {
            width: 40px;
            color: #999;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .number.active {
            color: red;
          }

          .name {
            flex: 1;
            padding-right: 20px;

            p {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .left {
                font-size: 15px;
                position: relative;

                .icon-NEW- {
                  color: green;
                  font-size: 30px;
                  position: absolute;
                  right: -33px;
                  top: 50%;
                  transform: translateY(-48%);
                  // zoom: 1.5;
                }

                .icon-hot {
                  color: red;
                  font-size: 22px;
                  position: absolute;
                  right: -27px;
                  top: 50%;
                  transform: translateY(-46%);
                }

                .icon-xiangshangjiantou {
                  color: red;
                  font-size: 16px;
                  position: absolute;
                  right: -15px;
                  top: 50%;
                  transform: translateY(-46%);
                }
              }

              .left.active {
                font-weight: bold;
              }

              .right {
                color: #999;
                font-size: 13px;
              }
            }

            & > span {
              overflow: hidden;
              /* text-overflow: ellipsis; */
              /* //作为弹性伸缩盒子模型显示。 */
              display: -webkit-box;
              /* //设置伸缩盒子的子元素排列方式--从上到下垂直排列 */
              -webkit-box-orient: vertical;
              /* //显示的行，文本超出 显示几行 */
              -webkit-line-clamp: 1;
              font-size: 11px;
              color: #999;
            }
          }
        }
      }
    }
  }

  .null-top {
    width: 100%;
    height: 45px;
  }

  .null-history {
    width: 100%;
    height: 35px;
  }

  .swipe-box {
    padding: 15px 0;
    height: 164px;

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

    .item:nth-of-type(3n + 1) {
      justify-content: flex-start;
    }
    .item:nth-of-type(3n + 2) {
      justify-content: center;
    }
    .item:nth-of-type(3n) {
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

  .van-popup {
    ul {
      padding: 0 15px;
      li {
        padding: 10px 0;
        border-bottom: 1px solid #f5f5f5;
        p {
          font-size: 15px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span {
          font-size: 12px;
          color: #999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          width: 100%;
        }
      }
    }
  }
}

.popup-icon {
  margin: 50px 10px 10px 10px;
  padding: 5px;
  font-size: 20px;
  color: #999;
}

.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(50%);
  opacity: 0;
}
</style>