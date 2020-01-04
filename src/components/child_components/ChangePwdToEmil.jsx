import React, { Component } from 'react'
import { Form, Card, Button, Input, message } from 'antd';
import {
  reqPasswordRecoveryVerificationCodeSent,
  reqMailboxResetPassword
} from '../../api';

class ChangePwdToEmil extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      default_email: ''
    }
  }
  componentDidMount() {
    this.setDefaultEmail()
  }
  setDefaultEmail = (email = this.props.DefaultEmail || '') => {
    this.setState({ default_email: email !== 'null' ? email : '' })
  }
  /**
   * 重置密码逻辑
   * 设置步骤条，上一步，下一步
   * 重置完成则返回第一步
   * 给一定的操作时间，若未在相应时间内完成操作，则需要重新开始
   * 方式：设置倒计时
   */

  /**
   * 封装button
   * 使用独立button并设置state，自定义是否loading
   * 传值控制：传入回调函数，并开启自定义loading
   * 回调，若父组件函数执行完成，则传回state
   * 子组件判断state并适当loading
   */

  validateEmail = (rule, value, callback) => {
    let regQQ = /^([a-zA-Z]|[0-9])(\w|-)+@qq+\.com$/;
    let regSina = /^([a-zA-Z]|[0-9])(\w|-)+@sina+\.com$/;
    if (value && regQQ.test(value) | regSina.test(value)) {
      callback()
    } else {
      callback("仅支持qq、sina邮箱！")
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.send_verification_code(values.e_mail)
      }
    })
  }
  send_verification_code = async (e_mail) => {
    let res = await reqPasswordRecoveryVerificationCodeSent(e_mail)
    console.log("返回数据：", res)
    if (res.data.code === 1) {
      message.success("验证发发送成功，请注意查收！")
      this.setState({
        step: 2
      })
    }
    if (res.data.code === 4001) {
      message.warning(res.data.message)
    }
    if (res.data.code === 4002) {
      message.warning("请使用已绑定的邮箱进行密码重置！")
    }
  }
  handleSubmitBindEmail = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.changePwdToEmil(values.verificationCode, values.newPassword)
      }
    })
  }
  changePwdToEmil = async (verificationCode, newPassword) => {
    let res = await reqMailboxResetPassword(verificationCode, newPassword)
    console.log("返回数据：", res)
    if (res.data.code === 1) {
      message.success("重置成功！")
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card
        className=""
        title="通过邮箱重置密码"
        extra={this.props.toLogin ? this.props.toLogin : ''}
      >
        {
          this.state.step === 1 ?
            <Form onSubmit={this.handleSubmit} style={{ width: '350px', marginLeft: '16.5%', marginTop: '15px' }}>
              <Form.Item>
                {getFieldDecorator('e_mail', {
                  initialValue: this.state.default_email,
                  rules: [
                    {
                      required: true,
                      message: '请输入E-mail ！',
                    },
                    {
                      type: 'email',
                      message: '请输入正确的E-mail ！',
                    },
                    {
                      validator: this.validateEmail,
                    },
                  ],
                })(<Input autoComplete="off" placeholder="请输入 QQ 或 sina 邮箱地址" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" >
                  发送验证码
                  </Button>
              </Form.Item>
            </Form>
            :
            <Form onSubmit={this.handleSubmitBindEmail} style={{ width: '350px', marginLeft: '16.5%', marginTop: '15px' }}>
              <Form.Item>
                {getFieldDecorator('newPassword', {
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码 ！',
                    }
                  ],
                })(<Input.Password autoComplete="off" placeholder="请输入新密码" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('verificationCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码！',
                    }
                  ],
                })(<Input className="test" autoComplete="off" placeholder="请输入 5 位验证码" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" >
                  确认绑定
                  </Button>
              </Form.Item>
            </Form>
        }
      </Card>
    )
  }
}

const WrappedUser = Form.create({ name: 'ChangePwdToEmil' })(ChangePwdToEmil);
export default WrappedUser