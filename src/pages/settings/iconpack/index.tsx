import { useState } from 'react'
import { View, Text, Input, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import { EASYIMAGE_BASE, EASYIMAGE_TOKEN } from '@/config/imageHost'
import { fetchIconList, getCachedIcons, getIconCategory, ICON_CACHE_KEY, HostImage } from '@/services/iconHost'
import { useThemeClass } from '@/hooks/useThemeClass'

export default function IconPack() {
  const theme = useThemeClass()
  const [category, setCategory] = useState(getIconCategory())
  const [list, setList] = useState<HostImage[]>(() => getCachedIcons())
  const [loading, setLoading] = useState(false)

  const pull = async () => {
    setLoading(true)
    try {
      const l = await fetchIconList(category.trim() || 'aemobile')
      setList(l)
      Taro.showToast({ title: `已拉取 ${l.length} 张`, icon: 'none' })
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '拉取失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    Taro.removeStorageSync(ICON_CACHE_KEY)
    setList([])
    Taro.showToast({ title: '已清空图标缓存', icon: 'none' })
  }

  return (
    <View className={`page ${theme}`}>
      <View className='card'>
        <View className='title'>图标库</View>
        <View className='subtitle'>物品图标来自图床（EasyImage）</View>

        <View className='kv'>
          <Text className='k'>图床地址</Text>
          <Text className='v'>{EASYIMAGE_BASE.replace(/^https?:\/\//, '')}</Text>
        </View>
        <View className='kv'>
          <Text className='k'>Token</Text>
          <Text className='v'>{EASYIMAGE_TOKEN.slice(0, 8)}••••••</Text>
        </View>
        <View className='kv'>
          <Text className='k'>分类</Text>
          <Input className='v' value={category} onInput={(e: any) => setCategory(e.detail.value)} placeholder='aemobile' />
        </View>

        <View style={{ height: '16px' }} />
        <Button type='primary' block loading={loading} onClick={pull}>拉取图标列表</Button>
        <View style={{ height: '12px' }} />
        <Button block onClick={clear}>清空图标缓存</Button>
      </View>

      <View className='card'>
        <View className='section-title'>本地已缓存 {list.length} 张</View>
        {list.length > 0 ? (
          <View className='grid-icons'>
            {list.slice(0, 60).map((x) => (
              <View className='cell' key={x.url}>
                <Image className='cell-img' src={x.url} mode='aspectFit' />
              </View>
            ))}
          </View>
        ) : (
          <Text className='empty'>暂无图标，点上面「拉取图标列表」从图床同步。</Text>
        )}
      </View>
    </View>
  )
}
