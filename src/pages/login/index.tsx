import { useState } from 'react'
import { View, Text, Input, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import { SERVER_STORAGE_KEY } from '@/config/server'

import './index.scss'

export default function Login() {
  const [host, setHost] = useState('')
  const [port, setPort] = useState('44444')
  const [password, setPassword] = useState('')
  const [guest, setGuest] = useState(false)
  const [loading, setLoading] = useState(false)

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
      // TODO(network): 真实连接走 TCP→WSS 网关，按 protocol/conn 的 HELLO→AUTH→SUB 流程。
      // 一期先保存服务器配置，进入聊天（本地模拟）。
      Taro.setStorageSync(SERVER_STORAGE_KEY, {
        host: host.trim(),
        port: (port.trim() || '44444'),
        password,
        guest
      })
      Taro.showToast({ title: '已保存，进入聊天', icon: 'success' })
      setTimeout(() => Taro.reLaunch({ url: '/pages/chat/index' }), 400)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='page login'>
      <View className='card'>
        <View className='title'>AEMobile</View>
        <View className='subtitle'>GTNH AE 网络监控 · 小程序版（登录 / 聊天 一期）</View>

        <View className='form'>
          <View className='field'>
            <Text className='label'>服务器地址</Text>
            <Input
              className='input'
              value={host}
              onInput={(e: any) => setHost(e.detail.value)}
              placeholder='IP 或域名（不带端口）'
            />
          </View>

          <View className='field'>
            <Text className='label'>端口</Text>
            <Input
              className='input'
              type='number'
              value={port}
              onInput={(e: any) => setPort(e.detail.value)}
              placeholder='44444'
            />
          </View>

          <View className='field'>
            <Text className='label'>访问密码</Text>
            <Input
              className='input'
              password
              value={password}
              onInput={(e: any) => setPassword(e.detail.value)}
              placeholder='AE 监控器输出的密码'
            />
          </View>

          <View className='field field--row'>
            <Text className='label'>仅使用聊天（游客）</Text>
            <Switch checked={guest} onChange={(e: any) => setGuest(e.detail.value)} color='#3457ff' />
          </View>
        </View>

        <Button type='primary' block loading={loading} onClick={connect}>
          连接 / 登录
        </Button>

        <View className='hint'>
          测试阶段：暂不建立真实连接，登录后进入聊天示例页（消息为本地模拟）。
        </View>
      </View>
    </View>
  )
}
