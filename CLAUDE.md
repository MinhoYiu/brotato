# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

Brotato（土豆兄弟）幸存者类游戏的 HTML5 Canvas 克隆版，使用 Electron 打包为桌面应用。所有游戏代码集中在单文件 `index.html` 中。

## 构建与运行

```bash
# 启动开发（Electron 窗口）
npm start

# 打包为目录
npm run pack

# 打包分发（NSIS 安装包 + 便携版）
npm run dist
npm run dist:portable
```

## 架构概览

全部游戏逻辑在 `index.html`（~1984 行），采用 Canvas 2D + DOM UI 混合架构。

### 游戏状态机

`game.state` 控制流程：`menu` → `playing` → `shopping` → `levelup` → `gameover` / `won`

### 核心系统（按 index.html 中的顺序）

| 区域 | 行号 | 说明 |
|------|------|------|
| CONFIG | 105-111 | 画布/竞技场/波次等常量 |
| Sprite 数据 | 130-230 | 16x16 像素调色板美术数据 |
| 游戏状态 | 247-274 | `game` 全局对象，管理所有运行时状态 |
| 武器定义 | 278-301 | 9 种武器 + 5 级品质 |
| 商店道具 | 318-332 | 13 种被动道具 |
| 升级选项 | 334-343 | 8 种等级升级 |
| 角色系统 | 345-358 | 5 个角色，每个有独特属性和初始武器 |
| 难度系统 | 353-358 | 4 档难度，影响敌人属性倍率 |
| 实体创建 | 360-493 | Player / Enemy(7种+ Boss) / Projectile / Pickup / Particle |
| 武器系统 | 495-571 | 自动瞄准、射击、近战、地雷、穿透、分裂 |
| 波次系统 | 573-684 | 生成逻辑、Boss 机制（每5波） |
| 商店与升级 | 686-976 | 购物 UI、武器合成（3合1/2合1可配置）、升级选择 |
| 游戏更新 | 978-1326 | 每帧更新：移动/碰撞/伤害/拾取/经验/等级 |
| 渲染系统 | 1327-1577 | Canvas 绘制：摄像机跟随/网格/实体/粒子/HUD |
| 音频系统 | 1578-1725 | Web Audio API，合成音效（无外部音频文件） |
| 游戏流程 | 1727-1843 | 开始/结束/重开/角色选择/设置面板 |
| 记录系统 | 1885-1942 | localStorage 存储历史记录，最多50条 |
| 游戏主循环 | 1944-1959 | requestAnimationFrame 驱动 |
| 输入系统 | 1961-1977 | WASD 移动 + R 重开 |

### 渲染架构

- Canvas 尺寸 960x640，竞技场 1600x1200
- 摄像机跟随玩家，处理屏幕抖动
- 支持冻结帧（freezeFrames）用于打击停顿
- DOM 元素覆盖 Canvas 之上处理 UI（HUD、商店、升级、弹窗）

### 数据流

```
requestAnimationFrame
  → gameLoop(time)
    → updateGame(dt) [游戏状态更新]
      → 玩家移动 (WASD)
      → 武器自动射击
      → 敌人 AI
      → 碰撞/伤害
      → 拾取/经验
      → 波次检查
    → render() [Canvas 绘制]
    → updateHUD() [DOM HUD 更新]
```

## 关键约定

- 所有游戏配置在 `CONFIG` 对象中
- 武器品质分 5 阶（普通/优秀/精良/史诗/传说），倍率 1x/1.6x/2.4x/3.5x/5x
- 伤害公式：`def.damage * player.dmgMult * tierMult`
- 护甲减伤：`damage = damage * (1 - armor * 0.1)`，护甲可为负
- 闪避上限 60%，先结算闪避再结算伤害
- Boss 每 5 波出现，击败后才结束波次
- 经验公式：`xpNext = 5 + game.level * 3`

## 文件结构

```
/
├── index.html       # 全部游戏代码（HTML + CSS + JS）
├── main.js          # Electron 主进程（窗口创建）
├── package.json     # 依赖与构建配置
├── dist/            # Electron Builder 输出目录
├── .claude/         # Claude 本地配置
└── node_modules/
```
