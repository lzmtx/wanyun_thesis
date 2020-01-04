/**
 * 后台-页脚
 */
import React, { Component } from 'react'
import '../../assets/css/footer.less'

export default class Footer extends Component {
  render () {
    return (
      <div className="footer_content_box">
        <div className="footer_content_text">
          © www.lzmtx.com 2019-2020. All Rights Reserved.
          &nbsp;&nbsp;&nbsp;&nbsp;
          推荐使用谷歌浏览器访问
        </div>
        <div className="admin_footer_animate"></div>
        <div className="admin_footer_animate"></div>
      </div>
    )
  }
}
