/**
 * 后台-公告发布
 */
import React, { Component } from 'react'
import { Card, Button, Input, message } from 'antd'
import { Prompt } from 'react-router-dom'
import axios from "axios"
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import ChildUploadImg from '../child_components/ChildUploadImg'
import $ from 'jquery'
import { antCard } from "../../utils/AddAnimation"
import 'braft-editor/dist/index.css'
import '../../assets/css/release_note.less'
import { reqSaveNotice } from '../../api'

// 允许携带cookie
axios.defaults.withCredentials = true;
// 不显示加粗控件
const excludeControls = ['media', 'code', 'emoji', 'letter-spacing']

export default class ReleaseNote extends Component {
  state = {
    editorState: BraftEditor.createEditorState(null),
    title: "",
    htmlContent: "",
    btn_disable: true,
    author: "系统管理员",
    upload_img: {
      disabled: false
    },
    notice_writing: false
  }
  handleEditorChange = (editorState) => {
    this.setState({
      editorState: editorState,
      btn_disable: this.state.title && editorState.toHTML() !== "<p></p>" ? false : true,
      notice_writing: this.state.title === "" && editorState.toHTML() === "<p></p>" ? false : true
    })
  }
  titleChange = (e) => {
    this.setState({
      title: e.target.value,
      btn_disable: this.state.editorState.toHTML() !== "<p></p>" && e.target.value ? false : true
    })
  }
  showImg = (imgRrl) => {
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [{
        type: 'IMAGE',
        url: imgRrl
      }])
    })
  }
  submit = () => {
    const htmlContent = this.state.editorState.toHTML()
    console.log("内容：", htmlContent)
    this.setState({ htmlContent: htmlContent }, async () => {
      const data = [
        this.state.title,
        this.state.author,
        this.state.htmlContent
      ]
      let res = await reqSaveNotice(...data)
      if (res.data.err === 1) {
        this.setState({ notice_writing: false })
        message.success(res.data.msg)
        console.log(res.data)
      } else {
        message.error("发布失败，请重试！")
      }
    })
  }
  componentDidMount () {
    antCard($)
  }

  render () {
    const { editorState } = this.state
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (<ChildUploadImg showImg={this.showImg} />)
      }
    ]

    return (
      <div>
        <Card
          className="card"
          title="编辑公告"
          extra={''}
        >
          <div className="write">
            <div className="row">
              <div className="title"><i>*</i>标题：</div>
              <div className="input">
                <Input placeholder="请输入公告标题" onChange={this.titleChange} value={this.state.title} />
              </div>
            </div>
            <div className="row">
              <div className="title"><i>*</i>作者：</div>
              <div className="input">
                <Input placeholder="请输入作者" value={this.state.author} />
              </div>
            </div>
            <div className="row braft_editor_row">
              <div className="title"><i>*</i>内容：</div>
              <div className="input braft_editor_box">
                <BraftEditor
                  excludeControls={excludeControls}
                  value={editorState}
                  onChange={this.handleEditorChange}
                  onSave={this.submitContent}
                  extendControls={extendControls}
                />
              </div>
            </div>
            <div className="write_btn">
              <Button
                type="primary"
                disabled={this.state.btn_disable}
                onClick={this.submit}
              >发布</Button>
            </div>
            <Prompt
              when={this.state.notice_writing}
              message={'你正在编辑文章，确定要离开吗？'}
            />
          </div>
        </Card>
      </div>
    )
  }
}
