import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'

export const THEME_KEY = 'aemobile:theme'

export type ThemeMode = 'light' | 'dark'

export function getTheme(): ThemeMode {
  try {
    return Taro.getStorageSync(THEME_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function setTheme(mode: ThemeMode): void {
  try {
    Taro.setStorageSync(THEME_KEY, mode)
  } catch {
    /* ignore */
  }
}

/** 返回页面根节点要加的 className（深色时是 theme-dark）。切回页面时会刷新。 */
export function useThemeClass(): string {
  const [mode, setMode] = useState<ThemeMode>(() => getTheme())
  useDidShow(() => setMode(getTheme()))
  return mode === 'dark' ? 'theme-dark' : ''
}
