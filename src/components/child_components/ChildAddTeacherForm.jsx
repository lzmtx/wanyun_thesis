/**
 * 添加教师账户-表单
 */
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { reqAdminAddTeacherAccounts } from '../../api'

class ChildAddTeacherForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      default_pwd: '123'
    }
    document.onkeypress = function (e) {
      // 防止 enter 提交
      if (e.keyCode === 13) {
        return false;
      }
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.addStudentAccounts(values)
      }
    })
  }
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  // 手动添加学生用户
  addStudentAccounts = async (values) => {
    let { user_name, user_pwd, real_name, user_phone, teacher_title } = values
    let res = await reqAdminAddTeacherAccounts(user_name, user_pwd, real_name, user_phone, teacher_title)
    if (res.data.code === 1) {
      message.success(user_name + "添加成功")
      this.props.form.resetFields()
    }
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value !== form.getFieldValue('user_pwd')) {
      callback('两次密码不一致！');
    } else {
      callback()
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm_pwd'], { force: true });
    }
    callback()
  }
  validateStudentNumber = (rule, value, callback) => {
    let regex = /^[-+]?\d*$/
    if (value && value.length === 6 && regex.test(value)) {
      callback()
    } else {
      callback('格式错误！')
    }
  }
  validatePhoneNumber = (rule, value, callback) => {
    let regex = /^1[3456789][-+]?\d*$/
    if (value && value.length === 11 && regex.test(value)) {
      callback()
    } else {
      callback('格式错误！')
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 6,
        },
      },
    }
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="工号" >
          {getFieldDecorator('user_name', {
            rules: [
              {
                required: true,
                message: '请输入工号！',
              },
              {
                validator: this.validateStudentNumber,
              },
            ],
          })(<Input autoComplete="off" placeholder="请输入 6 位工号" />)}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator('user_pwd', {
            initialValue: this.state.default_pwd,
            rules: [
              {
                required: true,
                message: '请输入密码！',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password placeholder="默认密码：123" autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="确认密码">
          {getFieldDecorator('confirm_pwd', {
            initialValue: this.state.default_pwd,
            rules: [
              {
                required: true,
                message: '请确认密码！',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="真实姓名">
          {getFieldDecorator('real_name', {
            rules: [{
              required: true,
              message: '请输入真实姓名！'
            }],
          })(<Input autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('user_phone', {
            rules: [
              { required: true, message: '请输入手机号！' },
              { validator: this.validatePhoneNumber }
            ],
          })(<Input autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="职称">
          {getFieldDecorator('teacher_title', {
            rules: [{
              required: true,
              message: '请输入职称！'
            }],
          })(<Input placeholder="讲师、副教授、教授等" autoComplete="off" />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            确认添加
          </Button>
        </Form.Item>
        <div>提示：教师账户自动填入默认密码：123</div>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(ChildAddTeacherForm);
export default WrappedRegistrationForm