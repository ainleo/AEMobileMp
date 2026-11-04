import type { ChatLike } from '@/lib/chatgroup'

/** 本地模拟数据：覆盖服务器公告 / 玩家聊天 / 进出 / 成就 / 附件 / 队伍 / 世界 等场景。 */
export function buildMockChat(now = Date.now()): ChatLike[] {
  const m = (min: number) => now - min * 60 * 1000
  return [
    { boot: 1, seq: 1, ts: m(90), kind: 4, name: '服务器', text: '§e欢迎来到 §b天空树 §e· §7本服聊天为测试模拟数据' },
    { boot: 1, seq: 2, ts: m(85), kind: 2, name: 'Alex' },
    {
      boot: 1, seq: 3, ts: m(80), kind: 0, name: 'Alex',
      text: '§a有人去挖矿吗？', team: '红队', teamColor: 'c', world: '主世界'
    },
    {
      boot: 1, seq: 4, ts: m(79), kind: 0, name: 'Alex',
      text: '§7我还缺一点 §b钢锭', team: '红队', teamColor: 'c', world: '主世界'
    },
    {
      boot: 1, seq: 5, ts: m(75), kind: 0, name: 'Steve',
      text: '我来，等我 2 分钟', world: '主世界'
    },
    { boot: 1, seq: 6, ts: m(60), kind: 6, name: 'Alex', text: 'Alex 完成了成就 §b「钻石！钻石！」' },
    {
      boot: 1, seq: 7, ts: m(58), kind: 0, name: 'Alex',
      text: '看这个：', team: '红队', teamColor: 'c', world: '主世界',
      att: JSON.stringify([{ t: 'item', n: '钢锭', h: 'GT 钢锭\n数量 x64' }])
    },
    {
      boot: 1, seq: 8, ts: m(40), kind: 0, name: 'Steve',
      text: '@Alex 好，马上到', world: '主世界'
    },
    { boot: 1, seq: 9, ts: m(20), kind: 3, name: 'Notch' }
  ]
}

/** 模拟“对方回复”的素材池 */
export const MOCK_REPLIES: { name: string; team?: string; teamColor?: string; world?: string; text: string }[] = [
  { name: 'Alex', team: '红队', teamColor: 'c', world: '主世界', text: '§a收到～' },
  { name: 'Steve', world: '主世界', text: '好的，我去看看' },
  { name: 'Notch', world: '下界', text: '§e等我一下，在挖远古残骸' },
  { name: 'Herobrine', world: '主世界', text: '§c这里有点东西' }
]
