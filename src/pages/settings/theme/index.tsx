import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getTheme, setTheme, ThemeMode } from '@/hooks/useThemeClass'

export default function ThemePage() {
  const [mode, setMode] = useState<ThemeMode>(getTheme())

  const pick = (m: ThemeMode) => {
    setMode(m)
    setTheme(m)
    Taro.showToast({ title: m === 'dark' ? '已切换深色' : '已切换浅色', icon: 'none' })
  }

  return (
    <View className={`page ${mode === 'dark' ? 'theme-dark' : ''}`}>
      <View className='card'>
        <View className='title'>主题</View>
        <View className='subtitle'>选择浅色或深色，返回其它页面自动生效</View>
        <View className='opts'>
          <View className={`opt ${mode === 'light' ? 'opt--on' : ''}`} onClick={() => pick('light')}>
            <Text>浅色</Text>
          </View>
          <View className={`opt ${mode === 'dark' ? 'opt--on' : ''}`} onClick={() => pick('dark')}>
            <Text>深色</Text>
          </View>
        </View>
        <View className='hint'>主题基于 CSS 变量：切到深色后，物品/聊天/设置等页面都会跟随（重新进入页面即刷新）。</View>
      </View>
    </View>
  )
}
