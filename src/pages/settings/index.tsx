import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import { SERVER_STORAGE_KEY } from '@/config/server'
import './index.scss'

const ROWS = [
  { label: '服务器与账号', desc: '地址 / 端口 / 密码' },
  { label: '图标库', desc: '物品图标来源（图床）' },
  { label: '存储与缓存', desc: '清理本地缓存' },
  { label: '界面布局', desc: '网格密度' },
  { label: '主题', desc: '浅色 / 深色' },
  { label: '关于', desc: 'AEMobile 小程序版 0.0.1' }
]

export default function Settings() {
  let server: any = null
  try {
    server = Taro.getStorageSync(SERVER_STORAGE_KEY) || null
  } catch {
    server = null
  }

  const logout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定退出当前账号？',
      success: (r) => {
        if (r.confirm) {
          Taro.removeStorageSync(SERVER_STORAGE_KEY)
          Taro.reLaunch({ url: '/pages/login/index' })
        }
      }
    })
  }

  return (
    <View className='page'>
      <View className='card'>
        <View className='title'>设置</View>
        <View className='subtitle'>
          {server ? `${server.host}:${server.port}${server.demo ? ' · 演示模式' : ''}` : '未配置服务器'}
        </View>
      </View>

      <View className='card rows'>
        {ROWS.map((r) => (
          <View
            className='row-item'
            key={r.label}
            onClick={() => Taro.showToast({ title: '后续接入', icon: 'none' })}
          >
            <View className='row-left'>
              <View className='row-label'>{r.label}</View>
              <View className='row-desc'>{r.desc}</View>
            </View>
            <Text className='row-arrow'>›</Text>
          </View>
        ))}
      </View>

      <Button block onClick={logout}>
        退出登录
      </Button>
    </View>
  )
}
