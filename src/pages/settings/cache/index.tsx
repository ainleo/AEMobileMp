import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import Button from '@taroify/core/button'
import { ICON_CACHE_KEY } from '@/services/iconHost'
import { useThemeClass } from '@/hooks/useThemeClass'
import './index.scss'

export default function Cache() {
  const theme = useThemeClass()
  const [info, setInfo] = useState<any>({ keys: [], currentSize: 0, limitSize: 0 })

  const refresh = () => {
    try {
      setInfo(Taro.getStorageInfoSync())
    } catch {
      /* ignore */
    }
  }
  useDidShow(refresh)

  const clearIcons = () => {
    Taro.removeStorageSync(ICON_CACHE_KEY)
    refresh()
    Taro.showToast({ title: '已清理图标缓存', icon: 'none' })
  }

  const clearAll = () => {
    Taro.showModal({
      title: '清除全部数据',
      content: '会清除账号与所有缓存，需要重新登录',
      success: (r) => {
        if (r.confirm) {
          Taro.clearStorageSync()
          Taro.reLaunch({ url: '/pages/login/index' })
        }
      }
    })
  }

  return (
    <View className={`page ${theme}`}>
      <View className='card'>
        <View className='title'>存储与缓存</View>
        <View className='subtitle'>小程序本地存储占用</View>
        <View className='kv'>
          <Text className='k'>已用</Text>
          <Text className='v'>{info.currentSize} KB</Text>
        </View>
        <View className='kv'>
          <Text className='k'>上限</Text>
          <Text className='v'>{info.limitSize} KB</Text>
        </View>
        <View className='kv'>
          <Text className='k'>键数量</Text>
          <Text className='v'>{(info.keys || []).length}</Text>
        </View>
        <View className='keys'>
          {(info.keys || []).map((k: string) => (
            <Text className='key' key={k}>{k}</Text>
          ))}
        </View>
      </View>

      <Button block onClick={clearIcons}>清理图标缓存</Button>
      <View style={{ height: '12px' }} />
      <Button block onClick={clearAll}>清除全部数据</Button>
    </View>
  )
}
