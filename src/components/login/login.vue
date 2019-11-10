<!---->
<template>
  <div class="routerViewPage">
    <van-nav-bar
      fixed
      title="登录"
      left-arrow
      @click-left="loginBack"
    >
    </van-nav-bar>
    <div class="topblank"></div>
    <div class="loginImport">
      <div class="loginBg">
        <img
          src="../../../static/img/background-login.png"
          slot="right"
        />
      </div>
      <div class="loginCon">
        <van-cell-group>
          <van-field
            v-model="phone"
            required
            clearable
            icon="contact"
            label="手机号"
            placeholder="请输入手机号"
            @click-icon="$toast('question')"
          />
          <van-field
            v-model="sms"
            required
            center
            clearable
            label="验证码"
            placeholder="请输入短信验证码"
          >
            <van-button
              slot="button"
              size="small"
              type="primary"
              :class="{ disabled: !this.canClick }"
              @click="countDown"
            >
              {{ content }}</van-button>
          </van-field>
        </van-cell-group>
        <div class="confirmLogin">
          <van-button
            size="normal"
            @click="login"
          >登录</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters, mapMutations } from "vuex";
import { getcode, checkcode } from "api/islogin";
import { deposit } from "api/bed";
import { ERR_OK } from "api/config";
import common from "common/js/common.js";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      // 初始化数据
      persons: [],
      phone: "",
      sms: "",
      content: "发送验证码",
      totalTime: 60,
      canClick: true //添加canClick
    };
  },

  //监听属性 类似于data概念
  computed: {
    ...mapGetters(["islogin", "depositType"])
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    loginBack() {
      // this.setIsLoin(false);
      this.$router.back();
    },
    countDown() {
      let phone = this.phone;
      let that = this;
      if (phone == "") {
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
          that.canClick = true; //这里重新开启
        }
      }, 1000);
      // 获取验证码
      getcode(phone).then(res => {
        if (res.returns === "success") {
          that.$toast("验证码已发至您手机，请注意查收");
        }
      });
    },

    login() {
      let phone = this.phone;
      let sms = this.sms;
      if (sms.length != 6) {
        this.$toast("请填写正确的验证码");
        return false
      }
      // 校验验证码登录
      if (phone != "" && sms != "") {
        checkcode(phone, sms).then(res => {
          if (res.t.pass == "true") {
            this.$dialog.toast({
              mes: "登录成功",
              icon: "success",
              timeout: 1500
            });
            localStorage.setItem("id", res.t.user.id);
            localStorage.setItem("image", res.t.user.image);
            localStorage.setItem("name", res.t.user.name);
            localStorage.setItem("balance", res.t.user.balance);
            localStorage.setItem("mobileNo", res.t.user.mobileNo);
            localStorage.setItem("pwd", res.t.user.passWord);
            localStorage.setItem("idCardNo", res.t.user.idCardNo);
            localStorage.setItem("nickName", res.t.user.nickName);
            localStorage.setItem("sex", res.t.user.sex);
            common.$emit('msg', res);
            this.setMsg({
              balance: res.t.user.balance
            })
            // 是否缴纳押金
            deposit().then(response => {
              this.setDepositType({
                type: (response.error_code) * 1,
                money: (response.cash_pledge_money) * 1
              })
            });
            this.$router.push({
              name: 'my',
            })
            this.phone = '';
            this.sms = '';
          }
        });
      } else {
        this.$toast("手机号码或验证码有误，请重填");
        return false;
      }
    },
    ...mapMutations({
      setIsLoin: "SET_ISLOGIN",
      setMsg: "SET_MSG",
      setDepositType: "SET_DEPOSIT_TYPE",
      setOpenId: "SET_OPENID",
    })
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() { },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() { },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="stylus" scoped>
// @import url(); 引入公共css类
.loginImport {
  .loginBg {
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .loginCon {
    z-index: 1000;
    width: 80%;
    position: relative;
    margin: 150px auto;
    flex-direction: row;
    align-items: center;

    .van-cell {
      border-bottom: 1px solid #eee;
      background-color: transparent;
    }

    .confirmLogin {
      margin-top: 20px;

      .van-button {
        width: 100%;
        background-color: #4fd6bc;
        color: white;
        font-size: 16px;
      }
    }

    .van-cell-group {
      background-color: transparent;

      .van-button {
        width: 100%;
        padding: 0 4px !important;
        color: white;
      }

      .disabled {
        background-color: #ddd;
        border-color: #ddd;
        color: #000;
        cursor: not-allowed; // 鼠标变化
      }
    }
  }
}
</style>
