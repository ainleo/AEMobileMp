import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import { MOCK_SERVER, MOCK_TPS, MOCK_NETWORKS } from '@/mock/appData'
import { useThemeClass } from '@/hooks/useThemeClass'
import './index.scss'

export default function Monitor() {
  const theme = useThemeClass()
  const max = 21

  return (
    <View className={`page ${theme}`}>
      <View className='card'>
        <View className='row-between'>
          <View>
            <View className='title'>{MOCK_SERVER.name}</View>
            <View className='subtitle'>
              {MOCK_SERVER.host}:{MOCK_SERVER.port} · {MOCK_SERVER.online ? '在线' : '离线'}
            </View>
          </View>
          <Button size='small' onClick={() => Taro.showToast({ title: '刷新（模拟）', icon: 'none' })}>
            刷新
          </Button>
        </View>

        <View className='stats'>
          <View className='stat'>
            <Text className='stat-num'>{MOCK_SERVER.tps}</Text>
            <Text className='stat-label'>TPS</Text>
          </View>
          <View className='stat'>
            <Text className='stat-num'>{MOCK_SERVER.players}</Text>
            <Text className='stat-label'>在线玩家</Text>
          </View>
          <View className='stat'>
            <Text className='stat-num'>{MOCK_NETWORKS.length}</Text>
            <Text className='stat-label'>AE 网络</Text>
          </View>
        </View>
      </View>

      <View className='card'>
        <View className='section-title'>TPS 走势</View>
        <View className='chart'>
          {MOCK_TPS.map((v, i) => (
            <View className='bar-col' key={i}>
              <View className='bar-fill' style={{ height: `${Math.max(4, (v / max) * 100)}%` }} />
              <Text className='bar-label'>{v}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='card'>
        <View className='section-title'>AE 网络</View>
        {MOCK_NETWORKS.map((n) => (
          <View className='net' key={n.id}>
            <Text className='net-name'>{n.name}</Text>
            <Text className='net-meta'>
              {n.items} 项 · {n.cpus} CPU
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
