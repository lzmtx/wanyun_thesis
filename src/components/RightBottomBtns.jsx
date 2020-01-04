/**
 * 向上滚动组件
 */
import React, { Component } from 'react'
import { Icon } from 'antd'
import $ from 'jquery'

export default class RightBottomBtns extends Component {
  state = {}
  scrollTop = () => {
    $('body,html').animate({ scrollTop: 0 }, 800);
  }
  addFavorite = () => {
    let sURL = "http://www.lzmtx.com:8080/lwxt/index.html"
    let sTitle = "万云论文管理系统"
    try {
      window.external.addFavorite(sURL, sTitle);
    }
    catch (e) {
      try {
        window.sidebar.addPanel(sTitle, sURL, "");
      }
      catch (e) {
        alert("加入收藏失败，有劳您手动添加。");
      }
    }
  }

  componentDidMount () {
    console.log("右下角按钮区被渲染")

    $(document).scroll(function () {
      if ($(document).scrollTop() > 200) {
        $(".right_bottom_btn_box").fadeIn()
      }
      if ($(document).scrollTop() < 200) {
        $(".right_bottom_btn_box").fadeOut()
      }
      // 将顶部导航栏固定
      if ($(document).scrollTop() > $(".nav_bar_box").height()) {
        $("#header").addClass("nav_bar_fixed")
        $("#notice_list").addClass("notice_list_fixed")
      } else {
        $("#header").removeClass("nav_bar_fixed")
        $("#notice_list").removeClass("notice_list_fixed")
      }
    })
  }
  render () {
    return (
      <div className="right_bottom_btn_box">
        <div className="item" onClick={this.addFavorite}>收藏</div>
        <div
          className="item toUp"
          title="返回顶部"
          onClick={this.scrollTop}
        >
          <Icon type="caret-up" />
        </div>
      </div>
    )
  }
}
