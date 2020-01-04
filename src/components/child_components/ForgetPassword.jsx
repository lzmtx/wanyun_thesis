/**
 * 忘记密码-通过邮箱重置密码
 */
import React, { Component } from 'react'
import ChangePwdToEmil from '../child_components/ChangePwdToEmil'
import { Link } from 'react-router-dom';
import memoryUtils from '../../utils/memoryUtils'
import '../../assets/css/login.less'

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props)
    document.title = "忘记密码" + memoryUtils.page_title_suffix
  }

  style = {
    width: 600,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'absolute',
    top: 'calc(50% - 180px)',
    left: 'calc(50% - 300px)',
    background: '#fff'
  }

  render() {
    return (
      <div className="login_box">
        <div style={{ ...this.style }}>
          <ChangePwdToEmil toLogin={<Link to="/login">登录</Link>} />
        </div>
      </div >
    )
  }
}
