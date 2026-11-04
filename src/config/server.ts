export const SERVER_STORAGE_KEY = 'aemobile:server'

export interface ServerConfig {
  host: string
  port: string
  password?: string
  guest?: boolean
  /** 聊天昵称 */
  nickname?: string
  /** 演示/模拟模式（无真实连接） */
  demo?: boolean
}
