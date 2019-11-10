<template>
  <transition name="slide">
    <div class="orderViewPage">
      <van-nav-bar
        fixed
        left-arrow
        @click-left="onClickLeft"
        title="订单管理"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <!-- 导航 -->
      <div class="nav">
        <ul>
          <li
            class="tab-item"
            v-for="(n, index) in title"
            :key="index"
            @click="changeNav(index)"
            :class="{ active: index === oCurrentPage }"
          >
            <span class="tab-link"> {{ n.name }}</span>
          </li>
        </ul>
      </div>
      <!-- 外层翻页组件（轮播原理） -->
      <slider
        :oCurrentPage="oCurrentPage"
        ref="sendPage"
        v-on:switchTab="msgFromChild"
      >
        <div
          v-for="(item, index) in data"
          :key="index"
        >
          <!-- 上下拉加载更多，刷新数据的组件updown -->
          <up-down
            :data="data"
            :pulldown="pulldown"
            :scrollToEnd="scrollToEnd"
            @scrollToEnd="moreData"
          >
            <!-- 此处的ui结构just a demo of test -->
            <ul class="cell">

              <li
                class="data-li"
                v-for="(pd,key) in list"
                :key="key"
                @click="selectItem(pd)"
              >
                <order-list :item="pd"></order-list>
              </li>
              <li
                class="none"
                v-if="!list.length"
              >暂无相关数据~</li>
            </ul>
            <div class="orderBlank"></div>
          </up-down>
        </div>
      </slider>

      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import Loading from "base/loading/loading";
import Slider from "base/scrolltab/slider";
import UpDown from "base/scrolltab/UpDown";
import { mapGetters, mapMutations } from "vuex";
import OrderList from 'components/order/orderList'
import { ERR_OK } from "api/config";
import { order } from "api/bed";
export default {
  name: "",
  components: {
    Loading,
    Slider,
    UpDown,
    OrderList
  },
  data() {
    return {
      data: [1, 1, 1, 1],
      pulldown: true,
      scrollToEnd: true,
      page: 1,
      resBoolean: true,
      num: 1,
      PayState: '',
      title: [
        { name: "全部订单" },
        { name: "已完成" },
        { name: "未支付" },
        { name: "待审核" }
      ],
      oCurrentPage: 0,
      list: []
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    ...mapGetters(["order"])
  },
  methods: {
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
    changeNav(num) {
      this.oCurrentPage = num;
      this.$refs.sendPage.setPage(this.oCurrentPage);
    },
    selectItem(order) {
      if (this.order.type === 1 || this.order.type === 2) {
        // 全部订单
        this.$router.push({
          name: "bedDetail",
          params: {
            id: order.order_id
          }
        });
      } else if (this.order.type == -2 || this.order.type === -1) {
        // 未付款订单
        this.$router.push({
          name: "myDetail",
          params: {
            id: order.order_id
          }
        });
      }
    },
    moreData() {
      if (this.resBoolean) {

        this.num += 1;
        // // 接口对接
        order(this.oCurrentPage - 1, this.num).then(res => {
          if (res.data.length === ERR_OK) {
            this.resBoolean = false
            return false;
          }
          this.list = this.list.concat(res.data);
        });
      }
    },
    loadData() {
     if (this.order.type === -2 || this.order.type === 2) {
        // 全部订单
        this.PayState = -1
        this.oCurrentPage = 0
      } else if (this.order.type == 1 || this.order.type === -1) {
        // 未付款订单
        this.PayState = 1
        this.oCurrentPage = 2

      }
      order(this.PayState, this.page).then(res => {
        if (res.error_code * 1 === ERR_OK) {
          this.list = res.data;
        } else {
        }
      });
    },

    // 获取子组件传过来的当前页码值
    msgFromChild(data) {
      console.log(data)
      if (data || data === 0) {
        this.oCurrentPage = data;
        this.resBoolean = true
        this.num = 1;
        order(this.oCurrentPage - 1, this.page).then(res => {
          if (res.error_code * 1 === ERR_OK) {
            this.list = res.data;
          } else {
          }
        });
      }
    },
    ...mapMutations({
      setOrder: "SET_ORDER"
    })
  },
  mounted() { }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '~common/stylus/variable';

.orderViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 156;
  background: #f5f3f4;

  .nav {
    ul {
      list-style: none;
      display: flex;
      height: 40px;
      line-height: 40px;
      font-size: $font-size-medium;
      background: #fff;
      border-bottom: 1px solid #dbdcde;

      li {
        list-style: none;
        flex: 1;
        text-align: center;

        .tab-link {
          padding-bottom: 5px;
          color: $color-default;
        }
      }

      .active {
        .tab-link {
          color: $color-theme;
          border-bottom: 2px solid $color-theme;
        }
      }
    }
  }

  .orderBlank {
    height: 86px;
  }

  .wrapper {
    height: calc(100vh - 84px);
    overflow: hidden;
  }

  .detail {
    background: #f5f3f4;

    .van-cell {
      border: 0;
      background-color: transparent;
    }
  }

  .custom-text {
    text-align: left;
  }

  .none {
    color: #999 !important;
    font-size: 14px;
    line-height: 50px;
    padding-top: 20px;
  }
}
</style>
