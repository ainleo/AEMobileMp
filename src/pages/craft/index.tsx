import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import { MOCK_CPUS } from '@/mock/appData'
import { useThemeClass } from '@/hooks/useThemeClass'
import './index.scss'

export default function Craft() {
  const theme = useThemeClass()
  const busy = MOCK_CPUS.filter((c) => c.busy).length

  return (
    <View className={`page ${theme}`}>
      <View className='card'>
        <View className='title'>合成 CPU</View>
        <View className='subtitle'>模拟数据 · {busy} 台运行中 · {MOCK_CPUS.length} 台总计</View>
        <Button
          size='small'
          type='primary'
          onClick={() => Taro.showToast({ title: '已生成合成计划（模拟）', icon: 'none' })}
        >
          生成合成计划
        </Button>
      </View>

      {MOCK_CPUS.map((c) => (
        <View className='card cpu' key={c.id}>
          <View className='cpu-head'>
            <Text className='cpu-name'>{c.name}</Text>
            <Text className={`cpu-status ${c.busy ? 'cpu-status--busy' : ''}`}>
              {c.busy ? '运行中' : '空闲'}
            </Text>
          </View>

          <View className='bar'>
            <View className='bar-inner' style={{ width: `${c.progress}%` }} />
          </View>
          <View className='cpu-meta'>
            <Text>{c.progress}%</Text>
            <Text>{c.remaining}</Text>
          </View>

          {c.tasks.length > 0 ? (
            <View className='tasks'>
              {c.tasks.map((t, i) => (
                <Text className='task' key={i}>
                  {t.item} ×{t.count}
                </Text>
              ))}
            </View>
          ) : (
            <Text className='cpu-empty'>暂无任务</Text>
          )}
        </View>
      ))}
    </View>
  )
}
