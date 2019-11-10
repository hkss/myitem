import * as types from './mutation-types'
const mutations = {
  // 是否登录
  [types.SET_ISLOGIN](state, islogin) {
    state.islogin = islogin
  },
  [types.SET_MSG](state, msg) {
    state.msg = msg
  },
  // 信息管理
  [types.SET_WAYISSHOW](state, wayIsShow) {
    state.wayIsShow = wayIsShow
  },
  // 押金管理
  [types.SET_DEPOSIT_TYPE](state, depositType) {
    state.depositType = depositType
  },
  // 订单管理
  [types.SET_ORDER_STATE](state, orderState) {
    state.orderState = orderState
  },
  // 订单
  [types.SET_ORDER](state, order) {
    state.order = order
  },
  // 订单使用状态
  [types.SET_ORDER_USE_STATE](state, orderUseState) {
    state.orderUseState = orderUseState
  },
  // 正常关锁
  [types.SET_NORMAL_STATE](state, normalState) {
    state.normalState = normalState
  },
  // 正在使用
  [types.SET_USEDING_STATE](state, usedingState) {
    state.usedingState = usedingState
  },
  // 故障反馈
  [types.SET_FEEDBACK](state, feedback) {
    state.feedback = feedback
  },
  // 使用说明
  [types.SET_DIRECTIONS](state, beddirections) {
    state.beddirections = beddirections
  },
  //选择医院 
  [types.SET_HOSPITAL](state, hospital) {
    state.hospital = hospital
  },

  [types.SET_RESULT_TYPE](state, resultType) {
    state.resultType = resultType
  },
  [types.SET_REFUND](state, refund) {
    state.refund = refund
  },
  // openid
  [types.SET_OPENID](state, openId) {
    state.openId = openId
  },
   [types.SET_ACTIVE](state, active) {
     state.active = active
   }



}

export default mutations
