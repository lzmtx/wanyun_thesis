/**
 * 首页-页脚
 */
import React, { Component } from 'react'
import { Icon } from 'antd'
import qqewm from '../assets/img/qqewm.jpg'
import wxewm from '../assets/img/wxewm.jpg'
import logo from '../assets/img/logo.png'

export default class Footer extends Component {
  render () {
    return (
      <div className="index_footer">
        <div className="top">
          <div className="left">
            <img src={logo} alt="" />
          </div>
          <div className="center"></div>
          <div className="right">
            <img src={qqewm} alt="QQ" />
            <img src={wxewm} alt="WX" />
          </div>
        </div>
        <div className="mid">
          <div className="left">
            Copyright © 2019
          </div>
          <div className="right">
            <a
              target="_blank"
              className="to_github"
              href="https://github.com/lzmtx/lwSystem1.5"
            >
              <Icon type="github" />
            </a>
          </div>
        </div>
        <div className="bottom">
          <p>www.lzmtx.com</p>
        </div>
      </div>
    )
  }
}
