<template>
  <div class="bed">
    <div class="navbed">
      <van-nav-bar
        fixed
        title="共享陪护床"
        @click-right="manger"
      >
        <img
          src="../../../static/img_icon/more.png"
          slot="right"
          class="mangerIcon"
        />
      </van-nav-bar>
    </div>
    <div class="topblank"></div>
    <!---->

    <div class="way">
      <yd-step
        :current="active"
        current-color="#4fd6bc"
      >
        <yd-step-item>
          <span slot="bottom">扫码</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">开锁</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">支付</span>
        </yd-step-item>
      </yd-step>
      <div v-if="wayIsShow.state !=true">
        <!-- 开锁方式 -->
        <div class="wayPop">
          <div class="topservice">
            <van-row>
              <van-col span="24">
                <div class="topImg">
                  <img
                    src="../../../static/img/Sweeptheyard.png"
                    class="more"
                    @click="wx()"
                  />
                </div>
                <p>扫码开锁</p>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="24">
                <div class="topImg">
                  <img
                    src="../../../static/img/Theinput.png"
                    class="more"
                    @click="handinput()"
                  />
                </div>
                <p>输入编码开锁</p>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="pleaseSelect">
          <p class="pleaseText">请选择开锁方式</p>
          <p class="tip">提示:未在医院工作时间内不能成功开锁</p>
        </div>
      </div>
    </div>
    <!-- 解锁 -->
    <div class="lockresult">
      <!-- 开锁失败 -->
      <div class="lockTopay">
        <van-popup
          v-model="toPayPop"
          :close-on-click-overlay=false
        >
          <div class="fail">
            <p>
              <img
                src="../../../static/img/fail.png"
                alt=""
                class="failImg"
              />
            </p>
            <div class="unfinished">
              <p v-if="typeResult == 9">
                <span class="nopaytitle">您还未缴纳押金</span>
                <a
                  href="javascript:void(0)"
                  @click="toPayRouter(typeResult)"
                  class="payClickTitle"
                >
                  <van-cell
                    title="点击缴纳押金"
                    is-link
                  /></a>
              </p>
              <p v-if="typeResult == 10">
                <span class="nopaytitle">您有未支付的订单</span>
                <a
                  href="javascript:void(0)"
                  @click="toPayRouter(typeResult)"
                  class="payClickTitle"
                >
                  <van-cell
                    title="点击查看详情"
                    is-link
                  /></a>
              </p>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="locking">
        <div class="lockLoading">
          <div
            v-if="usedingState.state == true"
            class="live"
          >
            <div class="liveimg">
              <img src="../../../static/img/lock.png" />
            </div>
            <span></span> <span></span> <span></span>
            <p>正在开锁</p>
          </div>
          <div
            v-if="usedingState.usedoing == true"
            class="live"
            @click="useding"
          >
            <div class="liveimg">
              <img src="../../../static/img/lock.png" />
            </div>
            <span></span> <span></span> <span></span>
            <p>正在使用</p>
          </div>
          <!-- 开锁结果-->
          <div
            class="locked"
            v-if="refund.state == true"
          >
            <div
              class="success"
              v-if="refund.type == 1"
            >
              <img
                src="../../../static/img/success.png"
                slot="right"
              />
              <p>开锁成功</p>
            </div>

            <div
              class="failure"
              v-if="refund.type == -1"
            >
              <img
                src="../../../static/img/failure.png"
                slot="right"
              />
              <p>开锁失败!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view></router-view>

  </div>
</template>

<script>
import common from "common/js/common.js";
import { mapGetters, mapMutations } from "vuex";
import { ERR_OK } from "api/config";
import wx from "weixin-js-sdk";

