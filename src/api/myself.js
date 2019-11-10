import {
  commonParams
} from './config'
import axios from 'axios'

// import md5 from './md5';

// 获取基本数据
export function getBasicData(phone, pwd) {
  const url = 'EDoctor_service/app/manager/account/user/login.json'
  const data = Object.assign({}, commonParams, {
    sid: '123',
    mobileNo: phone,
    passWord: pwd
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 加密
export function CalcuMD5(pwd) {
  //   pwd = pwd.toUpperCase();
  pwd = md5.hexMD5('cxy_framework' + pwd)
  return pwd
}
