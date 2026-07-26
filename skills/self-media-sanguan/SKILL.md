---
name: self-media-sanguan
description: 基于 Remotion 的「凡间清醒」短视频工作流。输入 MP3 + 字幕文件，使用内置动画模板库和固定用户信息，自动生成带片头/片尾的 9:16 竖版视频。同时支持从字幕内容提炼小红书发布文案（标题 + 正文）。
---

# self-media-sanguan

## 概述

将用户提供的 MP3 音频和字幕封装成一段完整的 9:16 竖版短视频。视频长度由音频/字幕决定，包含：

1. **片头**（2 秒）：用户名 + 头像 + 标语
2. **正片**（音频时长）：字幕高亮 + 底部进度条 + 背景粒子/光晕 + 左上角用户信息条
3. **片尾**（6 秒）：用户名 + 头像 + 订阅 CTA + 结束语

## 内置资源（无需用户指定路径）

| 资源 | 路径 |
|---|---|
| 用户名 | `凡间清醒` |
| 用户头像 | `assets/avatar.png` |
| 动画模板库 | `assets/animation-templates/` |
| 背景配色 | 金色 `#facc15` + 橙色 `#f97316` |

## 必需输入

用户需提供：

1. `mp3` 音频文件路径
2. `subtitles` 字幕文件路径（支持 **SRT** 或 **JSON** 格式）
3. 目标 Remotion 项目路径（默认使用当前 workspace 下的 `eating-melon/test`）

## 输出规格

- **尺寸**: 1080 × 1920（9:16）
- **fps**: 30
- **时长**: 片头 2s + 音频时长 + 片尾 6s
- **背景色**: `#09090b`

## 工作流

### 初次创建（首个视频）

当项目还没有 `ReelsProductCard` 时，创建初始模板：

1. 读取用户输入的 MP3 和字幕文件。
2. **若字幕为 SRT 格式**，自动解析为 JSON（`{ start, end, text }`），合并间隔 <0.15s 的短句，写入 `src/ReelsProductCard/subtitles.json`。
3. 将 MP3 复制为 `public/audio.mp3`。
4. 将内置头像 `assets/avatar.png` 复制为项目 `public/avatar.png`。
5. 创建/更新 `src/ReelsProductCard.tsx`：修改 `DURATION_SECONDS`（取字幕最后 `end` 时间）、更新 `KEYWORDS` 数组匹配新内容主题。
6. 按 `references/remotion-setup.md` 检查项目依赖和 `remotion.config.ts`。
7. 更新 `src/Root.tsx` 注册 `ReelsProductCard` Composition。
8. 运行 `npm install` 和 `npx remotion render` 生成视频。
9. **生成本期的小红书发布内容**（标题 + 正文描述 + 标签）。

### 后续新增场景（不修改已有代码）

**每次新增视频必须创建新场景，绝对不能修改已存在的 `ReelsProductCard.tsx` 或其他已有场景文件。**

命名规则：
- **场景名称**：`Scene` + MP3 文件名（不含扩展名）
- **Composition id**：与场景名称相同
- **组件名称**：`{SceneName}Component`

文件结构：

```
src/
  Scene{mp3文件名}/
    subtitles.json          ← 该场景的字幕数据
  Scene{mp3文件名}.tsx      ← 该场景的组件文件（复制自 ReelsProductCard.tsx）
public/
  audio-{mp3文件名}.mp3     ← 该场景的音频文件
```

操作步骤：

1. **解析 SRT 字幕** → 写入 `src/Scene{filename}/subtitles.json`
2. **复制 MP3** → `public/audio-{filename}.mp3`
3. **创建新场景组件** → `src/Scene{filename}.tsx`：
   - 复制 `ReelsProductCard.tsx` 的全部内容作为模板
   - 修改 `import subtitles from` 指向本场景的 `subtitles.json`
   - 修改所有导出常量名，追加 `_{filename}` 后缀（如 `DURATION_SECONDS_4cff9a0d`）
   - 修改 `DURATION_SECONDS` 为字幕最后 `end` 时间
   - 更新 `KEYWORDS` 数组匹配新内容主题
   - 修改 `Audio src` 指向本场景的音频文件
   - 修改导出组件名（`export const {Name}Component` 和 `export default`）
   - 组件内部引用对应的改名后的常量
4. **注册 Composition** → 在 `src/Root.tsx` 中新增一个 `<Composition>` 条目，不删除已有条目
5. **渲染** → `npx remotion render {SceneName} out/video-{filename}.mp4`

### 小红书内容生成

每次创建新视频时，根据字幕内容自动提炼：

- **标题**：15-30 字，吸引眼球，带 emoji，突出故事核心冲突
- **正文**：200-400 字，用口语化叙事还原故事，分段带 emoji，最后留互动提问
- **标签**：5-10 个 `#话题`，覆盖情感/家庭/热点关键词

生成后直接输出给用户，方便一键复制发布。

## 模板使用建议

- 片头片尾优先从 `assets/animation-templates/片頭片尾/` 选择带背景版模板。
- 背景效果优先从 `文字特效/霓虹發光字卡`、`片頭片尾/粒子爆發片頭`、`Logo動畫/光暈脈衝 Logo` 中借鉴。
- 所有模板默认使用「透明背景版」叠加到 `#09090b` 底色上，避免覆盖用户背景。

## 注意事项

- 字幕 JSON 必须有 `start`（秒）、`end`（秒）、`text` 字段。
- SRT 格式需解析为同样 JSON 结构后再使用。
- 片头/片尾模板不要遮挡用户头像和用户名。
- **禁止修改已有场景文件**：每次新增视频必须创建新的 `Scene{filename}.tsx`，不得修改 `ReelsProductCard.tsx` 或任何已有场景。
- 若有基础模板 `ReelsProductCard.tsx`，将其作为新场景的复制起点，但保持原文件不变。
- 场景文件的组件常量名需添加 `_{filename}` 后缀以避免全局命名冲突。
