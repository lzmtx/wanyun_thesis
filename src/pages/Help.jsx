/**
 * 使用帮助组件
 * 在这个组件中直接测试相关接口
 */
import React, { Component } from 'react'
import memoryUtils from '../utils/memoryUtils'
import '../assets/css/help.less'
import Index from './Index'
import $ from 'jquery'
import PageBanner from '../components/PageBanner'

export default class Help extends Component {
  componentDidMount () {
    document.title = "使用帮助" + memoryUtils.page_title_suffix
  }
  save = () => {
    console.log("开始请求")
    let data = {
      title: "标题啊",
      author: "管理员",
      content: "<p>啊手动阀就杀了对方阿松大发啊</p>"
    }
    $.ajax({
      url: 'http://localhost/php/savetext/save.php',
      type: "post",
      dataType: 'json',
      data: data,
      success: function (res) {
        console.log("成功", res)
      },
      error: function (error) {
        console.log("失败：", error)
      }
    })
    console.log("请求完毕")
  }
  render () {
    return (
      <Index>
        <div className="show_bar">
          <div className="bar_content">这是该显示的内容</div>
          <PageBanner />
        </div>
        <div className="mid_content">
          <div className="self">

            <p>在使用帮助中添加各种后台提示信息</p>

            <p>学生如何操作</p>

            <p>教师如何操作</p>

            <p>在后台界面提供相同的帮助文档查看</p>

            <p>后台中提示管理员该如何使用本系统</p>

            <p>在前台界面中介绍本系统为用户提供何种服务，用户选择我们后会得到何种的方便</p>

            <p>使用帮助可采用折叠面板的形式进行展示</p>

          </div>
        </div>
      </Index>
    )
  }
}
