import { useMemo, useState } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import { MOCK_ITEMS, ItemType, ITEM_TYPE_LABEL } from '@/mock/appData'
import './index.scss'

const FILTERS: { key: ItemType | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'item', label: '物品' },
  { key: 'fluid', label: '流体' },
  { key: 'aspect', label: '源质' }
]

function iconColor(name: string): string {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360
  return `hsl(${h}, 55%, 55%)`
}

export default function Items() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<ItemType | 'all'>('all')
  const [craftableOnly, setCraftableOnly] = useState(false)

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return MOCK_ITEMS.filter((it) => {
      if (filter !== 'all' && it.type !== filter) return false
      if (craftableOnly && !it.craftable) return false
      if (kw && !it.name.toLowerCase().includes(kw)) return false
      return true
    })
  }, [q, filter, craftableOnly])

  const open = (it: typeof MOCK_ITEMS[number]) => {
    Taro.showModal({
      title: it.name,
      content: `类型：${ITEM_TYPE_LABEL[it.type]}\n数量：${it.count}\n来源：${it.mod}\n可合成：${it.craftable ? '是' : '否'}`,
      showCancel: false
    })
  }

  return (
    <View className='page items-page'>
      <View className='toolbar'>
        <Input className='search' value={q} onInput={(e: any) => setQ(e.detail.value)} placeholder='搜索物品 / 流体 / 源质' />
        <View className='filters'>
          {FILTERS.map((f) => (
            <Text
              key={f.key}
              className={`chip ${filter === f.key ? 'chip--on' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Text>
          ))}
          <Text
            className={`chip ${craftableOnly ? 'chip--on' : ''}`}
            onClick={() => setCraftableOnly((v) => !v)}
          >
            仅可合成
          </Text>
        </View>
      </View>

      <View className='summary'>
        <Text>共 {list.length} 项</Text>
        <Button size='small' onClick={() => Taro.showToast({ title: '刷新（模拟）', icon: 'none' })}>刷新</Button>
      </View>

      <ScrollView scrollY className='grid-wrap'>
        <View className='grid'>
          {list.map((it) => (
            <View className='item-card' key={it.id} onClick={() => open(it)}>
              <View className='item-icon' style={{ background: iconColor(it.name) }}>
                <Text className='item-icon-text'>{it.name.slice(0, 1)}</Text>
              </View>
              <View className='item-name'>{it.name}</View>
              <View className='item-meta'>
                <Text className='item-count'>x{it.count}</Text>
                {it.craftable ? <Text className='badge'>可合成</Text> : null}
              </View>
              <View className='item-mod'>{it.mod}</View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
