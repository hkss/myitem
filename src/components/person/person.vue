<!--  -->
<template>
  <div class="routerViewPage">
    <van-nav-bar
      fixed
      title="个人资料"
      left-arrow
      @click-left="routerBack"
      @click-right="saveMsg"
    ></van-nav-bar>

    <div class="topblank"></div>
    <div class="person">
      <van-nav-bar
        left-text="头像"
        @click-right="personImg"
      >
        <img
          :src="accountImage || '../../../static/img/invite@3x.png'"
          slot="right"
          class="personImg"
        />

        <van-icon
          name="arrow"
          slot="right"
        />
      </van-nav-bar>
      <div class="personCon">
        <van-cell :value="accountUserName">
          <template slot="title">
            <span class="custom-text">账号</span>
          </template>
        </van-cell>
        <div class="phone">
          <van-cell
            :value="accountMobile"
            is-link
          >
            <template slot="title">
              <span class="custom-text">绑定手机号</span>
            </template>
          </van-cell>
        </div>
        <van-cell
          title="姓名"
          :value="accountName"
        />
        <van-cell-group>
          <van-field
            clearable
            label="昵称"
            :value="accountNickname || '新用户注册'"
            placeholder="请输入昵称"
          />
        </van-cell-group>

        <div class="sex">
          <van-cell title="性别" />
          <div class="radio">
            <yd-radio-group
              v-model="accountSex"
              size="20"
            >
              <yd-radio val="1"><span style="font-size: 24px;">男</span></yd-radio>
              <yd-radio val="2"><span style="font-size: 24px;">女</span></yd-radio>
            </yd-radio-group>
          </div>
        </div>
        <van-cell-group>
          <van-field
            clearable
            label="身份证"
            :value="accountIdCardNo || ''"
            placeholder="请输入身份证"
          />
        </van-cell-group>
        <van-cell-group>
          <van-field
            clearable
            disabled
            label="出生日期"
            :value="birthDate || ''"
            placeholder="请输入出生日期"
          />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from "vuex";
import { ERR_OK, imgUrl } from "api/config";
import { getBasicData } from "api/myself";




export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      accountImage: "",
      accountUserName: "",
      accountMobile: "",
      accountName: "",
      accountNickname: "",
      accountSex: "",
      accountIdCardNo: "",
      birthDate: "",

    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters(["user_name", "pwd"])
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    routerBack() {
      this.$router.back()
    },
    // 是否登录
    _getBasicData() {
      let that = this;
      if (localStorage.getItem("id")) {
        that.accountImage = imgUrl + localStorage.getItem("image");
        that.accountUserName = localStorage.getItem("mobileNo");
        that.accountMobile = localStorage.getItem("mobileNo");
        that.accountName = localStorage.getItem("name");
        that.accountNickname =
          localStorage.getItem("nickname") == undefined
            ? ""
            : localStorage.getItem("nickname");
        that.accountSex = localStorage.getItem("sex");
        that.accountIdCardNo = localStorage.getItem("idCardNo");
      } else {
        getBasicData(that.user_name, that.pwd).then(res => {
          that.accountImage = imgUrl + res.t.user.image;
          that.accountUserName = res.t.user.userName;
          that.accountMobile = res.t.user.mobileNo;
          that.accountName = res.t.user.name;
          that.accountNickname = res.t.user.nickname;
          that.accountSex = res.t.user.sex;
          that.accountIdCardNo = res.t.user.idCardNo;
        });
      }
      // 获取出生日期
      if (that.accountIdCardNo != null && that.accountIdCardNo != "") {
        if (that.accountIdCardNo.length == 15) {
          that.birthDate = "19" + that.accountIdCardNo.substr(6, 6);
        } else if (that.accountIdCardNo.length == 18) {
          that.birthDate = that.accountIdCardNo.substr(6, 8);
        }
        that.birthDate = that.birthDate.replace(/(.{4})(.{2})/, "$1-$2-");
      }
    },
    saveMsg() { },
    personImg() { },
    //接收子组件emit的事件
    getImgUrl(data) {
      //data  得到的就是返回的图片路径的相关参数
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this._getBasicData();
  },
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
<style scoped lang="stylus">
// @import url(); 引入公共css类
.person {
  .van-nav-bar {
    height: 60px;
    background-color: #fff;
    line-height: 60px;

    .van-icon, .van-nav-bar__text {
      color: #999;
      line-height: 60px;
    }

    .van-icon {
      padding-left: 10px;
    }

    .van-nav-bar__right {
      top: 0;
    }
  }

  .personImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    float: left;
    margin: 5px;
  }

  .personCon {
    margin-top: 10px;

    .sex {
      position: relative;

      .van-cell {
        float: left;
        z-index: 10;
      }

      .radio {
        position: absolute;
        right: 15px;
        top: 0;
        margin: 12px 0;
        z-index: 1000;
        line-height: 20px;

        .yd-radio {
          span {
            font-size: 16px !important;
            color: #000;
          }
        }
      }
    }
  }

  .van-cell {
    color: #999;
    border-bottom: 1px solid #ebedf0;

    .van-cell__value {
      color: #000;
    }
  }

  .van-cell::after {
    border: 0;
  }
}
</style>
