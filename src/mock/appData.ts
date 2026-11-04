export type ItemType = 'item' | 'fluid' | 'aspect'

export interface MockItem {
  id: string
  name: string
  count: number
  type: ItemType
  mod: string
  craftable: boolean
}

export interface MockCpu {
  id: string
  name: string
  busy: boolean
  progress: number // 0-100
  remaining: string
  tasks: { item: string; count: number }[]
}

export interface MockNetwork {
  id: string
  name: string
  items: number
  cpus: number
}

export interface MockServer {
  name: string
  host: string
  port: string
  tps: number
  players: number
  online: boolean
}

export const MOCK_ITEMS: MockItem[] = [
  { id: 'i1', name: '钢锭', count: 4096, type: 'item', mod: 'GregTech', craftable: true },
  { id: 'i2', name: '铁锭', count: 2048, type: 'item', mod: 'Minecraft', craftable: true },
  { id: 'i3', name: '铜锭', count: 1536, type: 'item', mod: 'GregTech', craftable: true },
  { id: 'i4', name: '锡锭', count: 1024, type: 'item', mod: 'GregTech', craftable: true },
  { id: 'i5', name: '红石', count: 8192, type: 'item', mod: 'Minecraft', craftable: false },
  { id: 'i6', name: '石英', count: 2048, type: 'item', mod: 'AppliedEnergistics', craftable: false },
  { id: 'i7', name: '钻石', count: 512, type: 'item', mod: 'Minecraft', craftable: false },
  { id: 'i8', name: '处理器', count: 256, type: 'item', mod: 'AppliedEnergistics', craftable: true },
  { id: 'i9', name: '太阳能板', count: 64, type: 'item', mod: 'GregTech', craftable: true },
  { id: 'i10', name: '量子处理器', count: 32, type: 'item', mod: 'GregTech', craftable: true },
  { id: 'i11', name: '神秘齿轮', count: 128, type: 'item', mod: 'Thaumcraft', craftable: true },
  { id: 'i12', name: '末影珍珠', count: 96, type: 'item', mod: 'Minecraft', craftable: false },
  { id: 'f1', name: '原油', count: 64000, type: 'fluid', mod: 'GregTech', craftable: false },
  { id: 'f2', name: '岩浆', count: 32000, type: 'fluid', mod: 'Minecraft', craftable: false },
  { id: 'f3', name: '水', count: 1000000, type: 'fluid', mod: 'Minecraft', craftable: false },
  { id: 'f4', name: '重油', count: 128000, type: 'fluid', mod: 'GregTech', craftable: true },
  { id: 'a1', name: '风之源质', count: 512, type: 'aspect', mod: 'Thaumcraft', craftable: false },
  { id: 'a2', name: '火之源质', count: 384, type: 'aspect', mod: 'Thaumcraft', craftable: false },
  { id: 'a3', name: '秩序源质', count: 2048, type: 'aspect', mod: 'Thaumcraft', craftable: false },
  { id: 'a4', name: '混沌源质', count: 256, type: 'aspect', mod: 'Thaumcraft', craftable: false }
]

export const MOCK_CPUS: MockCpu[] = [
  {
    id: 'c1',
    name: 'CPU #1 · 合成',
    busy: true,
    progress: 62,
    remaining: '约 1 分 20 秒',
    tasks: [
      { item: '钢锭', count: 512 },
      { item: '铁锭', count: 256 }
    ]
  },
  {
    id: 'c2',
    name: 'CPU #2 · 合成',
    busy: true,
    progress: 23,
    remaining: '约 4 分 05 秒',
    tasks: [{ item: '石英', count: 1024 }]
  },
  {
    id: 'c3',
    name: 'CPU #3 · 空闲',
    busy: false,
    progress: 0,
    remaining: '空闲',
    tasks: []
  }
]

export const MOCK_NETWORKS: MockNetwork[] = [
  { id: 'n1', name: '主基地 · ME 网络', items: 13316, cpus: 3 },
  { id: 'n2', name: '矿区 · 子网络', items: 2048, cpus: 1 }
]

export const MOCK_SERVER: MockServer = {
  name: '天空树',
  host: 'demo.local',
  port: '44444',
  tps: 19.8,
  players: 12,
  online: true
}

export const MOCK_TPS = [19.6, 19.8, 19.9, 19.7, 20.0, 19.8, 19.5, 19.9, 19.8, 19.9] as number[]

export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  item: '物品',
  fluid: '流体',
  aspect: '源质'
}
