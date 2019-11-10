<template>
  <div id="app">
    <router-view></router-view>
    <result></result>
    <demo></demo>
    <directions></directions>
    <tab></tab>
  </div>
</template>

<script type="text/ecmascript-6">
import Tab from 'components/tab/tab'
import Result from 'components/result/result'
import Demo from 'components/demo/demo'
import Directions from 'components/directions/directions'
import { mapGetters, mapMutations } from "vuex";
import { getWxCode, getUrlCode, getOpenId, deposit, busy, seeBalance } from "api/bed";
import { ERR_OK } from "api/config";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(["openId"])
  },
  methods: {
    _getData() {
      // 获取code
      var url = location.href.split("#")[0];
      getWxCode(url).then(res => {
        if (!getUrlCode('code')) {
          // this.$toast('微信授权中……')
          let currentUrl = encodeURIComponent(window.location.href)
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc925a2130da89369&redirect_uri=' + currentUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        } else {
          this.code = getUrlCode('code')
          // 获取openid
          getOpenId(this.code).then(res => {
            this.setOpenId({
              openId: res
            });
            this.basic()
          })
        }
      })

    },
    basic() {
      if (localStorage.getItem("id") != null) {
        // 查询余额
        seeBalance().then(res => {
          this.setMsg({
            balance: res.balance
          })
        })
        // 是否缴纳押金
        deposit().then(res => {
          this.setDepositType({
            type: (res.error_code) * 1,
            money: (res.cash_pledge_money) * 1
          })
        });

      } else {
        // this.$toast("您还未登录");
      }
    },
    ...mapMutations({
      setOpenId: "SET_OPENID",
      setDepositType: "SET_DEPOSIT_TYPE",
      setUsedingState: "SET_USEDING_STATE",
      setMsg: "SET_MSG",
    })
  },
  components: {
    Tab, Result, Directions, Demo
  },
  mounted() {

  },
  created() {
    this._getData();
    // this.basic()

  },
}
</script>

<style scoped></style>
