/**
 * 首页组件
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import memoryUtils from '../utils/memoryUtils';
import PageBanner from '../components/PageBanner';
import $ from 'jquery'
import '../assets/css/home.less'

export default class Home extends Component {
  componentDidMount () {
    document.title = "首页" + memoryUtils.page_title_suffix

    $(function () {
      $(".page").css({
        "width": "100%",
        "height": "100%"
      })
      // 页面下标
      let pageIndex = 0
      // 存储所有滚动值
      let heightArr = []
      $(".page").each(index => {
        heightArr.push($(".page:eq(" + index + ")").offset().top)
      })

      // 滚动开关
      let scrollUp = true, scrollDown = true
      // 滚动方法
      function scrollPage (direction) {
        if (direction === "up") {
          --pageIndex
          if (pageIndex < 0) {
            pageIndex = 0
          }
          $('html').animate({ scrollTop: heightArr[pageIndex] }, 800, () => {
            scrollUp = true
            setNavItemStyle(pageIndex)
            $(".animate_item").fadeOut()
          })
        }
        if (direction === "down") {
          ++pageIndex
          if (pageIndex > heightArr.length - 1) {
            pageIndex = heightArr.length - 1
          }
          $('html').animate({ scrollTop: heightArr[pageIndex] }, 800, () => {
            scrollDown = true
            setNavItemStyle(pageIndex)
            $(".animate_item").fadeIn()
          })
        }
      }
      // 监听鼠标滚动事件
      $(document).on("mousewheel DOMMouseScroll", function (e) {
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
          (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));  // firefox
        if (delta > 0) {
          if (scrollUp) {
            scrollUp = false
            scrollPage("up")
          }
        } else if (delta < 0) {
          if (scrollDown) {
            scrollDown = false
            scrollPage("down")
          }
        }
      })

      // 给菜单项绑定点击事件
      $(".home_nav .nav_bar .right .nav_item").bind("click", function () {
        pageIndex = $(this).index()
        setNavItemStyle(pageIndex)
        $('html').animate({ scrollTop: heightArr[pageIndex] }, 800, () => { })
      })

      // 给菜单栏设置样式
      function setNavItemStyle (index) {
        $(".home_nav .nav_bar .right .nav_item").removeClass("selectNavItem")
        $(".home_nav .nav_bar .right .nav_item:eq(" + index + ")").addClass("selectNavItem")
        if (index === 1) {
          $(".home_nav").addClass("nav_bar_themeColor")
        } else {
          $(".home_nav").removeClass("nav_bar_themeColor")
        }
      }
    })
  }
  render () {
    return (
      <div className="home_box">
        <div className="home_nav">
          <div className="nav_bar">
            <div className="left">
              <Link to="/">
                <div className="logo_box"></div>
              </Link>
            </div>
            <div className="right">
              <div className="nav_item selectNavItem">
                <span>首页</span>
              </div>
              <div className="nav_item">
                <span>产品特点</span>
              </div>
              <div className="nav_item">
                <span>报告演示</span>
              </div>
              <div className="nav_item">
                <Link className="link" to="/notice" target="_blank"><span>资讯公告</span></Link>
              </div>
              <div className="nav_item">
                {
                  memoryUtils.user.real_name
                    ?
                    <Link className="link" to="/admin/userinfo"><span>后台管理</span></Link>
                    :
                    <Link className="link" to="/admin/login"><span>登录</span></Link>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="page">
          <PageBanner />
        </div>
        <div className="page features">
          <div className="contentBox">
            <div className="item_box">
              <div className="item">
                <p>智能检测比对算法</p>
                <div>
                  万云采用强大的智能语义识别技术，能够快速的命中并识别出检测文件与比对源
                  中的相似内容，系统的检测速度、检测精度、检测全面性已达行业顶级，与学校采
                  用的主流论文检测系统算法技术处于同一水平。
                </div>
              </div>
              <div className="item">
                <p>检测文献安全</p>
                <div>
                  万云将严格遵守版权政策和个人隐私保护相关规定，承诺绝不对用户上传的文献
                  做任何形式的收录与泄露。
                </div>
              </div>
            </div>
            <div className="item_box">
              <div className="item">
                <p>海量检测比对资源库</p>
                <div>
                  万云通过合法途径整合了数十亿检测比对资源，包括中文学术期刊库、学位论文
                  库、本科论文共享库等国内外海量数据库资源，以及数十亿互联网资源，同时比
                  对资源库以每月数百万篇的速度定期更新，并可实时检测比对互联网资源，真正
                  做到了“火眼金睛”。
                </div>
              </div>
              <div className="item">
                <p>检测价格与质量</p>
                <div>
                  万云从创立开始就坚持以互联网思维运营，论文检测价格维持在行业平均水
                  平，不恶意虚假标注，承诺始终以优质的价格提供专业的服务。
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page report_presentation">
          <div className="presentation_box">
            <div className="div_img"></div>
          </div>
        </div>
      </div>
    )
  }
}
