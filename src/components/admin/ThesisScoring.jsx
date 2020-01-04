/**
 * 后台-论文评分
 */
import React, { Component } from 'react'
import { Button, Card, Select, message, Table, Modal, Input } from 'antd'
import ChildPaginationPack from '../child_components/ChildPaginationPack'
import ChildHideTableLoading from '../child_components/ChildHideTableLoading'
import {
  reqTeacherViewPaperSubmissionStatus,
  reqDownload,
  reqDocToPdf,
  reqTeacherViewReportSubmissions,
  reqTeacherTeacherPaperRating,
  reqTeacherViewPublishedTopics,
  reqDeletePresentation,
  reqDeletePapers,
  reqDuplicateDetails
} from '../../api'
import ChildRefreshBtn from '../child_components/ChildRefreshBtn'
import memoryUtils from '../../utils/memoryUtils'
import ChildScore from '../child_components/ChildScore'
import $ from 'jquery'
import { antCardS } from "../../utils/AddAnimation"

const { Option } = Select;

export default class ThesisScoring extends Component {
  state = {
    topic_name: '',
    paper_topic: '',
    paper_topic_id: 9,
    file_type: '开题',
    all_thesis_titles: [],
    visible: false,
    disabledSelectThesisType: true,
    showLoading: false, // 显示loading
    table_dataSource: [], // 表格数据
    showTeacherComponent: false, // 显示教师组件
    paginationDate: {
      pageNum: 1, // 当前页
      pageSize: 5,  // 每页显示记录数
      startIndex: 0, // 开始下标（从第几条记录开始）
      totalPage: 1, // 总页数
      totalRecord: 1, // 总记录数
    },
    selectedByDefault: '请选择题目'
  }
  componentDidMount () {
    document.title = "论文评分" + memoryUtils.page_title_suffix
    this.getAllThesisTitle()
    this.autoRequestSubmissionStatus()
    antCardS($)
  }

  // 获取所有已发布的选题
  getAllThesisTitle = async () => {
    // 开始请求
    let res = await reqTeacherViewPublishedTopics(1, 10000)
    let resData = res.data.data
    if (resData.datas) {
      this.setState({
        all_thesis_titles: resData.datas
      })
    }
  }
  // 自动请求指定选题的提交情况
  autoRequestSubmissionStatus = () => {
    if (memoryUtils.currentThesisTitleData.key) {
      // 设置默认选中
      this.setState({
        paper_topic_id: memoryUtils.currentThesisTitleData.key,
        disabledSelectThesisType: false
      }, () => {
        this.getThesis_scoring(1, 5)
      })
    }
  }
  // 查询提交情况
  getThesis_scoring = async (pageNum, pageSize) => {
    // 显示Loading
    this.setState({ showLoading: true })
    let file_type, res
    if (this.state.file_type === "开题") {
      file_type = "opening_question"
    }
    if (this.state.file_type === "中期") {
      file_type = "medium_term"
    }
    if (this.state.file_type === "论文") {
      file_type = ""
    }
    let date = [
      pageNum || this.state.paginationDate.pageNum,
      pageSize || this.state.paginationDate.pageSize,
      this.state.paper_topic_id
    ]
    if (file_type) {
      res = await reqTeacherViewReportSubmissions(...date, file_type)
    } else {
      res = await reqTeacherViewPaperSubmissionStatus(...date)
    }
    if (res.data.data.datas) {
      this.setState({
        paginationDate: {
          pageNum: res.data.data.pageNum,
          pageSize: res.data.data.pageSize,
          totalRecord: res.data.data.totalRecord,
          startIndex: res.data.data.startIndex,
          totalPage: res.data.data.totalPage
        }
      })
      this.showData(res.data.data.datas)
    }
    // 隐藏loading
    ChildHideTableLoading(this)
  }
  // 刷新数据
  handleRefresh = () => {
    this.getThesis_scoring(1)
  }
  // 开始评分
  thesis_scoring = async (record) => {
    let res = await reqTeacherTeacherPaperRating(this.state.achievement, record.papers_id)
    console.log("ressss: ", res)
    if (res.data.code === 1 || res.data.code === 5) {
      message.success(res.data.message)
      this.getThesis_scoring()
      this.setState({ visible: false })
    }
  }

  getDuplicateCheckResult = async (record) => {
    console.log(record)
    let res = await reqDuplicateDetails(record.file_name, record.student_id)
    console.log("不知道请求是否成功：", res)
    if (res.data.code === 1) {
      console.log("获取数据：", res.data.data)
    }
  }
  // 显示对话框
  showModal = (rowdata) => {
    console.log("显示对话框：", rowdata)
    this.setState({
      visible: true,
      thesisTitle: rowdata.thesisTitle,
      studentLoginId: rowdata.studentLoginId,
      nameOfPaper: rowdata.nameOfPaper,
      record: rowdata
    })
  }
  // 对话框取消按钮
  handleCancel = e => {
    this.setState({
      visible: false,
    })
  }

