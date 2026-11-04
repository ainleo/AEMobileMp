import Taro from '@tarojs/taro'
import { EASYIMAGE_BASE, EASYIMAGE_TOKEN, EASYIMAGE_CATEGORY } from '@/config/imageHost'

export interface HostImage {
  url: string
  name: string
  size?: number
  mtime?: number
}

export const ICON_CACHE_KEY = 'aemobile:iconlist'

/** 从图床拉取图片列表（EasyImage /api/list.php）。 */
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

/** 按物品名匹配图床里的图片：先精确、再模糊；匹配不到返回 undefined。 */
export function iconFor(itemName: string, list: HostImage[]): string | undefined {
  const target = norm(itemName)
  const exact = list.find((x) => norm(x.name) === target)
  if (exact) return exact.url
  const loose = list.find((x) => norm(x.name).includes(target) || target.includes(norm(x.name)))
  return loose?.url
}
