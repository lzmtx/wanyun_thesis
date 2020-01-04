/**
 * 后台子组件-账户封禁开关
 */
import React, { PureComponent } from 'react'
import { Switch, message } from 'antd'

export default class ChildSwitch extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      loading: false,
      switchState: false,
      record: this.props.record
    }
  }
  componentWillMount() {
    // 初始化开关
    this.setState({
      switchState: this.initSwitchState()
    })
  }
  initSwitchState = (recordStateStr = this.props.record.state || "0") => {
    if (recordStateStr === "1") return true
    if (recordStateStr === "0") return false
  }
  unblockAddBanned = async () => {
    let res, switchStateStr
    this.setState({ loading: true })
    if (this.state.switchState) {
      switchStateStr = '封禁'
      res = await this.props.reqUpdateSate(this.state.record.user_name, 0)
    } else {
      switchStateStr = '解封'
      res = await this.props.reqUpdateSate(this.state.record.user_name, 1)
    }
    if (res.data.code === 1) {
      this.setState({
        loading: false,
        switchState: !this.state.switchState
      })
      message.success(switchStateStr + " " + this.state.record.user_name
        + " " + res.data.message)
    }
  }

  render() {
    return (
      <div>
        <Switch
          checkedChildren={this.props.checkedChildrenText}
          unCheckedChildren={this.props.unCheckedChildrenText}
          onClick={this.unblockAddBanned}
          defaultChecked={this.state.switchState}
          size="default"
          loading={this.state.loading}
        />
      </div>
    )
  }
}
