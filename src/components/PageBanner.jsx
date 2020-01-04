/**
 * 首页波浪banner区
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Icon } from 'antd'
import '../assets/css/page_banner.less'

export default class PageBanner extends Component {
  render () {
    return (
      <div className="page_banner">
        <div className="content">
          <div className="title">
            <div>论文写的好，毕业没烦恼 ！</div>
            <div>你的论文管家-万云论文</div>
            <div>
              <div className="btn_div">
                <Link to="/login" target="_blank">立即使用</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="banner_box_item">
          <div className="item01 banner_item">
            <div>
              <Icon type="cloud-upload" />
            </div>
          </div>
          <div className="item02 banner_item">
            <div>
              <Icon type="laptop" />
            </div>
          </div>
          <div className="item03 banner_item">
            <div>
              <Icon type="container" />
            </div>
          </div>
        </div>
        <div className="bo_lang bo_lang01"></div>
        <div className="bo_lang bo_lang02"></div>
        <div className="bo_lang bo_lang03"></div>
        <div className="bo_lang bo_lang04"></div>
      </div>
    )
  }
}
