<template>
  <div class="index">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <div class="tabBar">
      <div class="item" :class="[actveTabBar==1?'active':'']" @click="goRecommend">
        <i class="iconfont icon-logo-dark"></i>
        <span>推荐</span>
      </div>
      <div class="item" :class="[actveTabBar==2?'active':'']" @click="goRanking">
        <i class="iconfont icon-paihang"></i>
        <span>排行</span>
      </div>
      <div class="item" :class="[actveTabBar==3?'active':'']" @click="goPlaying">
        <i class="iconfont icon-yinyue"></i>
        <span>播放</span>
      </div>
      <div class="item" :class="[actveTabBar==4?'active':'']" @click="goUser">
        <i class="iconfont icon-wode"></i>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters(["getCurrentTabBar"]),

    actveTabBar() {
      return this.getCurrentTabBar[this.getCurrentTabBar.length - 1];
    }
  },

  mounted() {
    console.log(this.actveTabBar, 88888);
  },

  methods: {
    ...mapActions(["asyncSetCurrentTabBar"]),

    /**点击推荐 */
    goRecommend() {
      if (this.actveTabBar == 1) {
        return;
      }
      this.$router.push("/recommend");
    },

    /**点击排行 */
    goRanking() {
      if (this.actveTabBar == 2) {
        return;
      }
      this.$router.push("/ranking");
    },

    /**点击播放 */
    goPlaying() {
      if (this.actveTabBar == 3) {
        return;
      }
      this.$router.push("/playing");
      // this.asyncSetCurrentTabBar(3);
    },

    /**点击我的 */
    goUser() {
      if (this.actveTabBar == 4) {
        return;
      }
      if (
        window.localStorage.getItem("userId") ||
        window.localStorage.getItem("uId")
      ) {
        this.$router.push("/user");
      } else {
        this.$router.push("/login");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  color: #333;

  .tabBar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: rgba(255, 255, 255, 0.9);

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      i {
        font-size: 25px;
      }

      span {
        font-size: 12px;
      }
    }

    .active {
      color: red;
    }
  }
}
</style>