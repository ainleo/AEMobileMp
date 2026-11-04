import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

// Taroify Button（按需样式）
import '@taroify/core/button/index.scss'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('AEMobile mp launched.')
  })
  return children
}

export default App
