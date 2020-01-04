const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  // 针对antd实现按需打包：根据import来打包（使用babel-plugin-import）
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true, //自动打包相关的样式
  }),
  // 使用less-loader对源码中的less变量进行重新赋值
  addLessLoader({
    javascriptEnabled: true,
    // 主题颜色配置
    modifyVars: {
      // // '@primary-color': '#1890ff', // 全局主色
      // '@primary-color': '#ff9b57', // 全局主色
      // '@link-color': '#5b559b', // 链接色
      // '@success-color': '#52c41a', // 成功色
      // '@warning-color': '#faad14', // 警告色
      // '@error-color': '#f5222d', // 错误色
      // '@font-size-base': '14px', // 主字号
      // '@heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
      // '@text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
      // '@text-color-secondary': 'rgba(0, 0, 0, .45)', // 次文本色
      // '@disabled-color': 'rgba(0, 0, 0, .25)', // 失效色
      // '@border-radius-base': '4px', // 组件/浮层圆角
      // '@border-color-base': '#d9d9d9', // 边框色
      // '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
    },
  })
)