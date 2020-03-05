<template>
    <div class="recommend-warp">
        我的
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
    activated  () {
    this.asyncSetCurrentTabBar(4);
  },
    methods:{
        ...mapActions(["asyncSetCurrentTabBar"]),
    }
}
</script>
<style lang="scss" scoped>

</style>