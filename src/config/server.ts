export const SERVER_STORAGE_KEY = 'aemobile:server'

export interface ServerConfig {
  host: string
  port: string
  password?: string
  guest?: boolean
}
