<template>
    <div class="recommend-warp">
        排行榜
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
    activated  () {
    this.asyncSetCurrentTabBar(2);
  },
    methods:{
        ...mapActions(["asyncSetCurrentTabBar"]),
    }
}
</script>
<style lang="scss" scoped>

</style>