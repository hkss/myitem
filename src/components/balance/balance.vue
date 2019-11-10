<!--  -->
<template>
  <div class='routerViewPage balance'>
    <van-nav-bar
      fixed
      title="账户充值"
      left-arrow
      @click-left="routerBack"
      @click-right="statement"
    > </van-nav-bar>
    <div class="topblank"></div>
    <div class="AmountOfAccount">
      <div class="AccountWH">
        <div class="title">账户金额:(元)</div>
        <h4>{{msg.balance||'0'}}</h4>
        <p>温馨提示 :<br><span>账户金额可用于电话咨询、预约医生、送礼物、购买商品等。</span></p>
      </div>
    </div>
    <van-cell-group>
      <van-field
        v-model="value"
        placeholder="请填写充值金额"
      />
    </van-cell-group>
    <!-- 付款 -->
    <div class="payway">
      <div class="payBtn">
        <van-button
          type="default"
          @click="wxpay"
        >
          <span>微信充值</span>
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
// 付款
import { mapGetters, mapMutations } from "vuex";
import { recharge, seeBalance } from "api/bed";
import wx from "weixin-js-sdk";
import { ERR_OK } from "api/config";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      value: '',
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters(["openId", "msg"])

  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    routerBack() {
      this.$router.back()
    },
    _getData() {
    },
    wxpay() {
      if (this.value === '') {
        this.$toast("请填写充值金额")
        return false
      }
      recharge(this.openId.openId, this.value).then(res => {
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
            // 查询余额
            seeBalance().then(res => {
              vm.setMsg({
                balance: res.balance
              })
              vm.$router.push({
                path: `/my`
              });
            })

          } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
            vm.$toast("取消充值")
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            vm.$toast("网络异常，请重试");
          }
        }
      );
    },
    statement() { },
    ...mapMutations({
      setMsg: "SET_MSG",
    })
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this._getData()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped lang="stylus">
// @import url(); 引入公共css类
.balance {
  .AmountOfAccount {
    font-size: 14px;
    position: relative;
    background: #fff;

    .AccountWH {
      width: 92%;
      margin: 0 auto;

      .title {
        line-height: 40px;
        font-size: 14px;
        font-weight: 600;
        padding-top: 10px;
      }

      h4 {
        font-size: 24px;
        margin: 0;
      }

      p {
        color: #999;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 20px;
        padding-top: 10px;

        span {
          padding-left: 30px;
        }
      }
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
}
</style>