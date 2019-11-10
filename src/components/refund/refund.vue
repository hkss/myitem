<!---->
<template>
    <div class="refundViewPage">
      <van-nav-bar
        fixed
        left-arrow
        @click-left="onClickLeft"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <div class="refundCon">
        <div
          class="success"
          ref="refunding"
        >
          <img
            src="../../../static/img/doing.png"
            slot="right"
          />
          <p>正在退还中</p>
          <p class="reason">系统将在2-7个工作日将押金退还至您的账户</p>
        </div>
        <div v-if="refund.state == true">
          <div
            class="success"
            v-if="refund.type == 1"
          >
            <img
              src="../../../static/img/success.png"
              slot="right"
            />
            <p>退还成功</p>
            <p class="reason">已将{{depositType.money}}元退还至您的账户</p>
          </div>
          <div
            class="failure"
            v-if="refund.type == -1"
          >
            <img
              src="../../../static/img/failure.png"
              slot="right"
            />
            <p>退还失败!</p>
            <p class="reason">失败原因：网路不稳定</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import common from "common/js/common.js";
import { weChat_refun, deposit } from "api/bed";
import { ERR_OK } from "api/config";
// 使用说明
export default {
  // import引入的组件需要注入到对象中才能使用

  components: {},
  data() {
    // 这里存放数据
    return {
      error_code: '',
      cost: ''
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["refund", "depositType"])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    onClickLeft() {

      this.$router.push({
        path: `/my`
      });
    },
    getData() {
      const vm = this;
      setTimeout(() => {
        deposit().then(res => {
          if (vm.error_code === ERR_OK) {
            // 退款失败
            vm.setRefund({
              state: true,
              type: -1,
            })
            setTimeout(() => {
              vm.setDepositType({
                type: (res.error_code) * 1,
                money: (res.cash_pledge_money) * 1
              })
              vm.setRefund({
                state: false,
              })
              this.$router.push({
                name: "myDeposit"
              });
            }, 1000)
            vm.$refs.refunding.style.display = "none";

          } else {
            // 退款成功
            vm.setRefund({
              state: true,
              type: 1,
            })
            setTimeout(() => {
              vm.setDepositType({
                type: (res.error_code) * 1,
                money: (res.cash_pledge_money) * 1
              })
              vm.setRefund({
                state: false,
              })
              this.$router.push({
                name: "myDeposit"
              });

            }, 1000)

            vm.$refs.refunding.style.display = "none";

          }

        });
      }, 5000);

    },
    ...mapMutations({
      setRefund: "SET_REFUND",
      setDepositType: "SET_DEPOSIT_TYPE",
    })
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
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
.refundViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 156;
  background: #fff;
  z-index: 1000;

  .van-nav-bar {
    background: #fff;

    .van-icon {
      color: #000;
    }
  }
}

.refundCon {
  position: fixed;
  text-align: center;
  height: 200px;
  width: 100%;
  margin-top: -100px;
  top: 45%;

  .success {
    p {
      margin: 30px 0 0px;
      color: #4fd6bc;
      font-size: 14px;
    }

    .reason {
      color: #000;
      margin-top: 10px;
      font-size: 16px;
    }
  }

  .failure {
    p {
      margin: 30px 0 0px;
      color: orange;
      font-size: 14px;
    }

    .reason {
      color: #000;
      margin-top: 10px;
      font-size: 16px;
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
