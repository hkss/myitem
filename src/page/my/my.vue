<!--  -->
<template>
  <div class="myView">
    <yd-layout>
      <div class="mybg topblank">我的</div>
      <!-- 个人资料 -->
      <div class="Msg">
        <van-row>
          <van-col span="12">
            <van-button
              size="normal"
              @click="person"
            >
              <div class="person">
                <img
                  :src="accountImage || this.localImgUrl"
                  slot="right"
                  class="seeImg"
                />
              </div>
              <div class="personText">
                <p>{{ accountName || "新用户注册" }}</p>
                <span>个人资料
                  <van-icon name="arrow" /></span>
              </div>
            </van-button>
          </van-col>
          <van-col span="12">
            <van-button></van-button>
          </van-col>
        </van-row>
      </div>
      <div
        class="account"
        v-show="this.indexIsHide == 0"
      >
        <van-row>
          <van-col span="12">
            <van-button
              size="normal"
              @click="balance"
            >
              <span>{{ msg.balance || "0" }} 元</span>
              <span>我的余额</span>
            </van-button>
          </van-col>
          <van-col span="12">
            <van-button @click="depositManger">
              <span v-if="depositType.type == 0">{{ depositType.money }} 元</span>
              <span v-if="depositType.type == 1">0 元</span>
              <span>我的押金</span>
            </van-button>
          </van-col>
        </van-row>
      </div>
      <div class="cellLink">
        <!-- 我的订单 -->
        <van-cell
          is-link
          @click="order"
          v-show="this.indexIsHide == 0"
        >
          <template slot="title">
            <img
              :src="icon.Theorder"
              slot="right"
              class="leftIcon"
            />
            <span class="custom-text">我的订单</span>
          </template>
        </van-cell>

        <!-- 待付款 -->
        <van-cell
          is-link
          @click="ItemWaitPay"
          v-show="this.indexIsHide == 0"
        >
          <template slot="title">
            <img
              :src="icon.waitpay"
              slot="right"
              class="leftIcon"
            />
            <span class="custom-text">待付款</span>
          </template>
        </van-cell>
        <!-- 客服服务 -->
        <van-cell
          is-link
          @click="service"
        >
          <template slot="title">
            <img
              :src="icon.ask"
              slot="right"
              class="leftIcon"
            />
            <span class="custom-text">客服服务</span>
          </template>
        </van-cell>

        <!-- 帮助 -->
        <van-cell
          is-link
          @click="directions"
        >
          <template slot="title">
            <img
              :src="icon.help"
              slot="right"
              class="leftIcon"
            />
            <span class="custom-text">帮助</span>
          </template>
        </van-cell>

        <div
          class="backLogin"
          v-show="this.indexIsHide == 0"
        >
          <van-button
            size="normal"
            @click="loginBack"
          >退出登录</van-button>
        </div>
      </div>
      <!--客服服务-->
      <div class="serviceIsShow">
        <van-dialog
          v-model="serviceIsShow"
          :show-cancel-button="true"
          :before-close="beforeClose"
          confirm-button-text="呼叫"
        >
          <h4>温馨提示</h4>
          <p>客服在线时间为正常工作日：上午8:30-12:00，下午13:30-17:00</p>
        </van-dialog>
      </div>
    </yd-layout>
    <router-view></router-view>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapGetters, mapMutations } from "vuex";
