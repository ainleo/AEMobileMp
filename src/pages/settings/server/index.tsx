import { useState } from 'react'
import { View, Text, Input, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import { SERVER_STORAGE_KEY } from '@/config/server'
import { useThemeClass } from '@/hooks/useThemeClass'

export default function ServerSettings() {
  const theme = useThemeClass()
  let init: any = {}
  try {
    init = Taro.getStorageSync(SERVER_STORAGE_KEY) || {}
  } catch {
    init = {}
  }

  const [host, setHost] = useState(init.host || '')
  const [port, setPort] = useState(init.port || '44444')
  const [password, setPassword] = useState(init.password || '')
  const [nickname, setNickname] = useState(init.nickname || 'Steve')
  const [guest, setGuest] = useState(!!init.guest)

  const save = () => {
    Taro.setStorageSync(SERVER_STORAGE_KEY, {
      host: host.trim(),
      port: port.trim() || '44444',
      password,
      guest,
      nickname: nickname.trim() || 'Steve',
      demo: false
    })
    Taro.showToast({ title: '已保存', icon: 'success' })
  }

  return (
    <View className={`page ${theme}`}>
      <View className='card'>
        <View className='title'>服务器与账号</View>
        <View className='subtitle'>保存后返回其它页面生效</View>

        <View className='form'>
          <View className='field'>
            <Text className='label'>服务器地址</Text>
            <Input className='input' value={host} onInput={(e: any) => setHost(e.detail.value)} placeholder='IP 或域名' />
          </View>
          <View className='field'>
            <Text className='label'>端口</Text>
            <Input className='input' type='number' value={port} onInput={(e: any) => setPort(e.detail.value)} placeholder='44444' />
          </View>
          <View className='field'>
            <Text className='label'>访问密码</Text>
            <Input className='input' password value={password} onInput={(e: any) => setPassword(e.detail.value)} placeholder='AE 监控器密码' />
          </View>
          <View className='field'>
            <Text className='label'>聊天昵称</Text>
            <Input className='input' value={nickname} onInput={(e: any) => setNickname(e.detail.value)} maxlength={16} placeholder='Steve' />
          </View>
          <View className='field field--row'>
            <Text className='label'>仅使用聊天（游客）</Text>
            <Switch checked={guest} onChange={(e: any) => setGuest(e.detail.value)} color='#3457ff' />
          </View>
        </View>

        <Button type='primary' block onClick={save}>保存</Button>
        <View style={{ height: '12px' }} />
        <Button block onClick={() => Taro.showToast({ title: '测试连接（模拟）', icon: 'none' })}>
          测试连接（模拟）
        </Button>
      </View>
    </View>
  )
}
