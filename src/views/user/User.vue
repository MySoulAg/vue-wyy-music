<template>
    <div class="user-warp">
        <h5>我的歌单 <span>欢迎：{{userName}}<img src="http://p1.music.126.net/UoKwQG0HA2hA2wd_tzJjBw==/18619129906800578.jpg"/></span></h5>
    <div class="container">
      <div @click="goPlaylistDetail(item.id)" class="item" v-for="(item,index) in userList" :key="index">
        <div class="img" :style="{ backgroundImage: 'url(' + item.coverImgUrl + ')' }"></div>
        <p>{{item.name}}</p>
      </div>
      <div class="null"></div>
    </div>
    <div ref="maskRef" class="mask"></div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import request from "@/api/index";
export default {
    data() {
    return {
      userList: [], //我的歌单列表
userName:'',//用户名
    };
  },

  created  () {
    this.getUserList();
  },
    activated  () {
    this.asyncSetCurrentTabBar(4);
  },
  mounted(){
      console.log()
  },
    methods:{
        ...mapActions(["asyncSetCurrentTabBar"]),

         /**获取我的歌单 */
    getUserList() {
      request.getUserList(361753092).then(res => {
        console.log(res);
        if (res && res.code == 200) {
          this.userList = res.playlist;
          this.$refs.maskRef.style.backgroundImage = `url(${res.playlist[0].creator.avatarUrl})`
          this.userName = res.playlist[0].creator.nickname
        }
      });
    },

    /**点击歌单 去歌单详情 */
    goPlaylistDetail(id){
      console.log(id)
      this.$router.push({path:'playlistDetail',query:{id}})
    }
    }
}
</script>
<style lang="scss" scoped>
.user-warp {
    overflow-y: scroll;
    color:#fff;
  h5 {
    font-size: 20px;
    font-weight: bold;
    padding: 5px 15px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background-color: rgba(255,255,255,.5);

    display:flex;
    justify-content: space-between;
    align-items: center;

    img {
        width:30px;
            border-radius: 50%;
            margin-left:10px;
    }
  }

  .container {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 50px;
    // justify-content: space-around;

    .item {
      width: 33%;
      // height: 130px;
      //   background-color: aqua;
      display: flex;
      flex-direction: column;
      align-items: center;

      .img {
        width: 100px;
        height: 100px;
        // background-color: royalblue;
        border-radius: 6px;
        background-size: cover;
        background-position: center;
      }

      p {
        width: 90px;
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

    .null {
      width: 100%;
      height: 50px;
    }
  }

  .mask {
      width:100vw;
      height:100vh;
      position:fixed;
      left:0;
      top:0;
      z-index:-1;
      background-size: cover;
  background-position: center;
  filter: blur(30px);
  }
}
</style>