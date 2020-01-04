/**
 * 404页面
 */
import React, { Component } from 'react'
import memoryUtils from '../utils/memoryUtils'
import { Button, Result } from 'antd'

export default class ErrorPage extends Component {
  goBackToTheLastPage = () => {
    this.props.history.goBack()
  }
  backToHome = () => {
    this.props.history.replace('/')
  }
  resultExtra = () => {
    return (
      <span>
        <Button type="primary" style={{ marginRight: 100 }} onClick={this.goBackToTheLastPage}>返回上一页</Button>
        <Button type="default" onClick={this.backToHome}>返回首页</Button>
      </span>
    )
  }
  componentDidMount() {
    document.title = "访问出错" + memoryUtils.page_title_suffix
  }
  render() {
    return (
      <div className="error_page">
        <Result
          status="404"
          title="404"
          subTitle="对不起，你访问的页面不存在。"
          extra={this.resultExtra()}
        />
      </div>
    )
  }
}
