<!---->
<template>
  <div class="payway">
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell
          title-class="radioIcon"
          clickable
          @click="radio = '1'"
        >
          <template slot="title">
            <img
              :src="icon.wx"
              slot="right"
              class="leftPayIcon"
            />
            <span class="custom-text">微信支付</span>
          </template>
          <van-radio name="1" />
        </van-cell>
        <van-cell
          title-class="radioIcon"
          clickable
          @click="radio = '2'"
        >
          <template slot="title">
            <img
              :src="icon.yue"
              slot="right"
              class="leftPayIcon"
            />
            <span class="custom-text">余额支付</span>
          </template>
          <van-radio name="2" />
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <div class="payBtn">
      <a
        href="javascript:void(0)"
        @click="seeQuestion"
        class="seeQuestion"
      >
        对收费标准有疑问?</a>
      <van-button
        type="default"
        class="toPay"
        @click="toPay"
      >
        <span>支付</span>
      </van-button>
      <van-button
        type="default"
        class="waitPay"
        @click="waitPay"
      >
        <span>下次再说</span>
      </van-button>
    </div>
    <!-- 余额支付弹框 -->

    <div class="balancePayPop">
      <van-dialog
        v-model="balancePayPop"
        confirm-button-text="确定"
        :showCancelButton=true
        :before-close="payBeforeClose"
      >
        <div class="confirmCon">
          <h4>验证支付</h4>
          <p>
            付款验证：<span>本次交易需要短信确认，验证码将发送至您的手机{{phone}}</span>
          </p>
          <van-cell-group>
            <van-field
              v-model="sms"
              clearable
              placeholder="请输入短信验证码"
            >
              <van-button
                slot="button"
                :class="{ disabled: !this.canClick }"
                @click="countDown"
                size="small"
              >{{ content }}</van-button>
            </van-field>
          </van-cell-group>
        </div>
      </van-dialog>
    </div>
  </div>
</template>


<script>
// 公共js
import common from "common/js/common.js";
import wx from "../../../static/img_icon/wx.png";
import yue from "../../../static/img_icon/yue.png";
import { ERR_OK } from "api/config";
import { mapGetters, mapMutations } from "vuex";
import { getBedCode, checkBedCode, waitPay, weChatOrderPay, seeBalance } from "api/bed";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    orderId: String,
    required: true
  },
  data() {
    // 这里存放数据
    return {
      // 开关
      balancePayPop: false, // 是否开启余额支付
      radio: "1",
      sms: "",
      content: "发送验证码",
      totalTime: 60,
      canClick: true, // 添加canClick
      user_id: localStorage.getItem("id") ? localStorage.getItem("id") : '',
      phone: localStorage.getItem("mobileNo"),
      icon: {
        wx: wx,
        yue: yue
      }
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["openId"])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    countDown() {
      let phone = this.phone;
      let that = this;
      if (phone === "") {
        if (!/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
          that.$toast("手机号码有误，请重填");
          return false;
        }
      }
      if (!that.canClick) return;
      that.canClick = false;
      that.content = that.totalTime + "s后重新发送";
      let clock = window.setInterval(() => {
        that.totalTime--;
        that.content = that.totalTime + "s后重新发送";
        if (that.totalTime < 0) {
          window.clearInterval(clock);
          that.content = "重新发送验证码";
          that.totalTime = 60;
          that.canClick = true; // 这里重新开启
        }
      }, 1000);
      // 获取验证码
      getBedCode(localStorage.getItem("mobileNo")).then(res => {
        if (res.returns === "success") {
          that.$toast("验证码已发至您手机，请查收");
        }
      });
    },

    seeQuestion() {
      this.setDirections(true);
    },
    waitPay() {
      this.$router.push({
        name: "bed"
      });
    },
    toPay() {
      //接口对接
      if (this.radio === '2') {
        this.balancePayPop = true;
        // 获取验证码
        // this.countDown()
        if (Number(this.phone) && String(this.phone).length === 11) {
          var mobile = String(this.phone)
          var reg = /^(\d{3})\d{4}(\d{4})$/
          this.phone = mobile.replace(reg, '$1****$2')
        } else {
          return this.phone
        }
      } else {
        // 微信支付
        weChatOrderPay(this.openId.openId, this.orderId).then(res => {
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
        })
      }
    },
    jsApiCall(data) {
      var vm = this
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
            })
            vm.$router.push({
              name: "bed"
            });
          } else if (res.err_msg === "get_brand_wcpay_request:cancel") {

          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            vm.$toast("网络异常，请重试");
          }
        }
      );
    },
    payBeforeClose(action, done) {
      if (action === "confirm") {
        this.confirPay();
        setTimeout(done, 1000);
      } else {
        done();
        this.$toast("已取消")
      }
    },
    //余额支付
    confirPay() {
      if (this.sms == "") {
        this.$toast("请输入验证码")
        return false
      }
      checkBedCode(localStorage.getItem("mobileNo"), this.sms).then(res => {
        if (res.returns === "success") {
          waitPay(this.orderId, this.radio).then(response => {
            this.setResult({
              state: true,
              type: response.error_code
            })
            // 查询余额
            seeBalance().then(balanceRes => {
              this.setMsg({
                balance: balanceRes.balance
              })
            })
            this.balancePayPop = false;
            this.sms = "";
          })
        } else {
          this.$toast("验证码有误")
        }

      })
    },
    payresultBack() {
    },
    ...mapMutations({
      setDirections: "SET_DIRECTIONS",
      setResult: "SET_RESULT_TYPE",
      setMsg: "SET_MSG",
    })
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
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
// @import url(); 引入公共css类
.payway {
  background: #f5f3f4;

  .van-radio-group {
    padding-top: 20px;
    text-align: left;

    .van-cell {
      background: #f5f3f4;
      border: 0;

      .leftPayIcon {
        height: 25px;
        width: 25px;
        margin: -6px 0;
      }
    }
  }

  .payBtn {
    position: relative;
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    background: #f5f3f4;
    height: 115px;

    .seeQuestion {
      font-size: 14px;
      display: block;
      text-align: center;
      line-height: 30px;
    }

    .toPay {
      width: 50%;
      color: #fff;
      background: #4fd6bc;
      font-size: 14px;
      letter-spacing: 2px;
      height: 40px;
      line-height: 36px;
      float: left;
      border: 0;
    }

    .waitPay {
      width: 50%;
      color: #fff;
      background: #B5E3D9;
      font-size: 14px;
      letter-spacing: 2px;
      height: 40px;
      line-height: 36px;
      float: left;
      border: 0;
    }
  }

  // 余额支付弹框
  .balancePayPop {
    .van-dialog {
      border-radius: 5px;

      .confirmCon {
        width: 90%;
        margin: 0 auto;
        font-size: 14px;
        text-align: left;

        h4 {
          font-weight: 400;
          text-align: center;
          font-size: 18px;
          margin: 0;
          padding-top: 19px;
          line-height: 40px;
        }

        p {
          span {
            line-height: 22px;
          }
        }

        .van-cell-group {
          margin: 10px 0 21px;

          .van-field {
            padding: 0;
            border: 0;
          }

          .van-button {
            font-size: 12px;
            background: #ccc;
            border-radius: 5px;
            color: #000;
            height: 36px;
            line-height: 36px;
          }
        }

        .confirPay {
          .van-button {
            background: #4fd6bc;
            color: #fff;
            font-size: 16px;
            width: 90%;
            height: 36px;
            line-height: 36px;
            border-radius: 5px;
            position: absolute;
            bottom: 25px;
            left: 0px;
            right: 0px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      }
    }
  }
}
</style>
