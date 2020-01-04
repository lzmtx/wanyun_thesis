/**
 * 后台管理的左侧菜单栏组件
 */
import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import MenuList from '../../config/admin_menulist'
import memoryUtils from '../../utils/memoryUtils'
import logo from '../../assets/img/logo_new_bai.png'
import logo2 from '../../assets/img/home_logo2.png'
import '../../assets/css/left_nav.less'

const { SubMenu } = Menu;

class LeftNav extends Component {

  // 根据用户类型生成新的menu数组
  constructor(props) {
    super(props)
    this.state = {
      loginState: (
        <span className="online"><Icon type="check-circle" /> 在线</span>
        // <span className="outline"><Icon type="plus-circle" /> 离线</span>
      )
    }
    // 从内存中获取当前用户的类型
    const nowRoles = memoryUtils.user.type
    // 深拷贝原数组
    let newMenuList = JSON.parse(JSON.stringify(MenuList))
    // 存放处理后的新数组
    let nowMenuList = []
    getMenuList(newMenuList, nowRoles)

    function getMenuList (newMenuList, nowRoles) {
      return newMenuList.map(item => {
        // 如果有权限
        if (item.roles.indexOf(nowRoles) !== -1) {
          // 如果有子项
          if (item.children) {
            let newChildrenItem = []
            item.children.map(item => {
              if (item.roles.indexOf(nowRoles) !== -1) {
                newChildrenItem.push(item)
              }
              return ''
            })
            let newItem = {
              title: item.title,
              key: item.key,
              icon: item.icon,
              roles: item.roles,
              children: newChildrenItem
            }
            nowMenuList.push(newItem)
          } else {
            nowMenuList.push(item)
          }
        }
        return ''
      })
    }
    this.menuNodes = this.getMenuNodes_map(nowMenuList)
  }

  //根据menu的数据数组生成对应的标签数组
  getMenuNodes_map = (MenuList) => {

    //得到当前请求的路由路径
    const nowpath = this.props.location.pathname

    return MenuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              {item.icon ? <Icon type={item.icon} /> : ''}
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        // 查找与当前请求路径匹配的子项
        const cItem = item.children.find(cItem => cItem.key === nowpath)
        // 如果有值就选中
        if (cItem) {
          this.openKey = item.key
        }
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes_map(item.children)}
          </SubMenu>
        )
      }
    })
  }

  render () {
    //得到当前请求的路由路径
    const nowpath = this.props.location.pathname
    // 需要打开的key
    const openkey = this.openKey

    return (
      <div className="left_nav_box">
        <div className="admin_logo_box">
          <Link to="/admin/userinfo">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="menu_box">
          <Menu
            mode="inline"
            selectedKeys={[nowpath]}
            defaultOpenKeys={[openkey]}
            onClick={this.handleMenuChange}
          >
            {this.menuNodes}
          </Menu>
        </div>
        <div className="bottom">
          登陆状态&nbsp;&nbsp;&nbsp;&nbsp;{this.state.loginState}
        </div>
      </div >
    )
  }
}

/*
withRouter高阶组件：包装非路由组件，返回一个新的组件
新组件向非路由组件传递三个属性：history/location/match
 */
export default withRouter(LeftNav)
