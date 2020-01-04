/**
 * 后台管理组件
 * BUG：地址栏输入/admin 后跳转到/admin/userinfo，但是不自动展开子菜单
 */
import React, { Component } from 'react'
import Cookies from 'js-cookie'
import { Route, Switch, Redirect } from 'react-router-dom'

// 引入路由组件
import LeftNav from '../components/admin/LeftNav'
import AdminTopbar from '../components/admin/AdminTopbar'
import FileMaterial from '../components/admin/FileMaterial'
import QueryFraction from '../components/admin/QueryFraction'
import Userinfo from '../components/admin/Userinfo'
import ChangePwd from '../components/admin/ChangePwd'
import ThesisSelection from '../components/admin/ThesisSelection'
import ThesisScoring from '../components/admin/ThesisScoring'
import StudentManage from '../components/admin/StudentManage'
import StudentManagement from '../components/admin/StudentManagement'
import TeacherManagement from '../components/admin/TeacherManagement'
import GroupManagement from '../components/admin/GroupManagement'
import CustomFooter from '../components/admin/Footer'
import ReleaseNote from "../components/admin/ReleaseNote"
import DataAnalysis from '../components/admin/DataAnalysis'
import PaperCheck from '../components/admin/PaperCheck'
import ErrorPage from '../pages/ErrorPage'

// 引入工具组件
import memoryUtils from '../utils/memoryUtils'
import '../assets/css/admin.less'

export default class Admin extends Component {
  constructor(props) {
    super(props)
    memoryUtils.pageThis = this
  }

  render () {
    // 判断Cookie是否过期
    if (Cookies.get("userInfo")) {
      memoryUtils.user = JSON.parse(Cookies.get("userInfo"))
    }
    const user = memoryUtils.user
    if (!user.real_name) {
      return <Redirect to='/login' />
    }
    return (
      <div id="admin_root">
        <div className="left_menu">
          <LeftNav />
        </div>
        <div className="content_box">
          <div className="content_header">
            <AdminTopbar />
          </div>
          <div className="content_route_page">
            <Switch>
              <Route path='/admin/userinfo' component={Userinfo} />
              <Route path='/admin/change_pwd' component={ChangePwd} />
              <Route path='/admin/file_material' component={FileMaterial} />
              <Route path='/admin/thesis_selection' component={ThesisSelection} />
              <Route path='/admin/query_fraction' component={QueryFraction} />
              <Route path='/admin/thesis_scoring' component={ThesisScoring} />
              <Route path='/admin/student_manage' component={StudentManage} />
              <Route path='/admin/release_note' component={ReleaseNote} />
              <Route path='/admin/student_management' component={StudentManagement} />
              <Route path='/admin/teacher_management' component={TeacherManagement} />
              <Route path='/admin/group_management' component={GroupManagement} />
              <Route path="/admin/data_analysis" component={DataAnalysis} />
              <Route path='/admin/paper_check' component={PaperCheck} />
              <Route component={ErrorPage}></Route>

              <Redirect to="/admin/userinfo" />
            </Switch>
          </div>
          <div className="admin_footer">
            <CustomFooter />
          </div>
        </div>
        <div id="loginExpiredTipBox"></div>
      </div>
    )
  }
}