  //监听评分输入框框的变化
  changeNum = e => this.setState({ achievement: e.target.value })
  // 监听下拉框的改变
  handleSelectThesisChange = (e) => {
    console.log("所有数据:", this.state.all_thesis_titles)
    console.log("开始请求，当前题目：", this.state.all_thesis_titles[e])
    this.setState({
      paper_topic_id: this.state.all_thesis_titles[e].paper_topic_id,
      disabledSelectThesisType: false
    }, () => {
      this.getThesis_scoring(1, 5)
    })
  }
  // 监听报告类型的改变
  handleSelectThesisTypeChange = (e) => {
    this.setState({
      file_type: e
    }, () => {
      this.getThesis_scoring(1, 5)
    })
  }
  // 设置题目选择器
  setThesisSelect = (Titles) => {
    return (
      <span className="thesis_scoring">
        <Select
          className="right_top_bar_item"
          onChange={this.handleSelectThesisChange}
          placeholder="请选择题目"
          style={{ minWidth: 200 }}
          defaultValue={memoryUtils.currentThesisTitleData.paper_topic}
        >
          {Titles.map((item, index) => (
            <Option key={item.paper_topic_id} value={index}>{item.paper_topic}</Option>
          ))}
        </Select>
        <Select
          className="right_top_bar_item"
          onChange={this.handleSelectThesisTypeChange}
          defaultValue="开题"
          disabled={this.state.disabledSelectThesisType}
          style={{ minWidth: 120 }}
        >
          <Option value="开题">开题</Option>
          <Option value="中期">中期</Option>
          <Option value="论文">论文</Option>
        </Select>
        <ChildRefreshBtn
          className="right_top_bar_item"
          disabled={this.state.disabledSelectThesisType}
          onClick={this.handleRefresh} />
      </span>
    )
  }
  // 设置表格表头
  initTableColumns = () => {
    // 表头
    let columns
    this.state.file_type === "论文" ? columns = [
      {
        title: '学生学号',
        dataIndex: 'student_name',
        key: 'student_name',
      },
      {
        title: '提交时间',
        dataIndex: 'upload_date',
        key: 'upload_date',
      },
      {
        title: '文件名称',
        dataIndex: 'file_name',
        key: 'file_name',
      },
      {
        title: '成绩',
        dataIndex: 'achievement',
        key: 'achievement',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <Button onClick={() => { this.fileDownload(record) }}>下载</Button>
            <Button onClick={() => { this.showDocToPdf(record) }}>预览</Button>
            <Button onClick={() => { this.turnDown(record) }}>退回</Button>
            {
              this.state.file_type === "论文"
                ?
                <span>
                  <Button onClick={() => this.getDuplicateCheckResult(record)}>查重结果</Button>
                  <ChildScore record={record} showModal={this.showModal} />
                </span>
                :
                ""
            }
          </span>
        ),
      }
    ] : columns = [
      {
        title: '学生学号',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '提交时间',
        dataIndex: 'upload_date',
        key: 'upload_date',
      },
      {
        title: '文件名称',
        dataIndex: 'file_name',
        key: 'file_name',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <Button onClick={() => { this.fileDownload(record) }}>下载</Button>
            <Button onClick={() => { this.showDocToPdf(record) }}>预览</Button>
            <Button onClick={() => { this.turnDown(record) }}>退回</Button>
          </span>
        ),
      }
    ]
    return columns
  }
  // 退回报告或论文
  turnDown = async (record) => {
    console.log("record： ", record)
    let res
    // 判断是论文
    if (this.state.file_type === '论文') {
      res = await reqDeletePapers(record.student_id, record.papers_id)
      console.log("退回论文")
    } else {
      res = await reqDeletePresentation(record.student_id, record.file_type)
      console.log("退回报告")
    }
    if (res.data.code === 1) {
      this.getThesis_scoring()
      message.success(res.data.message)
    } else {
      message.error(res.data.message)
    }
  }
  // 文件下载
  fileDownload = (record) => {
    console.log("record： ", record)
    window.location.href = reqDownload + "?data_name=" + record.file_name + "&upload_user_id=" + record.student_id
  }
  // 在线预览
  showDocToPdf = (record) => {
    console.log("record： ", record)
    window.open(reqDocToPdf + "?fileName=" + record.file_name + "&upload_user_id=" + record.student_id, '_blank', "top=200,left=200,height=600,width=800,status=yes,toolbar=1,menubar=no,location=no,scrollbars=yes");
  }
  // 初始化表格
  showData = (Data) => {
    // 构建表格数据
    let jsonArr = []
    Data.map(item => {
      let jsonItem = {
        key: item.student_id + item.upload_date,
        papers_id: item.papers_id,
        achievement: item.fraction ? item.fraction : "未评分",
        storage_address: item.storage_address,
        student_name: item.student_name,
        user_name: item.user_name,
        student_id: item.student_id,
        teacher_id: item.teacher_id,
        file_type: item.file_type,
        file_name: this.state.file_type === "论文" ? item.thesis_title : item.file_name,
        topic_name: item.topic_name,
        upload_date: item.upload_date
      }
      jsonArr.push(jsonItem)
      return ''
    })

    // 设置表格数据
    this.setState({
      table_dataSource: jsonArr
    })

    // 延时隐藏loading
    setTimeout(() => { this.setState({ showLoading: false }) }, 500)
  }

  render () {
    return (
      <div>
        <Card
          className="card"
          title="查看论文提交情况"
          extra={this.setThesisSelect(this.state.all_thesis_titles)}
        >
          <Table
            pagination={false}
            dataSource={this.state.table_dataSource}
            columns={this.initTableColumns()}
            loading={this.state.showLoading}
          />
          <div className="Pagination_bar">
            <ChildPaginationPack
              paginationDate={this.state.paginationDate}
              requestDate={this.getThesis_scoring}
            />
          </div>
        </Card>

        <Modal
          title="评分"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={false}
        >
          <Input placeholder="填写分数" value={this.state.achievement} onChange={this.changeNum} style={{ width: '80%' }} />
          <Button type="primary" onClick={() => this.thesis_scoring(this.state.record)} style={{ width: '15%', marginLeft: '4%' }}>提交</Button>
          <p></p>
          <p title="占位">提示：论文成绩采取百分制，等级按照所得分数自动划分</p>
        </Modal>
      </div>
    )
  }

}