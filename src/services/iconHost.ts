import Taro from '@tarojs/taro'
import { EASYIMAGE_BASE, EASYIMAGE_TOKEN, EASYIMAGE_CATEGORY } from '@/config/imageHost'

export interface HostImage {
  url: string
  name: string
  size?: number
  mtime?: number
}

export interface IconMap {
  byName: Record<string, string>
  byKey: Record<string, string>
  count?: number
}

export const ICON_CACHE_KEY = 'aemobile:iconlist'
export const ICON_MAP_URL = `${EASYIMAGE_BASE}/i/${EASYIMAGE_CATEGORY}/icon-map.json`

/** 图标映射放在内存里（数量可达数万条，不适合塞进 Storage）。 */
let memoryMap: IconMap | null = null

export function getCachedIconMap(): IconMap {
  return memoryMap || { byName: {}, byKey: {} }
}

/** 从图床静态目录拉取 icon-map.json（导出工具生成）。 */
export async function fetchIconMap(): Promise<IconMap> {
  const res = await Taro.request({ url: ICON_MAP_URL, method: 'GET', dataType: 'json' })
  let data: any = res.data
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      throw new Error('映射不是合法 JSON')
    }
  }
  if (!data || !data.byName) {
    throw new Error('映射格式错误')
  }
  memoryMap = data as IconMap
  return memoryMap
}

export function iconForName(name: string, map: IconMap): string | undefined {
  return map.byName[name]
}

/** 从图床拉取图片列表（/api/list.php），用于图标库页预览。 */
export async function fetchIconList(category = EASYIMAGE_CATEGORY): Promise<HostImage[]> {
  const res = await Taro.request({
    url: `${EASYIMAGE_BASE}/api/list.php`,
    method: 'GET',
    data: { token: EASYIMAGE_TOKEN, category, limit: 500 }
  })
  const json: any = res.data
  if (!json || json.result !== 'success') {
    throw new Error(json?.message || '拉取失败')
  }
  const list = (json.data || []) as HostImage[]
  try {
    Taro.setStorageSync(ICON_CACHE_KEY, list)
    Taro.setStorageSync('aemobile:iconCategory', category)
  } catch {
    /* ignore */
  }
  return list
}

export function getCachedIcons(): HostImage[] {
  try {
    return (Taro.getStorageSync(ICON_CACHE_KEY) || []) as HostImage[]
  } catch {
    return []
  }
}

export function getIconCategory(): string {
  try {
    return Taro.getStorageSync('aemobile:iconCategory') || EASYIMAGE_CATEGORY
  } catch {
    return EASYIMAGE_CATEGORY
  }
}

function norm(name: string): string {
  return name.replace(/\.[a-z0-9]+$/i, '').toLowerCase()
}

/** 按物品名匹配图床里的图片（列表方式，兼容旧逻辑）。 */
export function iconFor(itemName: string, list: HostImage[]): string | undefined {
  const target = norm(itemName)
  const exact = list.find((x) => norm(x.name) === target)
  if (exact) return exact.url
  const loose = list.find((x) => norm(x.name).includes(target) || target.includes(norm(x.name)))
  return loose?.url
}