import { openLock, RichScan, busy } from "api/bed";
export default {
  components: {},
  data() {
    return {
      // 初始化数据
      busyCode: "",
      // -1 开锁失败 0 开锁成功 1 未缴纳押金 2未支付订单
      typeResult: "",
      toPayPop: false, // 解锁失败(未缴纳押金或者未支付订单)
      lockLoading: false // 解锁中
    };
  },
  computed: {
    ...mapGetters([
      "orderUseState",
      "usedingState",
      "depositType",
      "openId",
      "refund",
      "wayIsShow",
      "active"
    ])
  },
  watch: {},
  methods: {
    // 信息管理
    manger() {
      this.$router.push({
        name: "manager"
      });
    },
    wx() {
      const vm = this;
      if (localStorage.getItem("id") != null) {
        var url = location.href.split("#")[0];
        // 扫一扫
        RichScan(url).then(res => {
          let sign = res; //后端返回的微信的数据
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: sign.appId, // 必填，公众号的唯一标识
            timestamp: sign.timestamp, // 必填，生成签名的时间戳
            nonceStr: sign.nonce_str, // 必填，生成签名的随机串
            signature: sign.signature, // 必填，签名，见附录1
            jsApiList: ["scanQRCode", "openLocation", "getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function () {
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
              scanType: ["qrCode"],
              success: function (res) {
                var result = res.resultStr;
                vm._openLock(result)
              }
            });
          });
        });
      } else {
        // this.$toast("您还未登录");
        this.$router.push({
          name: 'login',
        })
      }
    },
    handinput() {
      if (localStorage.getItem("id") != null) {
        this.$router.push({
          name: "serial"
        });
      } else {
        // this.$toast("您还未登录");
        this.$router.push({
          name: 'login',
        })
      }
    },
    _getData() {
      const vm = this;
      if (localStorage.getItem("id") != null) {
        common.$on(
          "handresult",
          function (data) {
            // 先判断是否缴纳押金
            if (vm.depositType.type === ERR_OK) {
              // 已缴纳押金
              // 开锁
              vm._openLock(data);
            } else if (vm.depositType.type === 1) {
              // 未缴纳押金
              vm.setTabActive(2)
              vm.setWayisshow({
                state: true
              })
              vm.setUsedingState({
                state: true,
              });
              setTimeout(() => {
                vm.setUsedingState({
                  state: false,
                })
                vm.setRefund({
                  state: true,
                  type: -1,
                })
                setTimeout(() => {
                  vm.toPayPop = true;
                  vm.typeResult = 9;
                }, 1000)
              }, 2000)
            } else {
            }
            return false;
          }.bind(vm)
        );
        busy().then(res => {
          if (res.error_code * 1 === 1) {
            this.setTabActive(2)
            vm.busyCode = res.data.chaperonage_bed_code;
            vm.setWayisshow({
              state: true
            })
            vm.setUsedingState({
              state: false,
              usedoing: true,
              res: res.data
            });
            // vm.$toast("有正在使用订单");
          }
        });
      } else {
        vm.setWayisshow({
          state: false
        })
        vm.setUsedingState({
          state: false,
          usedoing: false,
        })
      }
    },

    toPayRouter(index) {
      const vm = this;
      vm.setRefund({
        state: false,
      })
      vm.setWayisshow({
        state: false
      })
      vm.setUsedingState({
        state: false,
      });
      // 未支付订单
      if (index === 10) {
        vm.$router.push({
          name: "wait"
        });
      } else if (index === 9) {
        // 未缴纳押金
        vm.$router.push({
          name: "deposit"
        });
      }
      vm.setTabActive(1)
      vm.toPayPop = false;
    },
    // 正在使用
    useding() {
      this.$router.push({
        name: "useDing",
        params: {
          id: this.usedingState.res.chaperonage_bed_code
        }
      });
    },
    _openLock(code) {
      const vm = this;
      openLock(code).then(res => {
        this.setTabActive(2)
        vm.setWayisshow({
          state: true
        })
        vm.setUsedingState({
          state: true,
        });

        setTimeout(() => {

          vm.setUsedingState({
            state: false,
            res: res.data,
          })
          if (res.data * 1 != "" && res.error_code * 1 === 1) {
            // 解锁失败 9.未缴纳押金，10.订单未支付，11.该账户被冻结
            vm.setRefund({
              state: true,
              type: -1,
            })
            setTimeout(() => {
              vm.toPayPop = true;
              vm.typeResult = parseInt(res.data);
            }, 1000)

            return false;
          } else if (res.error_code * 1 === ERR_OK) {
            // 解锁成功
            vm.setRefund({
              state: true,
              type: 1,
            })
            setTimeout(() => {
              vm.$router.push({
                name: "useDing",
                params: {
                  id: code
                }
              });
            }, 1500);
          } else if (res.data * 1 == "" && res.error_code * 1 === 1) {
            vm.setRefund({
              state: true,
              type: -1,
            })
            setTimeout(() => {
              vm.setTabActive(1)
              vm.setWayisshow({
                state: false
              })
              vm.setRefund({
                state: false,
              })
              vm.$toast(res.error_msg)
            }, 1000)
          }
        }, 2000)

      });
    },

    ...mapMutations({
      setDepositType: "SET_DEPOSIT_TYPE",
      setTrueManger: "SET_BEDMANAGER",
      setOrderUseState: "SET_ORDER_USE_STATE",
      setUsedingState: "SET_USEDING_STATE",
      setOrder: "SET_ORDER",
      setRefund: "SET_REFUND",
      setWayisshow: "SET_WAYISSHOW",
      setTabActive: "SET_ACTIVE",
    })
  },
  created() {
    this._getData();
  },
  mounted() { },
  beforeCreate() { },
  beforeMount() { },
  beforeUpdate() { },
  updated() { },
  beforeDestroy() { },
  destroyed() { },
  activated() { }
};
</script>
<style scoped lang="stylus">
.wayPop {
  width: 200px;
  height: 302px;
  background: #f5f3f4;
  z-index: 10 !important;
  position: fixed;
  top: 50%;
  left: 50%;
  max-height: 100%;
  overflow-y: auto;
  -webkit-transition: 0.3s ease-out;
  transition: 0.3s ease-out;
  -webkit-overflow-scrolling: touch;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
}

