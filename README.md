# AEMobileMp · 微信小程序版（dev0.0.1）

将原 **React Native (Expo) App** 迁移为 **微信小程序** 的工作分支。

## 分支约定
- `main`：原始 RN App（历史）
- `back`：迁移前的备份（等同当时 main）
- `dev0.0.1`：小程序重构（当前分支）

## 技术栈
- Taro 4.3.2 + React 18 + TypeScript + Vite
- UI：Taroify（Vant 的 Taro React 版，按需引入 Button）
- 设计基准：designWidth 375

## 一期范围
- 登录页：服务器地址 / 端口 / 密码 / 游客(仅聊天)
- 聊天页：消息列表 + 发送（**本地模拟**，网络层待接入）
- 网络层：暂不接真实连接（后续 TCP→WSS 网关）
- 物品/图标：后续统一走图床（见 `src/config/imageHost.ts`）

## 开发
```bash
pnpm install
pnpm dev:weapp     # 监听编译到 dist
# 用微信开发者工具导入项目根目录（miniprogramRoot = ./dist）
```
生产：
```bash
pnpm build:weapp
```

## 目录
```
src/
  app.config.ts       页面 & 全局配置
  app.tsx             入口
  config/imageHost.ts 图床（物品图标）配置
  pages/login/        登录
  pages/chat/         聊天（一期 mock）
```

## 迁移计划（分批）
1. ✅ 登录 + 聊天（UI / 交互 mock）
2. ⏳ 网关（TCP↔WSS）接入 + 协议移植（HELLO/AUTH/SUB chat）
3. ⏳ 物品/合成/监控
4. ⏳ 图标库/缓存/主题等

> 原 RN 代码参考 `back` 分支；协议客户端逻辑见原仓库 `src/net/protocol.ts`、`src/net/conn.ts`。
