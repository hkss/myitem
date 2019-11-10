import {
  commonParams
} from './config'
import axios from 'axios'

// 获取验证码
export function getcode(phone) {
  const url = 'http://59.172.27.186:8888/EDoctor_service/app/manager/account/user/userCodeLogin'
  const data = Object.assign({}, {
    sid: '123',
    mobileNo: phone
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 校验验证码
export function checkcode(phone, sms) {
  const url = 'http://59.172.27.186:8888/EDoctor_service/app/manager/account/user/verifyCode.json'
  const data = Object.assign({}, {
    sid: '123',
    mobileNo: phone,
    Code: sms
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
