<!--  -->
<template>
  <transition name="slide">
    <div
      class="directionsViewPage"
      v-if="beddirections == true"
    >
      <van-nav-bar
        fixed
        left-arrow
        @click-left="onClickLeft"
        title="使用说明"
      >
      </van-nav-bar>
      <div class="topblank"></div>
        <directions-con :data="res"></directions-con>
    </div>
  </transition>
</template>

<script>
import DirectionsCon from "components/directions/directionsCon";
import { instructions } from "api/bed";
import { mapGetters, mapMutations } from "vuex";
// import Scroll from 'base/scroll/scroll'
export default {
  components: { DirectionsCon },
  data() {
    return {
      res: [
        {
          depositdirections: "押金说明",
          define:
            "1.定义：押金是指用户在注册E号通账户后为使用共享陪护床服务所缴纳的一笔可退还的款项，其目的在于激励用户合法、规范及文明地使用共享陪护床。押金不可用于消费，用户可随时申请退还。其收费标准如下：",
          money: "人民币58元",
          costback:
            "2.押金的退还：用户可随时申请退还押金(“退款”)，后台收到您的退款申请后会立即办理退款手续，但退款到账时间会根据您选择的支付方式所对应的银行或第三方支付的处理流程不同而有所差别；通常情况下，退款到账需要2-7个工作日。",
          operation:
            "退款操作：如您希望申请退还押金，请点击[我的钱包]页面下方“押金退款”字样后，确认退款即可。",
          costdirections: "收费说明",
          costmoney: "2元/30分钟",
          standard:
            "（租用时间每30分钟计费一次，不足30分钟以30分钟计，超出30分钟不足1小时以1小时计）",
          settlement:
            "2.结算费用：用户可以通过微信支付、支付宝以及银行卡三种方式在APP中缴纳费用。",
          describe:
            "3.用户在使用共享陪护床前应仔细检查床柜状况，如发现床柜存在问题影响安全使用应进行床柜报修，若护士检查发现床柜是存在问题的，此次使用免费，若不存在问题"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["beddirections"])
  },
  watch: {},
  methods: {
    onClickLeft() {
      this.setDirections(false);
    },
    getData() {
      var deposit = '58'
      var cost = '2'
      instructions(deposit, cost).then(res => {
        // console.log(res)
      });
    },
    ...mapMutations({
      setDirections: "SET_DIRECTIONS"
    })
  },
  created() {
    this.getData()
  },
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
<style scoped lang="stylus">
// @import url(); 引入公共css类
.directionsViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 154;
  background: #f5f3f4;
}
</style>