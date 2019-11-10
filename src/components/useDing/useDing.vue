<template>
  <div id="usedingViewPage">
    <van-nav-bar
      fixed
      @click-right="manger"
      title="共享陪护床"
    >
      <img
        src="../../../static/img_icon/more.png"
        slot="right"
        class="mangerIcon"
      />
    </van-nav-bar>
    <div class="topblank"></div>
    <!-- 上下拉加载更多，刷新数据的组件updown -->
    <yd-layout style="width:100%;">
      <!-- 此处的ui结构just a demo of test -->
      <div class="cellCon">
        <div class="gray"></div>
        <div class="beginUse">
          <div class="flexItem useTimeTitle">
            <div class="flex-item">开锁时间</div>
            <div class="flex-item">使用时间</div>
          </div>
          <div class="flexItem dateText">
            <div class="flex-item">
              <div class="times">{{ startDate }}</div>
              <div class="date">{{ startTime }}</div>
            </div>
            <div class="flex-item leftLine">
              <div
                class="times"
                id="mytime"
              >
                {{ localTimeLong }}
              </div>
            </div>
          </div>
          <div class="beginBlank"></div>
        </div>
        <div class="useding">
          <van-cell-group>
            <van-cell
              title="医院"
              :value="res.hospital_name"
            >
            </van-cell>
            <van-cell
              title="科室"
              :value="res.department_name"
            >
            </van-cell>
            <van-cell
              title="病房号"
              :value="res.room_number"
            >
            </van-cell>
            <van-cell
              title="陪护床编号"
              :value="res.chaperonage_bed_code"
            >
            </van-cell>
            <van-cell
              title="管理员"
              :value="res.user_name"
            />
            <van-cell
              title="联系方式"
              :value="res.mobile_phone"
            />
            <van-cell
              title="预计消费"
              :value="cost"
            />
          </van-cell-group>
        </div>
      </div>
    </yd-layout>
    <div class="usedingBlank"></div>
    <div class="question">
      <p>手动将陪护床推进床柜即可关锁</p>
      <van-button
        type="default"
        class="breakdown"
        @click="breakdownClose"
      >
        故障关闭
      </van-button>
      <van-button
        class="normal"
        type="default"
        @click="normalClose"
      >
        正常关锁
      </van-button>
    </div>
    <div class="loading-wrapper"></div>
     <keep-alive>
    <router-view></router-view>

    </keep-alive>
  </div>
</template>

