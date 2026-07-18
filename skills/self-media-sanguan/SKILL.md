---
name: self-media-sanguan
description: 基于 Remotion 的「凡间清醒」短视频工作流。输入 MP3 + 字幕文件，使用内置动画模板库和固定用户信息，自动生成带片头/片尾的 9:16 竖版视频。
---

# self-media-sanguan

## 概述

将用户提供的 MP3 音频和字幕 JSON 封装成一段完整的 9:16 竖版短视频。视频长度由音频/字幕决定，包含：

1. **片头**（4 秒）：用户名 + 头像，可选 片頭片尾 模板效果
2. **正片**（音频时长）：字幕高亮 + 底部进度条 + 背景粒子/光晕
3. **片尾**（6 秒）：用户名 + 头像 + 结束语

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
2. `subtitles` 字幕 JSON 文件路径（格式见 `references/subtitle-format.md`）
3. 目标 Remotion 项目路径（默认使用当前 workspace 下的 `eating-melon/test`）

## 输出规格

- **Composition id**: `ReelsProductCard`
- **尺寸**: 1080 × 1920（9:16）
- **fps**: 30
- **时长**: 片头 4s + 音频时长 + 片尾 6s
- **背景色**: `#111827`

## 工作流

1. 读取用户输入的 MP3 和字幕文件。
2. 将 MP3 复制为 `public/audio.mp3`，字幕复制为 `src/ReelsProductCard/subtitles.json`。
3. 将内置头像 `assets/avatar.png` 复制为项目 `public/avatar.png`。
4. 按 `references/remotion-setup.md` 检查项目依赖和 `remotion.config.ts`。
5. 生成 `src/ReelsProductCard.tsx`（完整模板见 `references/component-template.md`）。
6. 更新 `src/Root.tsx` 注册 `ReelsProductCard` Composition。
7. 运行 `npm install` 和 `npx remotion render` 生成视频。

## 模板使用建议

- 片头片尾优先从 `assets/animation-templates/片頭片尾/` 选择带背景版模板。
- 背景效果优先从 `文字特效/霓虹發光字卡`、`片頭片尾/粒子爆發片頭`、`Logo動畫/光暈脈衝 Logo` 中借鉴。
- 所有模板默认使用「透明背景版」叠加到 `#111827` 底色上，避免覆盖用户背景。

## 注意事项

- 字幕 JSON 必须有 `start`（秒）、`end`（秒）、`text` 字段。
- 片头/片尾模板不要遮挡用户头像和用户名。
- 若项目已有 `src/ReelsProductCard.tsx`，询问是否覆盖。
