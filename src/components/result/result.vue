<!---->
<template>
  <div>
    <div
      class="resultViewPage"
      v-if="resultType.state==true"
    >
      <van-nav-bar
        fixed
        title="支付"
        left-arrow
        @click-left="onClickLeft"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <div class="resultCon">
        <div
          class="success"
          v-if="resultType.type == 1"
        >
          <img
            src="../../../static/img/success.png"
            slot="right"
          />
          <p>支付成功</p>
        </div>
        <div
          class="failure"
          v-if="resultType.type != 1"
        >
          <img
            src="../../../static/img/failure.png"
            slot="right"
          />
          <p>支付失败!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import common from "common/js/common.js";
// 使用说明
export default {
  // import引入的组件需要注入到对象中才能使用

  components: {},
  data() {
    // 这里存放数据
    return {
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["resultType"])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    onClickLeft() {
      this.setResult({
        state: false,
        type: ''
      })
      this.$router.push({
        path: `/bed`
      });
    },
    getData() {
    },
    ...mapMutations({
      setResult: "SET_RESULT_TYPE",
    })
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData()
    // 获取get传递过来的动态路由的值
    // this.resultType = this.$route.params.id;
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() { },
  beforeCreate() { }, // 生命周期 - 创建之前
  beforeMount() { }, // 生命周期 - 挂载之前
  beforeUpdate() { }, // 生命周期 - 更新之前
  updated() { }, // 生命周期 - 更新之后
  beforeDestroy() { }, // 生命周期 - 销毁之前
  destroyed() { }, // 生命周期 - 销毁完成
  activated() { } // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="stylus">
.resultViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 154;
  background: #f5f3f4;
  z-index: 1000;
}

.resultCon {
  position: fixed;
  text-align: center;
  height: 200px;
  width: 200px;
  margin-left: -100px;
  left: 50%;
  margin-top: -100px;
  top: 45%;

  .success {
    p {
      margin: 40px 0 0px;
      color: #4fd6bc;
    }
  }

  .failure {
    p {
      margin: 40px 0 0px;
      color: orange;
    }
  }

  h4 {
    font-size: 24px;
    font-weight: 400;
    margin: 0;
  }
}

.seeQuestion {
  color: #000;

  .bottomQues {
    position: fixed;
    bottom: 20px;
    left: 0;
    width: 100%;
    text-align: center;
  }
}
</style>