<script>
import { busy, normalClose, openLock } from "api/bed";
import { ERR_OK } from "api/config";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
  },
  data() {
    return {
      pulldown: true,
      oCurrentPage: 0,
      list: [],
      res: Object,
      cost: '',
      localCost: '',
      startDate: "",
      startTime: "",
      // 初始化数据
      h: 0, // 定义时，分，秒，毫秒并初始化为0；
      m: 0,
      ms: 0,
      s: 0,
      costMinite: 0,
      time: 0,
      free_time: '',
      str: "",
      mytime: "",
      chaperonage_bed_code: "",
      localTimeLong: '',
      hourly_rate: '',
    };
  },
  created() {
    this._openLock();
  },
  computed: {
    ...mapGetters(["usedingState", "orderUseState", "order"])
  },
  // 监控data中的数据变化
  watch: {

  },
  methods: {
    manger() {
      this.$router.push({
        name: "usedManager"
      });
    },
    _openLock() {
      const vm = this;
      // 调用api获取数据
      // console.log(vm.usedingState.res.chaperonage_bed_code)
      if (vm.usedingState.res.chaperonage_bed_code == "") {
        return false
      }
      openLock(vm.usedingState.res.chaperonage_bed_code).then(res => {
        var arr = [];
        for (let i in res) {
          let o = {};
          o[i] = res[i];
          arr.push(o);
        }
        vm.res = arr[0].data;
        vm.startDate = arr[0].data.start_time.trim().split(" ")[1];
        vm.startTime = arr[0].data.start_time.trim().split(" ")[0];
        vm.timeLong = (arr[0].data.service_time) * 1
        vm.free_time = (arr[0].data.free_time) * 1
        vm.cost = (arr[0].data.cost) * 1
        vm.hourly_rate = (arr[0].data.hourly_rate) * 1
        vm.setUsedingState({
          usedoing: true,
          res: res.data,
        })
        vm.setRefund({
          state: false,
        })
      });


    },

    onClickLeft() {
      this.$router.back();
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
    timer() {
      // 定义计时函数
      let vm = this;
      vm.ms = vm.ms + 50; // 毫秒
      if (vm.ms >= 1000) {
        vm.ms = 0;
        vm.timeLong = vm.timeLong + 1
        vm.localTimeLong = vm.sec_to_time(vm.timeLong)

        vm.s = vm.s + 1; // 秒
        // console.log(vm.s, vm.timeLong, vm.free_time)
        if (vm.timeLong < vm.free_time) {
          vm.cost = 0
        } else {
          if (vm.s >= vm.free_time) {
            vm.s = 0;
            this._openLock()
          }
        }
      }

      if (vm.s >= 60) {
        vm.s = 0;
        vm.m = vm.m + 1; // 分钟
      }
      if (vm.m >= 60) {
        vm.m = 0;
        vm.h = vm.h + 1; // 小时
      }

      vm.str =
        vm.toDub(vm.h) +
        ":" +
        vm.toDub(vm.m) +
        ":" +
        vm.toDub(vm.s) +
        "";
    },

    reset() {
      // 重置
      clearInterval(this.time);
      this.h = 0;
      this.m = 0;
      this.ms = 0;
      this.s = 0;
      this.str = "00:00:00";
    },

    start() {
      // 开始
      this.time = setInterval(this.timer, 50);
    },

    stop() {
      // 暂停
      clearInterval(this.time)
    },

    toDub(n) {
      // 补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },

    toDubms(n) {
      // 给毫秒补0操作
      if (n < 10) {
        return "00" + n;
      } else {
        return "0" + n;
      }
    },
    // 故障反馈关闭
    breakdownClose() {
      this.stop()
      this.$router.push({
        name: "feedback",
        params: {
          code: this.res.chaperonage_bed_code
        }
      });
    },
    // 正常关锁
    normalClose() {
      normalClose(this.res.chaperonage_bed_code).then(res => {
        this.setTabActive(1)
        this.stop()
        if (res.error_code * 1 === ERR_OK) {
          this.$router.push({
            name: "normalClose"
          });
          this.setNormalState({
            state: true,
            order: res.data
          });
          this.setOrderUseState({
            state: false
          });
          this.setUsedingState({
            state: false,
            res: ''
          });
          this.setWayisshow({
            state: false
          })
        }
      });
    },
    ...mapMutations({
      setTrueManger: "SET_BEDMANAGER",
      setOrderUseState: "SET_ORDER_USE_STATE",
      setFeedBackState: "SET_FEEDBACK",
      setNormalState: "SET_NORMAL_STATE",
      setUseding: "SET_USEDING_STATE",
      setUsedingState: "SET_USEDING_STATE",
      setRefund: "SET_REFUND",
      setTabActive: "SET_ACTIVE",
      setWayisshow: "SET_WAYISSHOW"
    })
  },
  mounted() {
    this.time = setInterval(this.timer, 60);
  },
  beforeCreate() {
  }, //生命周期 - 创建之前
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }

  } // 生命周期 - 销毁之前
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#usedingViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 152;
  background: #f5f3f4;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .beginUse {
    position: relative;

    .flexItem {
      display: flex;
      align-items: center; /* 垂直居中 */
      justify-content: center; /* 水平居中 */
      width: 100%;
      height: 100%;
      text-align: center;

      .flex-item {
        flex: 1;
      }
    }

    .useTimeTitle {
      line-height: 36px;
      background: #fff;
      margin-top: 10px;
      font-size: 16px;
    }

    .dateText {
      .leftLine {
        border-left: 1px solid #ccc;
        margin: 10px 0;
      }

      .times {
        color: orange;
        font-size: 16px;
        line-height: 25px;
        padding-top: 5px;
      }

      .date {
        font-size: 14px;
        color: #999;
        padding-bottom: 8px;
      }
    }

    .beginBlank {
      height: 10px;
      background: #fff;
      margin-bottom: 10px;
    }

    .cell {
      .van-cell {
        color: #999;
      }
    }

    .van-popup {
      background: #f5f3f4;
    }
  }

  .usedingBlank {
    height: 100px;
  }

  .question {
    width: 94%;
    position: fixed;
    bottom: 15px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;

    p {
      color: #999;
      text-align: center;
      font-size: 12px;
      line-height: 25px;
    }

    .breakdown {
      width: 50%;
      background: #f39357;
      color: #fff;
      font-size: 14px;
      height: 40px;
      line-height: 36px;
      float: left;
      letter-spacing: 2px;
    }

    .normal {
      width: 50%;
      color: #fff;
      background: #4fd6bc;
      font-size: 14px;
      letter-spacing: 2px;
      height: 40px;
      line-height: 36px;
      float: left;
    }
  }

  .content {
    flex: 1;
    background-color: $bgColor;
    overflow: hidden;
    box-sizing: border-box;

    ul {
      li {
        background: #fff;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: $baseColor;
        border-bottom: 1px solid #eee;
      }
    }
  }

  font-size: 14px;

  .nav {
    ul {
      list-style: none;
      display: flex;

      li {
        list-style: none;
        flex: 1;
      }
    }
  }

  .wrapper {
    height: calc(100vh - 84px);
    overflow: hidden;
  }

  .active {
    color: burlywood;
    border-bottom: 1px solid burlywood;
  }
}
</style>
