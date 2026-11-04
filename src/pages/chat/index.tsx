import { useMemo, useRef, useState } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'

import { SERVER_STORAGE_KEY } from '@/config/server'
import './index.scss'

interface Msg {
  id: number
  role: 'me' | 'other' | 'system'
  text: string
}

export default function Chat() {
  const server = useMemo(() => {
    try {
      return Taro.getStorageSync(SERVER_STORAGE_KEY) || null
    } catch {
      return null
    }
  }, [])

  const nextId = useRef(3)
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, role: 'system', text: '已进入聊天（本地模拟，网络层待接入）' },
    { id: 2, role: 'other', text: '欢迎使用 AEMobile 小程序版 👋' }
  ])
  const [text, setText] = useState('')

  const send = () => {
    const t = text.trim()
    if (!t) return
    const mine: Msg = { id: nextId.current++, role: 'me', text: t }
    setMsgs((m) => [...m, mine])
    setText('')
    // 模拟对方回复；真实实现应改为订阅 SUB "chat" 的 PUSH
    setTimeout(() => {
      setMsgs((m) => [...m, { id: nextId.current++, role: 'other', text: `[模拟回复] 收到：${t}` }])
    }, 500)
  }

  const lastId = msgs.length ? msgs[msgs.length - 1].id : 0

  return (
    <View className='chat-page'>
      <View className='chat-header'>
        <View className='chat-title'>聊天</View>
        <View className='chat-sub'>
          {server ? `${server.host}:${server.port}${server.guest ? '（游客）' : ''}` : '未配置服务器'}
        </View>
      </View>

      <ScrollView scrollY className='chat-list' scrollIntoView={`msg-${lastId}`}>
        {msgs.map((m) => (
          <View id={`msg-${m.id}`} key={m.id} className={`msg msg--${m.role}`}>
            <Text className='msg-text'>{m.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View className='chat-input-bar'>
        <Input
          className='chat-input'
          value={text}
          onInput={(e: any) => setText(e.detail.value)}
          onConfirm={send}
          confirmType='send'
          placeholder='说点什么…'
        />
        <Button type='primary' size='small' onClick={send}>
          发送
        </Button>
      </View>
    </View>
  )
}
