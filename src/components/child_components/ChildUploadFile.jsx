/**
 * 后台子组件-文件上传
 */
import React, { Component } from 'react'
import { Button, message, Progress, Icon } from 'antd'
import axios from 'axios'
import memoryUtils from '../../utils/memoryUtils'
import '../../assets/css/childUploadFile.less'
import ChildLoginExpired from './ChildLoginExpired'

export default class ChildUploadFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonDisabled: true,
      buttonLoading: false,
      showProgress: false,
      percent: 0,
      isException: false,
      res: {}
    }
  }
  // 判断父组件传入的禁用状态
  whetherToDisable = () => {
    console.log("this.props.disable: ", this.props.disable)
    if (this.props.disable) {
      return true
    } else {
      return false
    }
  }
  // 判断是否是函数
  whetherFunction = (parameter) => {
    if (typeof (parameter) === 'function') {
      if (this.state.res) {
        return parameter(this.state.res.data.data)
      } else {
        return parameter()
      }
    } else {
      return ''
    }
  }
  // 手动上传
  manualUpload = e => {
    this.setState({ buttonLoading: true })
    let _this = this
    let form = new FormData(document.getElementById("file_form"))
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // //原生获取上传进度的事件
      // onUploadProgress: function (progressEvent) {
      //   let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
      //   console.log('上传 ' + complete + '%')
      //   _this.setState({ showProgress: true, percent: complete })
      //   if (complete === 100) _this.setState({ isException: false })
      // }
    }
    axios.post(_this.props.url, form, config).then(res => {
      this.setState({ res: res })
      let resCode = res.data.code
      console.log("上传结果：", res)
      // 判断所有返回结果并统一处理
      if (resCode === 1) {
        this.setState({ buttonLoading: false })
        message.success(res.data.message)
        // 调用回调
        this.whetherFunction(this.props.whetherToCallback)
      }
      // 登录过期
      if (resCode === 2001) {
        ChildLoginExpired()
      }
      // 上传用户文件成功
      if (resCode === 2) {
        this.setState({ buttonLoading: false })
        this.whetherFunction(this.props.whetherToCallback)
      }
      if (resCode === 2007) {
        this.setState({ buttonLoading: false })
        message.error("未选择文件或文件数据错误！")
      }
      if (resCode === 2012 || resCode === 2013) {
        this.setState({ buttonLoading: false })
        message.error(res.data.message)
      }
      // 重置进度条
      this.setState({ showProgress: false, percent: 0 })

    }).catch(error => {
      console.log("请求出错：", error)
      _this.setState({
        isException: false,
        buttonLoading: false
      })
      message.error("上传出错：" + error)
    })
  }
  handleFileInputChange = () => {
    let fileValue = document.getElementsByClassName("fileInput")[0].value
    if (fileValue !== '' && this.whetherToDisable() === false) {
      this.setState({ buttonDisabled: false })
    }
    if (fileValue === '') {
      this.setState({ buttonDisabled: true })
    }
  }
  handleFileInputClick = (e) => {
    e.preventDefault()
    document.getElementById("fileInput").click()
  }

  render () {
    return (
      <div className="fileBox">
        <form method="post" id="file_form" encType="multipart/form-data">
          <span className="selectTheFileBox">
            <Button type="default" className="buttonStyle" onClick={this.handleFileInputClick} disabled={this.props.disabledSelf}><Icon className="fileIcon" type="upload" />选择文件</Button>
            <input
              type="file"
              name="uploadfile"
              id="fileInput"
              className="fileInput"
              onChange={this.handleFileInputChange}
              disabled={this.props.disabledSelf}
              style={memoryUtils.Firefox ? { marginLeft: '-62px' } : {}}
            />
          </span>
          <Button type="primary" style={{ marginRight: 10 }} onClick={this.manualUpload} loading={this.state.buttonLoading} disabled={this.state.buttonDisabled}>上传</Button>
          {
            this.state.showProgress ?
              <Progress
                type="circle"
                width={32}
                percent={this.state.percent}
                status={this.state.isException ? "exception" : this.state.percent === 100 ? "success" : "active"}
                strokeWidth={12}
              /> : ""
          }
        </form>
      </div>
    )
  }
}
