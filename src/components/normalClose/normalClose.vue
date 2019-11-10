<!--  -->
<template>
  <div>
    <div
      class="normalViewPage"
      v-if="normalState.state == true"
    >
      <van-nav-bar
        fixed
        @click-left="onClickLeft"
        title="共享陪护床"
      >
      </van-nav-bar>
      <div class="topblank"></div>

      <yd-layout>
        <yd-step
          :current="stepsActive"
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
        <div class="cellCon">
          <div class="gray"></div>
          <van-cell
            title="订单号"
            :value="res.orderId"
          >
          </van-cell>
          <div class="detail">
            <van-cell-group>
              <van-cell
                title="医院"
                :value="res.hospitalName"
              >
              </van-cell>
              <van-cell
                title="科室"
                :value="res.departmentName"
              >
              </van-cell>
              <van-cell
                title="病房号"
                :value="res.roomId"
              >
              </van-cell>

              <van-cell
                title="时长"
                :value="sec_to_time(res.serviceTime)"
              >
              </van-cell>
              <van-cell
                title="开始时间"
                :value="res.startTime"
              >
              </van-cell>
              <van-cell
                title="结束时间"
                :value="res.endTime"
              >
              </van-cell>
              <van-cell
                title="费用"
                :value="res.cost"
              >
              </van-cell>
              <van-cell
                v-if="res.endWay == 0"
                value="故障关锁"
                title="结束方式"
              >
              </van-cell>
              <van-cell
                v-if="res.endWay == 1"
                value="正常关锁"
                title="结束方式"
              >
              </van-cell>
              <van-cell
                v-if="res.payState == 0"
                value="已完成"
                title="状态"
                value-class="itemFinished"
              >
              </van-cell>
              <van-cell
                v-if="res.payState == 1"
                value="未支付"
                title="状态"
                value-class="itemWaitPay"
              >
              </van-cell>
              <van-cell
                v-if="res.payState == 2"
                value="待审核"
                title="状态"
                value-class="itemAudit"
              >
              </van-cell>

            </van-cell-group>
            <div class="backIndexBox">
              <van-button
                @click="backIndex"
                v-if="res.serviceTime<res.freeTime"
                class="backIndex"
                type="primary"
              >回到首页</van-button>
            </div>
            <normalize-pay
              v-if="res.serviceTime>res.freeTime"
              :orderId="res.orderId"
            ></normalize-pay>
          </div>
        </div>
      </yd-layout>

    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters, mapMutations } from "vuex";
import normalizePay from "components/normalClose/normalizePay";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { normalizePay },
  data() {
    //这里存放数据
    return {
      stepsActive: 3,
      res: ''
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters(["normalState"])
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    onClickLeft() {
      this.$router.back();

      // this.$router.push({
      //   name: "bed",
      // });
    },
    backIndex() {
      this.$router.push({
        name: "bed",
      });
    },
    delClose() {

    },
    _getData() {
      this.res = this.normalState.order
    },
    sec_to_time(s) {
      var t;
      if (s > -1) {
        var hour = Math.floor(s / 3600);
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        if (hour < 10) {
          t = "0" + hour + ":";
        } else {
          t = hour + ":";
        }

        if (min < 10) {
          t += "0";
        }
        t += min + ":";
        if (sec < 10) {
          t += "0";
        }
        t += sec;
      }
      return t;
    },

  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this._getData()
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
.normalViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 152;
  background: #f5f3f4;

  .yd-layout {
    div {
      height: 40px;
    }
  }

  .backIndexBox {
    .backIndex {
      height: 45px;
      text-align: center;
      background: #4fd6bc;
      width: 92%;
      border: 0;
      margin-top: 20px;
      margin-bottom: 20px;
      line-height: 45px;
      color: #fff;
      font-size: 16px;
      margin-left: 4%;
      margin-right: 4%;
      position: fixed;
      bottom: 0;
    }
  }
}
</style>
