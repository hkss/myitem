import axios from "axios";
// 用户端
// 1.扫码或输入编号开锁接口（写好待测）
export function openLock(code) {
  const url = "/openLock";
  // const url = "http://192.168.1.92:8080/app/chaperone_bed/user/openLock";
  const data = Object.assign({}, {
    user_id: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    chaperonage_bed_code: code
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 2.正常关锁接口
export function normalClose(chaperonage_bed_code) {
  const url = "/close_lock";
  const data = Object.assign({}, {
    user_id: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    chaperonage_bed_code: chaperonage_bed_code
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 3.判断用户是否正在使用陪护床接口
export function busy() {
  const url = "/busy";
  const data = Object.assign({}, {
    user_id: localStorage.getItem("id") ?
      localStorage.getItem("id") : ""
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 4.用户进入缴纳押金界面或查看押金接口（写好待测）
export function deposit() {
  const url = "/pay_deposit";
  const data = Object.assign({}, {
    user_id: localStorage.getItem("id") ?
      localStorage.getItem("id") : ""
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 5.用户缴纳押金接口
export function payDeposit(way) {
  const url = "/cash_pledge";
  const data = Object.assign({}, {
    user_id: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    pay_way: way
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 6.用户使用完陪护床后支付费用接口（订单余额支付）
export function waitPay(order_id, state) {
  const url = "/pay";
  const data = Object.assign({}, {
    user_id: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    order_id: order_id,
    pay_way: state
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 余额获取短信验证码
export function getBedCode(phone) {
  const url = "http://59.172.27.186:8888/E2306_service/app/payment";
  const data = Object.assign({}, {
    sid: 123,
    mobileNo: phone
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 校验余额支付验证码
export function checkBedCode(phone,sms) {
  const url = "http://59.172.27.186:8888/E2306_service/app/verifyCode";
  const data = Object.assign({}, {
    sid: 123,
    mobileNo: phone,
    Code:sms
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 订单微信支付
export function weChatOrderPay(openId, order_id) {
  const url = "/weChatOrderPay";
  const data = Object.assign({}, {
    userId: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    openId: openId,
    orderId: order_id
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 8.退还押金接口(微信退款)
export function weChat_refun() {
  const url = "/weChat_refund";
  const data = Object.assign({}, {
    userId: localStorage.getItem("id") ? localStorage.getItem("id") : ""
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 9.我的订单接口（写好待测）
export function order(payState, page) {
  const url = "/my_order";
  const data = Object.assign({}, {
    user_id: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    pay_state: payState,
    pageNum: page,
    pageSize: 10
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 10.详情订单接口（写好待测）
export function orderDetail(order_id) {
  const url = "/order_form";
  const data = Object.assign({}, {
    user_id: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    order_id: order_id
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 11.使用规则接口
export function instructions(deposit, cost) {
  const url = "/instructions";
  const data = Object.assign({}, {
    cashPledgeMoney: deposit,
    costNormal: cost
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}

// 扫一扫
export function RichScan(LocationHref) {
  const url = "http://www.51edoctor.cn/eht/RichScan";
  const data = Object.assign({}, {
    url: LocationHref
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 地图
export function geographical(LocationHref) {
  const url = "http://www.51edoctor.cn:8888/E2306_service/payPlatform/tenpay/getWeixinBackUrl";
  const data = Object.assign({}, {
    url: LocationHref
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 获取微信支付code接口
export function getWxCode(LocationHref) {
  const url = "/getWeixinBackUrl";
  const data = Object.assign({}, {
    callBackUrl: LocationHref
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 截取code
export function getUrlCode(name) {
  let url = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let newUrl = window.location.search.substr(1).match(url);
  if (newUrl != null) {
    return unescape(newUrl[2]);
  } else {
    return false;
  }
}
// 获取openid
export function getOpenId(code) {
  const url = "/openId";
  const data = Object.assign({}, {
    code: code
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 押金支付
export function weChatPay(openId) {
  const url = "/weChatPay";
  const data = Object.assign({}, {
    userId: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    openId: openId
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 余额充值
export function recharge(openId, money) {
  const url = "/recharge";
  const data = Object.assign({}, {
    userId: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
    openId: openId,
    money: money
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 查询余额
export function seeBalance(openId, money) {
  const url = "/seeBalance";
  const data = Object.assign({}, {
    userId: localStorage.getItem("id") ?
      localStorage.getItem("id") : "",
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
// 微信支付方法
// export function jsApiCall(data) {
//   WeixinJSBridge.invoke(
//     "getBrandWCPayRequest", {
//       debug: true,
//       appId: data.appId, // 公众号名称，由商户传入
//       timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
//       nonceStr: data.nonceStr, // 随机串
//       package: data.package,
//       signType: "MD5", // 微信签名方式：
//       paySign: data.paySign, // 微信签名
//       jsApiList: ["chooseWXPay"]
//     },
//     function (res) {
//       if (res.err_msg === "get_brand_wcpay_request:ok") {
//         window.location.href = "http://www.51edoctor.cn/chaperonageBed/wxbed/ehaot"
//       } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
//         window.location.href = "http://www.51edoctor.cn/chaperonageBed/wxbed/ehaot"
//       } else if (res.err_msg === "get_brand_wcpay_request:fail") {
//         this.$toast("网络异常，请重试");
//       }
//     }
//   );
// }
