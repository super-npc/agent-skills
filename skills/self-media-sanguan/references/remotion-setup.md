# Remotion 项目设置

## 依赖检查

确保项目 `package.json` 包含：

```json
{
  "dependencies": {
    "remotion": "latest",
    "@remotion/player": "latest",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@remotion/cli": "latest",
    "typescript": "^5.0.0"
  }
}
```

## 项目文件结构

```
eating-melon/test/
├── public/
│   ├── audio.mp3        # 用户提供音频
│   └── avatar.png       # 内置头像
├── src/
│   ├── ReelsProductCard.tsx        # 主组件
│   ├── ReelsProductCard/
│   │   └── subtitles.json          # 用户提供字幕
│   ├── Root.tsx                    # 注册 Composition
│   └── Composition.tsx             # 自动导出配置
├── remotion.config.ts
└── package.json
```

## remotion.config.ts

```ts
import { Config } from "@remotion/cli/config";

export const {
  setVideoImageFormat,
  setFramesPerSecond,
} = Config;

setVideoImageFormat("png");
setFramesPerSecond(30);
```

## Root.tsx 示例

```tsx
import { Composition } from "remotion";
import { ReelsProductCardComponent, DURATION_IN_FRAMES } from "./ReelsProductCard";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelsProductCard"
        component={ReelsProductCardComponent}
        durationInFrames={DURATION_IN_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
```

## 渲染命令

```bash
npx remotion render src/index.ts ReelsProductCard out/video.mp4
```
