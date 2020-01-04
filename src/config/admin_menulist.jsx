/**
 * 后台-左侧菜单配置
 */
const keyStart = '/admin'
const MenuList = [
  {
    title: '个人中心',
    key: keyStart + '/userinfo',
    icon: 'user',
    roles: ['student', 'teacher', 'admin'],
    children: [
      {
        title: '基本信息',
        key: keyStart + '/userinfo',
        icon: '',
        roles: ['student', 'teacher', 'admin']
      },
      {
        title: '安全设置',
        key: keyStart + '/change_pwd',
        icon: '',
        roles: ['student', 'teacher', 'admin']
      },
    ]
  },
  {
    title: '资料管理',
    key: keyStart + '/file_material',
    icon: 'folder',
    roles: ['student', 'teacher', 'admin']
  },
  {
    title: '用户管理',
    key: keyStart + '/user_manage',
    icon: 'team',
    roles: ['admin'],
    children: [
      {
        title: '学生管理',
        key: keyStart + '/student_management',
        icon: '',
        roles: ['admin']
      },
      {
        title: '教师管理',
        key: keyStart + '/teacher_management',
        icon: '',
        roles: ['admin']
      },
      {
        title: '分组管理',
        key: keyStart + '/group_management',
        icon: '',
        roles: ['admin']
      }
    ]
  },
  {
    title: '学生管理',
    key: keyStart + '/student_manage',
    icon: 'team',
    roles: ['teacher']
  },
  {
    title: '论文管理',
    key: keyStart + '/thesis_selection',
    icon: 'container',
    roles: ['student']
  },
  {
    title: '论文查重',
    key: keyStart + '/paper_check',
    icon: 'security-scan',
    roles: ['student', 'teacher']
  },
  {
    title: '论文管理',
    key: keyStart + '/thesis_selection',
    icon: 'container',
    roles: ['teacher'],
    children: [
      {
        title: '论文选题',
        key: keyStart + '/thesis_selection',
        icon: '',
        roles: ['teacher']
      },
      {
        title: '论文评分',
        key: keyStart + '/thesis_scoring',
        icon: '',
        roles: ['teacher']
      },
      {
        title: '论文查重',
        key: keyStart + '/thesis_check',
        icon: '',
        roles: []
      },
      {
        title: '论文数据分析',
        key: keyStart + '/thesis_analysis',
        icon: '',
        roles: []
      }
    ]
  },
  {
    title: '查看成绩',
    key: keyStart + '/query_fraction',
    icon: 'search',
    roles: ['student']
  },
  {
    title: '发布公告',
    key: keyStart + '/release_note',
    icon: 'form',
    roles: ['admin']
  },
  {
    title: '数据分析',
    key: keyStart + '/data_analysis',
    icon: 'area-chart',
    roles: ['admin']
  }
  
]

export default MenuList;