export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/items/index',
    'pages/craft/index',
    'pages/monitor/index',
    'pages/chat/index',
    'pages/settings/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: 'AEMobile',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#7a7e83',
    selectedColor: '#3457ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      { pagePath: 'pages/items/index', text: '物品' },
      { pagePath: 'pages/craft/index', text: '合成' },
      { pagePath: 'pages/monitor/index', text: '监控' },
      { pagePath: 'pages/chat/index', text: '聊天' },
      { pagePath: 'pages/settings/index', text: '设置' }
    ]
  }
})
