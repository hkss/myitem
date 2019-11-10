<!--  -->
<template>
  <div class="managerViewPage">
    <van-nav-bar
      fixed
      left-arrow
      class="TabNavActive"
      @click-left="onClickLeft"
      title="信息管理"
    >
    </van-nav-bar>
    <div class="topblank"></div>
    <div class="manger">
      <van-cell
        is-link
        @click="depositManager"
      >
        <template slot="title">
          <img
            :src="icon.Thedeposit"
            slot="right"
            class="leftIcon"
          />
          <span class="custom-text">押金管理</span>
        </template>
      </van-cell>
      <van-cell
        is-link
        @click="order"
      >
        <template slot="title">
          <img
            :src="icon.report"
            slot="right"
            class="leftIcon"
          />
          <span class="custom-text">我的订单</span>
        </template>
      </van-cell>
      <van-cell
        is-link
        @click="directionsManager"
      >
        <template slot="title">
          <img
            :src="icon.using"
            slot="right"
            class="leftIcon"
          />
          <span class="custom-text">使用说明</span>
        </template>
      </van-cell>
    </div>
    <router-view></router-view>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { deposit } from "api/bed";

import report from '../../../static/img_icon/report.png'
import using from '../../../static/img_icon/icon_using.png'
import Thedeposit from '../../../static/img_icon/Thedeposit.png'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      // 开关
      icon: {
        report: report,
        using: using,
        Thedeposit: Thedeposit
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["bedmanager"])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    onClickLeft() {
      // this.setFalseManger(false);
      this.$router.back()
      // ({
      //   name: 'bed'
      // })
    },
    getData() {

    },
    // 押金管理
    depositManager() {
      var user_id = localStorage.getItem("id") ? localStorage.getItem("id") : '';
      if (user_id != '') {
        this.$router.push({
          name: 'deposit',
        })
      } else {
        // this.$toast('您还未登录')
        this.$router.push({
          name: 'login',
        })
      }
    },
    // 订单管理
    order() {
      var user_id = localStorage.getItem("id") ? localStorage.getItem("id") : '';
      if (user_id != '') {
        this.setOrder({
          type: 2
        })
        this.$router.push({
          name: 'order'
        })
      } else {
        // this.$toast('您还未登录')
        this.$router.push({
          name: 'login',
        })
      }
    },
    // 使用说明
    directionsManager() {
      this.setDirections(true)
    },
    ...mapMutations({
      setDepositType: 'SET_DEPOSIT_TYPE',
      setFalseManger: "SET_BEDMANAGER",
      setOrder: "SET_ORDER",
      setDirections: "SET_DIRECTIONS",

    })
  },

  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData()
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
}
</script>
<style scoped lang="stylus">
// @import url(); 引入公共css类
.managerViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 152;
  background: #f5f3f4;

  .manger {
    // 使用说明导航
    .van-nav-bar {
      z-index: 13 !important;
    }

    .van-cell {
      margin-top: 10px;
    }
  }
}
</style>