.van-steps {
  background: #f5f3f4;
  height: 72px;
  width: 80%;
  height: 72px;
  position: absolute;
  top: 46px;
  z-index: 10;
  margin-left: 10%;
  margin-right: 10%;
  padding: 0;

  .van-steps__items .van-steps__items--alone {
    height: 70px !important;
  }

  .van-step__title {
    position: relative;
    font-size: 14px;
    top: 50px;
  }

  .van-step--horizontal {
    line-height: 100px;
    height: 60px;
  }
}

.useding {
  position: relative;
  z-index: 100;
}

.lockresult {
  // 开锁失败
  .lockTopay {
    .van-popup {
      text-align: center;
      width: 57%;
      height: 320px;
      font-size: 13px;

      .failImg {
        margin: 50px 0 0;
      }

      .unfinished {
        color: #999;
        font-size: 14px;
        display: block;
        height: 100px;

        .nopaytitle {
          padding-top: 20px;
        }

        p {
          span {
            display: block;
          }

          a {
            display: block;
            height: 45px;
            letter-spacing: 1px;
            position: absolute;
            z-index: 10000;
            width: 100%;
            margin: 0;
            bottom: 25px;
            left: 0;
            line-height: 30px;
          }
        }
      }
    }
  }

  .locking {
    // 开锁中
    .lockLoading {
      .live {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 12;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -70px;

        .liveimg {
          width: 100px;
          height: 100px;
          background: #b0e2d7;
          border-radius: 50%;
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 12;
          margin-left: -50px;
          margin-top: -70px;

          img {
            z-index: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -30px;
            margin-left: -25px;
          }
        }

        @keyframes living {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }

          50% {
            transform: scale(1.5);
            opacity: 0; /* 圆形放大的同时，透明度逐渐减小为0 */
          }

          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }

        span {
          position: absolute;
          width: 100px;
          height: 100px;
          left: 0;
          bottom: 0;
          border-radius: 50%;
          background: #b0e2d7;
          -webkit-animation: living 3s linear infinite;
          border: 10px solid #bce5dd;
          z-index: -1;
        }

        span:nth-child(2) {
          -webkit-animation-delay: 1s; /* 第二个span动画延迟1.5秒 */
        }

        span:nth-child(3) {
          -webkit-animation-delay: 1.5s; /* 第三个span动画延迟1.5秒 */
        }

        p {
          font-size: 14px;
          text-align: center;
          padding-top: 25px;
          color: #4fd6bc;
          position: absolute;
          bottom: -40px;
          width: 100%;
        }
      }
    }

    // 开锁成功
    .locked {
      div {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -70px;
        z-index: 12;
        text-align: center;
      }

      .success {
        p {
          color: #4fd6bc;
          margin: 20px 0 0px;
          font-size: 14px;
          letter-spacing: 2px;
        }
      }

      .failure {
        p {
          margin: 20px 0 0px;
          color: #ffa500;
          font-size: 14px;
          letter-spacing: 2px;
        }
      }

      h4 {
        font-size: 24px;
        font-weight: 400;
        margin: 0;
      }
    }
  }
}
</style>
