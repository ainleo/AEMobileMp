import { useState } from 'react'
import { View, Text, Input, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import { SERVER_STORAGE_KEY } from '@/config/server'
import { LOCAL_CONFIG } from '@/config/local'
import { useThemeClass } from '@/hooks/useThemeClass'

import './index.scss'

export default function Login() {
  const theme = useThemeClass()
  const [host, setHost] = useState(LOCAL_CONFIG.SERVER_HOST)
  const [port, setPort] = useState(LOCAL_CONFIG.SERVER_PORT)
  const [password, setPassword] = useState('')
  const [guest, setGuest] = useState(LOCAL_CONFIG.SERVER_GUEST)
  const [nickname, setNickname] = useState('Steve')
  const [loading, setLoading] = useState(false)

  const save = (demo: boolean) => {
    Taro.setStorageSync(SERVER_STORAGE_KEY, {
      host: demo ? 'demo.local' : host.trim(),
      port: port.trim() || '44444',
      password,
      guest,
      nickname: nickname.trim() || 'Steve',
      demo
    })
    Taro.switchTab({ url: '/pages/items/index' })
  }

  const connect = () => {
    if (!host.trim()) {
      Taro.showToast({ title: '请填写服务器地址', icon: 'none' })
      return
    }
    if (!guest && !password.trim()) {
      Taro.showToast({ title: '请填写访问密码，或勾选仅聊天', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      // TODO(network): 真实连接走 TCP→WSS 网关（HELLO→AUTH→SUB chat）
      Taro.showToast({ title: '已保存，进入聊天', icon: 'success' })
      setTimeout(() => save(false), 300)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className={`page login ${theme}`}>
      <View className='card'>
        <View className='title'>AEMobile</View>
        <View className='subtitle'>GTNH AE 网络监控 · 小程序版（聊天迁移 demo）</View>

        <View className='form'>
          <View className='field'>
            <Text className='label'>服务器地址</Text>
            <Input className='input' value={host} onInput={(e: any) => setHost(e.detail.value)} placeholder='IP 或域名（不带端口）' />
          </View>

          <View className='field'>
            <Text className='label'>端口</Text>
            <Input className='input' type='number' value={port} onInput={(e: any) => setPort(e.detail.value)} placeholder='44444' />
          </View>

          <View className='field'>
            <Text className='label'>访问密码</Text>
            <Input className='input' password value={password} onInput={(e: any) => setPassword(e.detail.value)} placeholder='AE 监控器输出的密码' />
          </View>

          <View className='field'>
            <Text className='label'>聊天昵称</Text>
            <Input className='input' value={nickname} onInput={(e: any) => setNickname(e.detail.value)} placeholder='Steve' maxlength={16} />
          </View>

          <View className='field field--row'>
            <Text className='label'>仅使用聊天（游客）</Text>
            <Switch checked={guest} onChange={(e: any) => setGuest(e.detail.value)} color='#3457ff' />
          </View>
        </View>

        <Button type='primary' block loading={loading} onClick={connect}>连接 / 登录</Button>

        <View className='demo-btn'>
          <Button block onClick={() => save(true)}>演示进入（本地模拟，无需服务器）</Button>
        </View>

        <View className='hint'>
          测试阶段：不建立真实连接。点「演示进入」可直接体验聊天（模拟数据，含频道消息/颜色码/物品附件）。
        </View>
      </View>
    </View>
  )
}
