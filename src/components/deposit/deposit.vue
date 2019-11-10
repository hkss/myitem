<!--  -->
<template>
  <div>
    <!-- 退还押金 -->
    <div
      class="depositViewPage"
      v-if="depositType.type == 0"
    >
      <van-nav-bar
        fixed
        title="押金管理"
        left-arrow
        @click-left="onClickLeft"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <div class="deposit">
        <p>押金（元）</p>
        <h4><span>￥</span>{{depositType.money}}</h4>
        <p class="tip">温馨提示：押金可随时退还</p>
      </div>
      <div class="payBtn backdMoney">
        <a
          href="javascript:void(0)"
          @click="directionsManager"
          class="seeQuestion"
        >
          对押金规则不清楚？</a>
        <van-button
          type="default"
          @click="refunddeposit()"
        >退还
        </van-button>
      </div>
      <router-view></router-view>
    </div>
    <!-- 缴纳押金 -->
    <div
      class="depositViewPage toPayDeposit"
      v-if="depositType.type == 1"
    >
      <van-nav-bar
        fixed
        title="缴纳押金"
        left-arrow
        @click-left="onClickLeft"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <div class="deposit">
        <p class="moneyTitle">金额</p>
        <h4>{{depositType.money}}元</h4>
        <p class="tip">押金随心退，安全速到账</p>
      </div>
      <div class="payway">
        <div class="payBtn">
          <a
            href="javascript:void(0)"
            @click="seeQuestion"
            class="seeQuestion"
          >
            对押金规则不清楚？</a>
          <van-button
            type="default"
            @click="payMoney"
          >
            <span>微信充值</span>
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import common from "common/js/common.js";

import { weChatPay, weChat_refun, deposit } from "api/bed";
import wx from "weixin-js-sdk";
import { ERR_OK } from "api/config";
// 支付结果
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      resultType: "",
      currentTabNav: ["使用说明", "退还结果"],
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["depositType", "openId"])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    //返回
    onClickLeft() {
      this.$router.back();
    },
    seeQuestion() {
      this.setDirections(true);
    },
    // 充值押金
    payMoney() {
      weChatPay(this.openId.openId).then(res => {
        if (typeof WeixinJSBridge === "undefined") {
          if (document.addEventListener) {
            document.addEventListener(
              "WeixinJSBridgeReady",
              this.jsApiCall(res),
              false
            );
          } else if (document.attachEvent) {
            document.attachEvent(
              "WeixinJSBridgeReady",
              this.jsApiCall(res)
            );
            document.attachEvent(
              "onWeixinJSBridgeReady",
              this.jsApiCall(res)
            );
          }
        } else {
          this.jsApiCall(res);
        }
      });
    },
    jsApiCall(data) {
      const vm = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest", {
          debug: true,
          appId: data.appId, // 公众号名称，由商户传入
          timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
          nonceStr: data.nonceStr, // 随机串
          package: data.package,
          signType: "MD5", // 微信签名方式：
          paySign: data.paySign, // 微信签名
          jsApiList: ["chooseWXPay"]
        },
        function (res) {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            vm.$router.push({
              path: `/my`
            });
          } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
            vm.$toast("取消充值")
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            vm.$toast("网络异常，请重试");
          }
          deposit().then(response => {
            vm.setDepositType({
              type: (response.error_code) * 1,
              money: (response.cash_pledge_money) * 1
            })
          });
        }
      );
    },
    // 使用说明
    directionsManager() {
      this.setDirections(true);
    },
    // 退还押金
    refunddeposit() {
      weChat_refun().then(res => {
        if ((res.result) * 1 == 1) {
          this.$router.push({
            name: "myRefund"
          });
        } else {
          this.$toast(res.error);
        }
      });
    },
    ...mapMutations({
      setDepositType: "SET_DEPOSIT_TYPE",
      setDirections: "SET_DIRECTIONS"
    })
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
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
<style lang="stylus" scoped>
// @import url(); 引入公共css类
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.depositViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 154;
  background: #fff;

  .deposit {
    text-align: center;
    position: relative;
    top: 15%;

    h4 {
      color: orange;
      font-size: 23px;
      font-weight: 400;
      line-height: 10px;
      margin: 10px 0;
    }

    p {
      line-height: 48px;
    }

    .tip {
      color: #333;
      font-size: 14px;
    }
  }

  .payBtn {
    position: fixed;
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 20px;
    padding-bottom: 15px;
    background: #f5f3f4;
    bottom: 0;

    .seeQuestion {
      font-size: 14px;
      display: block;
      text-align: center;
      line-height: 30px;
    }

    .van-button {
      background: #1AAD19;
      color: #fff;
      font-size: 16px;
      width: 100%;
    }
  }

  .backdMoney {
    background: #fff;

    .van-button {
      background: #4fd6bc;
    }
  }
}

.toPayDeposit {
  background: #f5f3f4;
}
</style>
