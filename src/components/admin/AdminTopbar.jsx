/**
 * 后台-顶部栏组件
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import Cookies from 'js-cookie'
import { Icon, Modal } from 'antd'
import '../../assets/css/admin_topbar.less'
import { reqLogin } from '../../api'
import { isStudent, isTeacher, isAdmin } from '../../utils/getUserType'
import tx from '../../assets/img/tx.jpg'

export default class AdminTopbar extends Component {

  // 退出登录
  logout = (e) => {
    e.preventDefault()
    console.log(this.props)
    //1. 显示确认框
    Modal.confirm({
      title: '你确定要退出登录吗？',
      onOk: async () => {
        memoryUtils.user = {}
        Cookies.remove("userInfo")
        window.location.reload()
        await reqLogin()
      }
    })
  }
  // 设置欢迎语
  setWelcomeMessage = () => {
    if (isStudent()) {
      return '同学'
    }
    if (isTeacher()) {
      return '老师'
    }
    if (isAdmin()) {
      return '管理员'
    }
  }

  render () {
    return (
      <div className="topbar_box">
        <div className="left">
          <Icon type="menu" />
        </div>
        <div className="right">
          <div>
            <Link to="/admin/userinfo"><img src={tx} />{memoryUtils.user.real_name}</Link>
          </div>
          <div>
            <Link to="/" target="_blank">回到首页<Icon type="double-right" /></Link>
          </div>
          <div>
            <a href=" " onClick={this.logout}>退出系统&nbsp;<Icon type="logout" /></a>
          </div>
        </div>
      </div>
    )
  }
}
