/**
 * 首页顶部导航栏组件
 */
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import memoryUtils from '../utils/memoryUtils'
import $ from 'jquery'
import '../assets/css/navbar.less'

class Navbar extends Component {
  componentWillMount () {
    this.setState({
      action: this.props.location.pathname
    })
  }
  componentDidMount () {
    let nowMenu = $(".item_link[href='#" + this.state.action + "']")
    nowMenu.addClass("action")
  }

  render () {
    return (
      <div className="nav_bar_box">
        <div className="nav_bar">
          <Link to="/">
            <div className="logo_box"></div>
          </Link>
          <div className="nav_box">
            <nav>
              <Link className="item_link" to="/">首页</Link>
              <Link className="item_link" to="/notice">资讯公告</Link>
            </nav>
          </div>
          <div className="user">
            <nav>
              {
                memoryUtils.user.real_name
                  ?
                  <Link className="nav_item" to="/admin/userinfo">后台管理</Link>
                  :
                  <Link className="nav_item" to="/admin/login">登录</Link>
              }
            </nav>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Navbar);