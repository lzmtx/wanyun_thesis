/**
 * 首页组件
 */
import React, { Component } from 'react'
import '../assets/css/home.less'
import '../assets/css/page_banner.less'
import memoryUtils from '../utils/memoryUtils';
import { Icon } from 'antd'
import Index from './Index'

export default class Home extends Component {
  componentDidMount () {
    document.title = "首页" + memoryUtils.page_title_suffix
    
  }
  render () {
    return (
      <Index>
        <div className="page_banner">
          <div className="content">
            <div className="title">
              <div>万云论文-主标题</div>
              <div>副标题</div>
              <div>
                <button>按钮一</button>
                <button>按钮二</button>
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
        <div className="mid_content">
          这是首页啊
          <div className="content_box">
            
            确定好首页内容如何布局<br />

            <p>确定好全屏布局，一页一屏</p>

            <p>导航栏随着内容而动态选中</p>

            <p>沉浸式页面</p>

            <p>提升页面质感</p>

            <p><b>
              使用全屏滚动，一页一屏一菜单，设置三到四页就好，然后公告单独出现一页，之后登录
            </b></p>
            <p><b>
              全屏要够炫
            </b></p>

          </div>
        </div>
      </Index>

    )
  }
}
