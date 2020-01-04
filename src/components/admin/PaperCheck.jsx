/**
 * 后台-论文查重
 */
import React, { Component } from 'react'
import res from '../../assets/res.txt'
import $ from 'jquery'
import '../../assets/css/paper_check.less'
import { AdminSelfCard } from '../../utils/AddAnimation'
import { Icon } from 'antd'

export default class PaperCheck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      similarity_degree: "54%",
      paper_word_number: "",
      paperContent: "原文内容",
      repeatParagraphs: {},
      page_loading: true
    }
  }


  setDivShowContent = () => {
    let _this = this
    let resData

    $.ajax({
      url: res,
      success: function (res) {
        resData = JSON.parse(res)
        console.log(resData.originalText)
        show()
      }
    })

    function resetOriginalText (arr = []) {
      let newText = ""
      for (const item of arr) {
        newText += item
      }
      return newText
    }

    function sumTextLength (str = "") {
      let reg = /[\u4E00-\u9FA5]/g; //测试中文字符的正则
      let length = str.match(reg).length;  //计算中文的个数
      return length
    }

    function show () {
      let newText = resetOriginalText(resData.originalText)
      function setRepeat (duplicateText) {
        newText = newText.replace(duplicateText, "<span class='duplicateSection'>" + duplicateText + "</span>")
      }
      resData.repeatParagraphs.forEach(item => {
        setRepeat(item.duplicateText)
      })
      _this.setState({
        paperContent: newText,
        paper_word_number: sumTextLength(newText)
      }, () => {
        $('.duplicateSection').click(function () {
          console.log("显示文本：", $(this).index(), resData.repeatParagraphs[$(this).index()])
          _this.setState({
            repeatParagraphs: resData.repeatParagraphs[$(this).index()]
          })
        })
      })

    }
  }

  componentDidMount () {
    // 设置 div 高度
    $("#paper_content").height($('.paper_check').height() - $('.originalTextBox .title').height() - 30)
    this.setDivShowContent()
    setTimeout(() => {
      this.setState({ page_loading: false }, () => {
        if (this.state.page_loading) {
          $(".loadingBox").show()
        } else {
          $(".loadingBox").hide()
        }
      })
    }, 2000)
    AdminSelfCard($)
  }

  render () {
    return (
      <div className="paper_check admin_self_card">
        <div className="showBox">
          <div className="paper_res_content" id="paper_res_content">
            <div className="originalTextBox">
              <div className="title">
                <span className="title_text">查重报告区</span>
                <span className="similarity_degree">
                  <span>相似度：</span>
                  <span className="value">{this.state.similarity_degree}</span>
                </span>
                <span className="word_number">
                  <span>字数：</span>
                  <span className="value">{this.state.paper_word_number}</span>
                </span>
                <span>（<span className="red">红色</span>文字表示重复内容）</span>
              </div>
              <div
                id="paper_content"
                className="content"
                dangerouslySetInnerHTML={{ __html: this.state.paperContent }}
              ></div>
            </div>
            <div className="similarSourceBox">
              <div className="title">
                <div className="title_text">您的语句</div>
              </div>
              <div
                className="repeatParagraphs one"
                dangerouslySetInnerHTML={{ __html: this.state.repeatParagraphs.duplicateText }}
              ></div>
              <div className="title">
                <div className="title_text">相似源</div>
              </div>
              <div className="repeatParagraphs paragraphContent_box">
                <div className="paragraphContent">
                  <div>相似原文片段：</div>
                  <div className="content">
                    <span
                      className="similar_sentences"
                      dangerouslySetInnerHTML={{ __html: this.state.repeatParagraphs.similarParagraphs }}
                    ></span>
                  </div>
                  <div>文章名：<span>{this.state.repeatParagraphs.documentName}</span></div>
                </div>
              </div>
            </div>
          </div>
          {
            this.state.page_loading ?
              <div className="loadingBox">
                <div className="content">
                  正在查重，<Icon type="loading" />
                </div>
              </div> : ""
          }
        </div>
      </div>
    )
  }
}
