/**
 * 后台-成绩查询组件
 */
import React, { Component } from 'react'
import { reqStudentResultInquiry } from '../../api'
import { message, Card } from 'antd'
import '../../assets/css/query_fraction.less'
import memoryUtils from '../../utils/memoryUtils'
import ChildRefreshBtn from '../child_components/ChildRefreshBtn'
import $ from 'jquery'
import { antCard } from "../../utils/AddAnimation"

export default class AchievementQuery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fraction: {}
    }
    document.title = "查看成绩" + memoryUtils.page_title_suffix
    this.query_fraction()
  }
  componentDidMount() {
    antCard($)
  }

  query_fraction = async () => {
    let res = await reqStudentResultInquiry()
    console.log("返回数据:", res)
    if (res.data.code === 1) {
      this.setState({
        fraction: res.data.data
      })
      message.success(res.data.message)
    } else {
      if (res.data.code === 2015)
        message.warning('导师未对你的论文进行评分！')
      if (res.data.code === 2014)
        message.warning('你未提交论文！')
    }
  }
  render() {
    return (
      <div>
        <Card
          className="card"
          title="论文成绩"
          extra={<ChildRefreshBtn onClick={this.query_fraction} />}
        >
          <p>提交的文件：<span className="important_info">{this.state.fraction.thesis_title}</span></p>
          <p>上传时间：<span className="important_info">{this.state.fraction.upload_date}</span></p>
          <p>成绩：<span className="important_info">{this.state.fraction.fraction}</span></p>
        </Card>
      </div>
    )
  }
}
