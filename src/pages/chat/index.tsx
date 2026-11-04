import { useMemo, useRef, useState } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'

import { SERVER_STORAGE_KEY } from '@/config/server'
import { ChatLike, buildRows } from '@/lib/chatgroup'
import { parseAtt, attLabel, attDetail } from '@/lib/chatatt'
import { MC_COLORS } from '@/lib/mcformat'
import { McText } from '@/components/McText'
import { buildMockChat, MOCK_REPLIES } from '@/mock/chat'
import { useThemeClass } from '@/hooks/useThemeClass'
import './index.scss'

function hhmm(ts: number): string {
  const d = new Date(ts)
  const p = (n: number) => (n < 10 ? `0${n}` : String(n))
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}

function avatarColor(name: string): string {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360
  return `hsl(${h}, 60%, 55%)`
}

export default function Chat() {
  const theme = useThemeClass()
  const server = useMemo(() => {
    try {
      const c = Taro.getStorageSync(SERVER_STORAGE_KEY)
      return c || { host: 'demo.local', port: '44444', demo: true, nickname: 'Steve' }
    } catch {
      return { host: 'demo.local', port: '44444', demo: true, nickname: 'Steve' }
    }
  }, [])

  const myName: string = server.nickname || 'Steve'
  const [msgs, setMsgs] = useState<ChatLike[]>(() => buildMockChat())
  const nextSeq = useRef(100)
  const [text, setText] = useState('')

  const rows = useMemo(() => buildRows(msgs, { mine: myName }), [msgs, myName])
  const lastKey = rows.length ? rows[rows.length - 1].key : ''

  const append = (m: ChatLike) => setMsgs((prev) => [...prev, m])

  const send = () => {
    const t = text.trim()
    if (!t) return
    append({ boot: 1, seq: nextSeq.current++, ts: Date.now(), kind: 1, name: myName, text: t })
    setText('')
    // 模拟对方回复（真实实现应改为订阅 chat 流的 PUSH）
    setTimeout(() => {
      const r = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
      append({ boot: 1, seq: nextSeq.current++, ts: Date.now(), kind: 0, name: r.name, text: r.text, team: r.team, teamColor: r.teamColor, world: r.world })
    }, 700)
  }

  const simulate = () => {
    const r = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
    append({ boot: 1, seq: nextSeq.current++, ts: Date.now(), kind: 0, name: r.name, text: r.text, team: r.team, teamColor: r.teamColor, world: r.world })
  }

  const openAtt = (a: any) => {
    Taro.showModal({ title: attLabel(a), content: attDetail(a) || '（无详情）', showCancel: false })
  }

  return (
    <View className={`chat-page ${theme}`}>
      <View className='chat-header'>
        <View>
          <View className='chat-title'>聊天</View>
          <View className='chat-sub'>
            {server.demo ? '演示模式' : `${server.host}:${server.port}`} · 我：{myName}
          </View>
        </View>
        <Button size='small' onClick={simulate}>模拟收到</Button>
      </View>

      <ScrollView scrollY className='chat-list' scrollIntoView={`row-${lastKey}`}>
        {rows.map((row) => {
          if (row.type === 'day') {
            return (
              <View id={`row-${row.key}`} className='day-sep' key={row.key}>
                <Text>{row.label}</Text>
              </View>
            )
          }

          if (row.type === 'system') {
            const label =
              row.msg.text ||
              (row.variant === 'join'
                ? `${row.msg.name} 加入了游戏`
                : row.variant === 'leave'
                  ? `${row.msg.name} 离开了游戏`
                  : '系统消息')
            return (
              <View id={`row-${row.key}`} className='system-row' key={row.key}>
                <McText text={label} />
              </View>
            )
          }

          const nameColor =
            row.teamColor && MC_COLORS[row.teamColor] ? MC_COLORS[row.teamColor] : undefined

          return (
            <View id={`row-${row.key}`} key={row.key} className={`group ${row.mine ? 'group--mine' : ''}`}>
              {!row.mine && (
                <View className='avatar' style={{ background: avatarColor(row.name) }}>
                  <Text className='avatar-text'>{row.name.slice(0, 1).toUpperCase()}</Text>
                </View>
              )}
              <View className='group-body'>
                <View className='group-meta'>
                  <Text className='group-name' style={{ color: nameColor }}>{row.name}</Text>
                  {row.team ? <Text className='tag tag--team' style={{ color: nameColor }}>[{row.team}]</Text> : null}
                  {row.world ? <Text className='tag'>{row.world}</Text> : null}
                  {row.srv ? <Text className='tag'>{row.srv}</Text> : null}
                  <Text className='group-time'>{hhmm(row.msgs[0].ts)}</Text>
                </View>

                {row.msgs.map((mm) => {
                  const atts = parseAtt(mm.att)
                  return (
                    <View key={`${mm.boot}:${mm.seq}`} className={`bubble ${row.mine ? 'bubble--mine' : ''}`}>
                      <McText text={mm.text} baseColor={row.mine ? '#ffffff' : '#1f2329'} />
                      {atts.map((a, i) => (
                        <View className='att' key={i} onClick={() => openAtt(a)}>
                          <Text className='att-label'>📦 {attLabel(a)}</Text>
                        </View>
                      ))}
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
        <View style={{ height: '12px' }} />
      </ScrollView>

      <View className='chat-input-bar'>
        <Input
          className='chat-input'
          value={text}
          onInput={(e: any) => setText(e.detail.value)}
          onConfirm={send}
          confirmType='send'
          placeholder={`以 ${myName} 的身份发言…`}
        />
        <Button type='primary' size='small' onClick={send}>发送</Button>
      </View>
    </View>
  )
}
