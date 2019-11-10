<!--  -->
<template>
  <div @click="selectItem(item)">
    <div class="gray"></div>
    <div>
      <van-cell
        v-if="item.pay_state == 0"
        value="已完成"
        value-class="itemFinished"
      >
        <template slot="title">
          <div class="custom-text">
            订单编号 :
            {{ item.order_id }}
          </div>
        </template>
      </van-cell>
      <van-cell
        v-if="item.pay_state == 1"
        value="未支付"
        value-class="itemWaitPay"
      >
        <template slot="title">
          <div class="custom-text">
            订单编号 : {{ item.order_id }}
          </div>
        </template>
      </van-cell>
      <van-cell
        v-if="item.pay_state == 2"
        value="待审核"
        value-class="itemAudit"
      >
        <template slot="title">
          <div class="custom-text">
            订单编号 : {{ item.order_id }}
          </div>
        </template>
      </van-cell>
      <van-cell
        v-if="item.pay_state == 3"
        value="正在使用"
        value-class="itemAudit"
      >
        <template slot="title">
          <div class="custom-text">
            订单编号 : {{ item.order_id }}
          </div>
        </template>
      </van-cell>
      <div class="detail">
        <van-cell>
          <template slot="title">
            <div class="custom-text">
              医院 :
              {{ item.hospital_name }}
            </div>

            <div class="custom-text">
              科室 :
              {{ item.department_name }}
            </div>
            <div class="custom-text">
              总时长 :
              {{
              sec_to_time(
              item.service_time
              )
              }}
            </div>
            <div class="link">
              <van-icon name="arrow" />
            </div>
          </template>
        </van-cell>
      </div>
    </div>
    <div class="white"></div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  props: {
    item: {
      type: Object,
      default: () => { }
    },
  },

  components: {},
  data() {
    //这里存放数据
    return {

    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
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
    selectItem(item) {
      this.$emit('select', item)
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {

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
<style scoped lang='stylus'>
.itemFinished, .itemWaitPay, .itemAudit {
  position: absolute;
  right: 15px;
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
</style>