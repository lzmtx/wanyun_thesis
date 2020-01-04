/**
 * 后台子组件-评分按钮
 */
import React, { Component, Fragment } from 'react'
import { Button, Modal, Alert } from 'antd'
import { reqPaperChecking } from '../../api'

export default class ChildScore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btnLoading: false,
      record: this.props.record,
      qualified: true,
      visible: false,
      alert: {
        message: '',
        type: ''
      },
      fileName: '',
      similarity: ''
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }
  // 查重
  toCheck = async () => {
    console.log("开始查重，接收数据：", this.props.record)
    this.setState({ btnLoading: true })
    let { file_name, student_id } = this.state.record
    let res = await reqPaperChecking(file_name, student_id)
    console.log("查重结果：", res)
    if (res.data.code === 1) {
      this.setState({ visible: true })
      this.setTips(res.data.data)
    }
  }
  // 设置提示框内容
  setTips = (data = {}) => {
    if (JSON.stringify(data) === "{}") {
      this.setState({
        visible: true,
        qualified: false,
        btnLoading: false,
        alert: {
          message: '合格！',
          type: 'success'
        }
      })
    } else {
      let item
      for (item in data) {
        this.setState({
          visible: true,
          qualified: true,
          btnLoading: false,
          alert: {
            message: '不合格！',
            type: 'error'
          },
          fileName: item,
          similarity: Math.round(Number(data[item]) * 10000) / 100
        })
      }
    }
  }
  setAlertDescription = () => {
    if (this.state.qualified) {
      return (
        <Fragment>
          <p style={{ marginTop: 15 }}>相似率过高！相似文章：</p>
          <p><b>{this.state.fileName}</b></p>
          <p>相似程度：<b style={{ color: 'red' }}>{this.state.similarity}%</b></p>
        </Fragment>
      )
    } else {
      return '查重通过，你可以对其进行评分操作！'
    }
  }
  disableRating = () => {
    if (this.state.record.fraction)
      return false
    else
      if (this.state.qualified)
        return true
      else
        return false
  }

  render() {
    return (
      <Fragment>
        <span>
          <Button disabled={this.state.record.fraction ? true : false} loading={this.state.btnLoading} onClick={() => { this.toCheck(this.props.record) }}>查重</Button>
          <Button disabled={this.disableRating()} onClick={() => { this.props.showModal(this.props.record) }}>评分</Button>
        </span>
        <Modal
          title="查重结果"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={false}
        >
          <Alert
            message={this.state.alert.message}
            description={this.setAlertDescription()}
            type={this.state.alert.type}
            showIcon
          />
        </Modal>
      </Fragment>
    )
  }
}
