#!/usr/bin/env bash
set -euo pipefail

# self-media-sanguan 项目脚手架
# 用法: ./scripts/scaffold.sh <项目路径> <mp3路径> <字幕JSON路径> [--copy-template]

PROJECT_DIR="${1:-}"
MP3_FILE="${2:-}"
SUB_FILE="${3:-}"
COPY_TEMPLATE="${4:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

if [[ -z "$PROJECT_DIR" || -z "$MP3_FILE" || -z "$SUB_FILE" ]]; then
  echo "用法: $0 <项目路径> <mp3路径> <字幕JSON路径> [--copy-template]"
  exit 1
fi

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "错误: 项目目录不存在: $PROJECT_DIR"
  exit 1
fi

if [[ ! -f "$MP3_FILE" ]]; then
  echo "错误: MP3 文件不存在: $MP3_FILE"
  exit 1
fi

if [[ ! -f "$SUB_FILE" ]]; then
  echo "错误: 字幕文件不存在: $SUB_FILE"
  exit 1
fi

mkdir -p "$PROJECT_DIR/public"
mkdir -p "$PROJECT_DIR/src/ReelsProductCard"

echo "[1/3] 复制音频和字幕..."
cp "$MP3_FILE" "$PROJECT_DIR/public/audio.mp3"
cp "$SUB_FILE" "$PROJECT_DIR/src/ReelsProductCard/subtitles.json"

echo "[2/3] 复制内置头像..."
cp "$SKILL_DIR/assets/avatar.png" "$PROJECT_DIR/public/avatar.png"

echo "[3/3] 检查项目结构..."
for f in package.json remotion.config.ts src/index.ts; do
  if [[ ! -f "$PROJECT_DIR/$f" ]]; then
    echo "警告: 项目缺少 $f，请按 references/remotion-setup.md 初始化项目"
  fi
done

if [[ "$COPY_TEMPLATE" == "--copy-template" ]]; then
  echo "[额外] 复制组件模板..."
  # 提取 references/component-template.md 中代码块到 ReelsProductCard.tsx
  awk '/```tsx$/{flag=1;next}/```$/{flag=0}flag' \
    "$SKILL_DIR/references/component-template.md" \
    > "$PROJECT_DIR/src/ReelsProductCard.tsx"
  echo "已生成 $PROJECT_DIR/src/ReelsProductCard.tsx"
fi

echo "完成。下一步: 更新 Root.tsx 注册 ReelsProductCard，然后运行 npx remotion render。"
