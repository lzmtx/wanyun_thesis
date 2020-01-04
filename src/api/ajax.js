/**
 * 后台-Ajax请求函数-登录后才能进行请求
 * 能发送异步Ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是promise对象
 */
import axios from 'axios'
import { message } from 'antd'
import qs from 'qs'
import Cookies from 'js-cookie'
import memoryUtils from '../utils/memoryUtils'
import ChildLoginExpired from '../components/child_components/ChildLoginExpired';

// 允许携带cookie
axios.defaults.withCredentials = true;

export default function admin_ajax (url, data = {}, type = 'GET') {

  // 统一处理请求状态
  function response (resData) {
    // 请求成功并完成响应
    if (resData.status === 200 && resData.request.readyState === 4) {
      let resCode = resData.data.code, resMessage = resData.data.message
      // 2 3 4 不进行默认提示
      if (resCode === 6 || resCode === 7 || resCode === 8) {
        message.success(resMessage)
        if (resCode === 6) {
          resData.data.data["type"] = "student"
        }
        if (resCode === 7) {
          resData.data.data["type"] = "teacher"
        }
        if (resCode === 8) {
          resData.data.data["type"] = "admin"
        }
      }
      if (resCode >= 2002 && resCode <= 2012) {
        if (resCode === 2011) {
          message.warning("你未被分组！")
        } else {
          message.error(resMessage)
        }
      }
      // 登录过期
      if (resCode === 2001) {
        ChildLoginExpired()
      }
    }
  }
  // 请求函数
  function request (resolve, reject) {
    let promise
    if (type === 'GET') {
      promise = axios.get(url, { params: data })
    } else {
      promise = axios.post(
        url,
        qs.stringify(data),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;multipart/form-data",
          }
        }
      )
    }
    promise.then(res => {
      Cookies.set("userInfo", memoryUtils.user)
      response(res)
      resolve(res)
    }).catch(error => {
      // 统一处理出错情况
      let errStr = error.message.toString(), tipsText = ''
      if (errStr.indexOf("Network Error") !== -1) {
        tipsText = '请检查网络连接是否正常'
      }
      if (errStr.indexOf("404") !== -1) {
        tipsText = '未知的请求路径，404'
      }
      if (errStr.indexOf("500") !== -1) {
        tipsText = '服务器错误：500'
      }
      message.error('请求出错：' + tipsText + ' !')
      reject(error)
    })
  }

  return new Promise((resolve, reject) => {
    request(resolve, reject)
  })
}