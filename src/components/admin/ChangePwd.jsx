/**
 * 后台-修改密码组件
 */
import React, { Component } from 'react'
import { Form, Card, Button, Input, message } from 'antd';
import ChangePwdToEmil from '../child_components/ChangePwdToEmil';
import { reqUserResetPassword } from '../../api';
import { isAdmin } from '../../utils/getUserType';
import memoryUtils from '../../utils/memoryUtils';
import $ from 'jquery'
import { antCard } from "../../utils/AddAnimation"

class ChangePwd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
    }
    document.title = "安全设置" + memoryUtils.page_title_suffix
  }
  componentDidMount() {
    antCard($)
  }
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm_pwd'], { force: true });
    }
    callback()
  }
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value !== form.getFieldValue('newPassword')) {
      callback('两次密码不一致！');
    } else {
      callback()
    }
  }
  handleSubmitToChangePwd = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ChangePwd(values.oldPassword, values.newPassword)
      }
    })
  }
  ChangePwd = async (oldPassword, newPassword) => {
    let res = await reqUserResetPassword(oldPassword, newPassword)
    if (res.data.code === 1) {
      message.success("修改成功!")
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card
          className="card"
          title="修改密码"
          extra={''}
        >
          <Form onSubmit={this.handleSubmitToChangePwd} style={{ width: '350px', marginLeft: '16.5%', marginTop: '15px' }}>
            <Form.Item>
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: '请输入旧密码！',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password placeholder="请输入旧密码" autoComplete="off" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('newPassword', {
                rules: [
                  {
                    required: true,
                    message: '请输入新密码！',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password placeholder="请输入新密码" autoComplete="off" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('confirm_pwd', {
                rules: [
                  {
                    required: true,
                    message: '请确认密码！',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="请确认新密码" autoComplete="off" />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" >
                确定修改
              </Button>
            </Form.Item>
          </Form>
        </Card>
        {isAdmin() ? "" : <ChangePwdToEmil DefaultEmail={memoryUtils.user.user_email} />}
      </div>
    )
  }
}

const WrappedChangePwd = Form.create({ name: 'ChangePwd' })(ChangePwd);
export default WrappedChangePwd