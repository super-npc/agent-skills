# 字幕 JSON 格式

`subtitles.json` 必须是数组，每个元素包含：

```json
[
  {
    "start": 0.5,
    "end": 2.8,
    "text": "这是第一句字幕"
  },
  {
    "start": 3.0,
    "end": 5.5,
    "text": "这是第二句字幕"
  }
]
```

- `start` / `end`：单位为秒，用于字幕时间同步。
- `text`：字幕文本，支持中英文，不需要手动换行。
- 时间轴必须连续，不要有重叠。

音频总时长 = `subtitles[subtitles.length - 1].end`，用于计算视频总帧数。
