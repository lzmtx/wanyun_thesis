/**
 * 后台-子组件-富文本编辑器-上传图片
 */
import React, { Component } from 'react'
import { Icon, message } from 'antd'
import { reqUploadNoticeImg } from '../../api'
import axios from 'axios'

export default class ChildUploadImg extends Component {
  state = {
    isShow: 'none'
  }
  img_input_change = () => {
    let fileValue = document.getElementsByClassName("file_input")[0].value
    if (fileValue !== '') this.upload()
  }
  // 上传
  upload = async () => {
    this.setState({ isShow: 'block' })
    let url = reqUploadNoticeImg
    let form = new FormData(document.getElementById("file_form"))
    const config = { headers: { "Content-Type": "multipart/form-data" } }
    axios.post(url, form, config).then(response => {
      if (response.data.err === 1) {
        message.success(response.data.msg)
        this.setState({ isShow: 'none' })
        this.props.showImg(response.data.data)
      }
      if (response.data.err === 0) {
        message.error(response.data.msg)
      }
    }).catch(error => {
      message.error("上传失败", error)
      this.setState({ isShow: 'none' })
    })
  }

  render () {
    return (
      <button type="button" className="control-item button upload_button" data-title="插入图片">
        <form id="file_form" encType="multipart/form-data">
          <input className="file_input" name="upload" onChange={this.img_input_change} type="file" required="required" />
          <Icon type="picture" theme="filled" />
          <Icon className="upload_percentage" style={{ display: this.state.isShow }} type="loading" />
        </form>
      </button>
    )
  }
}
