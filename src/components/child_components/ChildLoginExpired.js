
import React from 'react'
import ReactDOM from 'react-dom';
import { Modal, Button, Icon } from 'antd'
import Cookies from 'js-cookie'
import memoryUtils from '../../utils/memoryUtils'

// 渲染登录过期弹窗
export default function ChildLoginExpired () {
  // 跳转登录
  function reLogin () {
    memoryUtils.user = {}
    Cookies.remove("userInfo")
    window.location.reload()
  }
  // 返回首页
  function backToHome () {
    memoryUtils.user = {}
    Cookies.remove("userInfo")
    memoryUtils.pageThis.props.history.replace('/')
    memoryUtils.pageThis = {}
    ReactDOM.render('', document.getElementById('loginExpiredTipBox'))
  }

  const element = <Modal
    visible={true}
    closable={false}
    footer={null}
    keyboard={false}
    maskClosable={false}
  >
    <div className="loginExpiredBox">
      <Icon className="expiredIcon expiredItem" type="exclamation-circle" />
      <div className=" expiredTip expiredItem">登录信息已过期，请重新登录！</div>
      <div className="expiredItem">
        <Button type="default" onClick={backToHome}>返回首页</Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={reLogin}>重新登录</Button>
      </div>
    </div>
  </Modal>
  ReactDOM.render(element, document.getElementById('loginExpiredTipBox'))
}