import { ERR_OK, imgUrl } from "api/config";
import { seeBalance } from "api/bed";
import { getBasicData } from "api/myself";
import localImgUrl from "../../../static/img/invite@3x.png";
// 公共js
import common from "common/js/common.js";
import ask_active from "../../../static/img_icon/icon_ask.png";
import help_active from "../../../static/img_icon/icon_help.png";
import waitpay_active from "../../../static/img_icon/icon_waitpay.png";
import iconwode_active from "../../../static/img_icon/icon-wode.png";
import Theorder_active from "../../../static/img_icon/Theorder.png";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      serviceIsShow: false, // 客服帮助
      finished: false,
      loading: false,
      parentMsg: "",
      // 初始化数据
      indexIsHide: 1,
      accountImage: "",
      accountName: "",
      phone: "027-88112751",
      localImgUrl: localImgUrl,
      // 开关
      icon: {
        ask: ask_active,
        help: help_active,
        waitpay: waitpay_active,
        iconwode: iconwode_active,
        Theorder: Theorder_active
      }
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["depositType", "beddirections", "msg"])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 退出重新登录
    loginBack() {
      this.$router.push({
        name: "login"
      });
      setTimeout(() => {
        this.indexIsHide = 1;
        this.accountImage = "";
        this.accountName = "";
        window.localStorage.clear();
      }, 1000)

    },
    // 是否登录
    _getBasicData() {
      common.$on(
        "msg",
        function (data) {
          if (data.t.user.image === null) {
            this.accountImage = this.localImgUrl;
          } else {
            this.accountImage = imgUrl + data.t.user.image;
          }
          this.accountName = data.t.user.name;
          this.indexIsHide = ERR_OK;
          return false;
        }.bind(this)
      );
      if (localStorage.getItem("id") != null) {
        this.baseicMsg();
      }
    },
    baseicMsg() {
      if (localStorage.getItem("image") === "null") {
        this.accountImage = this.localImgUrl;
      } else {
        this.accountImage = imgUrl + localStorage.getItem("image");
      }

      this.accountName = localStorage.getItem("name");
      this.indexIsHide = ERR_OK;
    },
    // 押金管理
    depositManger() {
      this.$router.push({
        name: "myDeposit"
      });
    },
    // 使用说明
    directions() {
      this.setDirections(true);
    },
    //  订单管理
    order() {
      this.$router.push({
        name: "myorder"
      });
    },
    // 未支付订单
    ItemWaitPay() {
      this.$router.push({
        name: "wait"
      });
    },
    // 个人资料
    person() {
      if (this.indexIsHide === ERR_OK) {
        this.$router.push({
          name: "person"
        });
      } else {
        this.$router.push({
          name: "login"
        });
        return false;
      }
    },
    // 账户充值
    balance() {
      // 测试
      this.$router.push({
        name: "balance"
      });
    },



    // 客服服务
    service() {
      this.serviceIsShow = true;
    },
    beforeClose(action, done) {
      if (action === "confirm") {
        window.location.href = "tel://" + this.phone;
        setTimeout(done, 1000);
      } else {
        done();
      }
    },
    ...mapMutations({
      setDirections: "SET_DIRECTIONS",
      setOrder: "SET_ORDER",
    })
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this._getBasicData();
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
.myView {
  // 个人资料
  .mybg {
    background: #4fd6bc;
    color: #fff;
    line-height: 56px;
    text-align: center;
  }

  .Msg {
    .van-row {
      background: #4fd6bc;
      color: #fff;
      position: relative;
      padding-top: 20px;
      padding-bottom: 10px;

      .van-col:first-child {
        .van-button {
          background: #4fd6bc;
          height: 100%;
          color: #fff;
          border: 0;
          width: 100%;
          padding-right: 0;

          span {
            position: relative;
            // float: left;
            padding-left: 5px;
            height: 20px;
            line-height: 20px;
            text-align: left;

            .van-icon {
              position: absolute;
              left: 60px;
              bottom: 1px;
            }
          }

          .person {
            float: left;

            img {
              width: 60px;
              height: 60px;
              display: inline-block;
              line-height: 30px;
              border-radius: 50%;
            }
          }

          .personText {
            float: left;
            margin-top: 18px;

            p {
              margin: 0;
              line-height: 20px;
              text-align: left;
              padding-left: 5px;
            }
          }
        }
      }

      .van-col:last-child {
        .van-button {
          background: #4fd6bc;
          color: #4fd6bc;
          position: absolute;
          right: 10px;
          top: 20px;
          height: 25px;
          line-height: 25px;
          width: 45px;
          font-size: 12px;
          padding: 0;
          text-align: center;
          border: 0;
        }
      }
    }
  }

  // 账户
  .account {
    .van-row {
      background: #8dd7c8;
      position: relative;
      padding-top: 20px;
      padding-bottom: 20px;
      margin-bottom: 10px;

      .van-col {
        .van-button {
          background: #8dd7c8;
          color: #fff;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;

          span {
            display: block;
            line-height: 20px;
          }
        }
      }

      .van-col:last-child {
        .van-button {
          span {
            border-left: 1px solid #fff;
          }
        }
      }
    }
  }

  .serviceIsShow {
    text-align: center;

    h4 {
      line-height: 64px;
    }

    p {
      text-align: left;
      width: 90%;
      font-size: 12px;
      line-height: 22px;
      margin: 0 auto 20px;
    }

    a {
      // visibility:hidden
      display: none;
    }
  }

  // 跳转
  .cellLink {
    .van-cell::after {
      border: 0;
    }
  }

  // 退出登录
  .backLogin {
    .van-button {
      width: 100%;
      font-size: 15px;
      margin-top: 10px;
    }
  }
}
</style>
