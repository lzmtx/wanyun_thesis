/**
 * 公告组件
 */
import React, { Component } from 'react'
import memoryUtils from '../utils/memoryUtils'
import $ from 'jquery'
import '../assets/css/notice.less'
import Index from './Index'
import { reqNoticeList, reqNoticeContent } from '../api'
import PageBanner from '../components/PageBanner'

export default class Notice extends Component {
  state = {
    notice_list: {},
    notice_list_dom: "",
    initId: "",
    notice: {
      id: "",
      title: "",
      content: "",
      author: "",
      time: ""
    }
  }

  // 请求第一条公告内容
  getNoticeContent = async (_id) => {
    let res = await reqNoticeContent(_id)
    if (res.data.err === 1) {
      console.log("内容请求完成", res.data)
      let resData = res.data.data[0]
      this.setState({
        notice: {
          id: resData.id,
          title: resData.title,
          content: resData.content,
          author: resData.author,
          time: resData.time
        },
      }, () => {
        $(".notice_content img").css("display", "none")
        $(".notice_content img").fadeIn()
      })
    }
  }
  // 请求所有公告列表
  reqAllNoticeList = async () => {
    let res = await reqNoticeList()
    if (res.data.err === 1) {
      this.setState({ notice_list: res.data.data }, () => {
        this.setNoticeListDOM(this.state.notice_list)
      })
    }
  }
  // 设置列表DOM
  setNoticeListDOM = (noticeList = []) => {
    if (noticeList !== []) {
      let noticeDomArr = []
      for (const i in noticeList) {
        let item = noticeList[i]
        let list_item
        list_item = (
          <div
            className="list_item"
            data-id={item.id}
            key={item.id}
            title={item.title}
          >
            {item.title}
          </div>
        )
        if (i === "0") {
          list_item = (
            <div
              className="list_item select_notice_item"
              data-id={item.id}
              key={item.id}
              title={item.title}
            >
              {item.title}
            </div>
          )
        }
        noticeDomArr.push(list_item)
      }
      this.setState({ notice_list_dom: noticeDomArr }, () => {
        this.getNoticeContent(this.state.notice_list[0].id)
        this.bindEvent()
      })
    }
  }
  // 给公告列表绑定点击事件
  bindEvent = () => {
    let _this = this
    $(".list_item").bind("click", function () {
      $(".list_item").removeClass("select_notice_item")
      $(this).addClass("select_notice_item")
      // 请求公告内容
      _this.getNoticeContent($(this).attr("data-id"))
    })
  }
  componentWillMount () {
    this.reqAllNoticeList()
  }
  componentDidMount () {
    document.title = "通知公告" + memoryUtils.page_title_suffix
  }

  render () {
    return (
      <Index>
        <div className="mid_content">
          <div className="list_content">
            <div className="notice">
              <div className="notice_title">{this.state.notice.title}</div>
              <div className="author">
                <span>{this.state.notice.author}</span>
                <span>{this.state.notice.time}</span>
              </div>
              <div className="notice_content" dangerouslySetInnerHTML={{ __html: this.state.notice.content }}></div>
              <div className="notice_footer">
                <span>阅读结束~</span>
              </div>
            </div>

            <div className="list">
              <div id="notice_list">
                {this.state.notice_list_dom}
              </div>
            </div>
          </div>

        </div>
      </Index>
    )
  }
}
