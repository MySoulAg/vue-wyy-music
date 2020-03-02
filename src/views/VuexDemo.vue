<template>
  <div>
    <p>{{test1}}{{test2}}</p>
    <p>{{getTest1}}{{getTest2}}</p>
    <button @click="fun1">同步修改1</button>
    <button @click="fun2">同步修改2</button>
    <br />
    <button @click="fun3">异步修改1</button>
    <button @click="fun4">异步修改2</button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations,mapActions } from "vuex";
export default {
  computed: {
    ...mapState(["test1", "test2"]),
    ...mapGetters(["getTest1", "getTest2"])
  },

  methods: {
    ...mapMutations(["updata1", "updata2"]),
    ...mapActions(["acyncupdata1", "asyncupdata2"]),
    fun1() {
      this.updata1("同步修改1");
    },

    fun2() {
      this.updata2("同步修改2");
    },

    fun3() {
      this.acyncupdata1("异步修改1");
    },

    fun4() {
      this.asyncupdata2("异步修改2");
    }
  }
};
</script>
<style lang="sass" scoped>

</style>