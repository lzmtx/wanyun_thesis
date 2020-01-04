/**
 * 程序入口
 */
import './assets/css/index.less'
import React, { Component } from 'react';
import { ConfigProvider, message } from 'antd'
import Cookies from 'js-cookie'
import memoryUtils from './utils/memoryUtils'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
// 引入路由组件
import Home from './pages/Home'
import Help from './pages/Help'
import About from './pages/About'
import Notice from './pages/Notice'
import ErrorPage from './pages/ErrorPage'
import Login from './pages/Login'
import Admin from './pages/Admin'
import ForgetPassword from './components/child_components/ForgetPassword'
// 引入语言包
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import RightBottomBtns from './components/RightBottomBtns'
import Index from './pages/Index';

// 全局配置 message
message.config({
  top: 100,
  duration: 3,
  maxCount: 3,
})
/**
 * 封装全局进程组件，例如：
 * 文件上传：有文件上传任务则新建一个上传弹窗，放入右侧列表使其保持上传会话，不受页面切换的影响
 * 消息通知：在任何页面都能看到相应的消息信息
 * 。。。
 */

class App extends Component {
  componentDidMount () {
    let userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("firefox") >= 1) {
      let Findex = userAgent.indexOf("firefox/")
      let versionName = userAgent.substr(Findex + "Firefox/".length, 3)
      memoryUtils.Firefox = true
      console.log("火狐浏览器版本：Firefox/" + versionName)
    }
  }
  render () {
    if (Cookies.get("userInfo")) {
      memoryUtils.user = JSON.parse(Cookies.get("userInfo"))
    }
    return (
      <ConfigProvider locale={zh_CN}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/notice" component={Notice} />
            <Route path="/about" component={About} />
            <Route path="/help" component={Help} />
            <Route exact path="/index" component={Index} />
            <Route path="/admin" component={Admin} />
            <Route path="/login" component={Login} />
            <Route path="/forgetPassword" component={ForgetPassword} />
            <Route component={ErrorPage}></Route>
          </Switch>

          <RightBottomBtns />
        </Router>
      </ConfigProvider>
    )
  }
}

export default App
