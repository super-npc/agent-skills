---
name: smzl-oha
description: |
  使用 oha (https://github.com/hatoo/oha) 进行 HTTP 接口压测。
  触发条件：用户提到"压测""oha""benchmark""压力测试""QPS""并发测试"、
  分享了 oha 输出结果需要解读分析、需要生成压测命令、或讨论压测结果中的超时/错误。
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
metadata:
  trigger: oha 压测、HTTP benchmark、并发测试、压力测试
  tool: ghcr.io/hatoo/oha Docker 容器
---

# smzl-oha: oha HTTP 压测

## 工具说明

使用 Docker 运行 oha，避免本地编译：

```bash
docker run --rm -it --network=host ghcr.io/hatoo/oha:1.15 <URL>
```

> 查看 https://github.com/hatoo/oha/blob/master/README.md 的 Usage 用法。

## 核心参数

| 参数 | 说明 |
|---|---|
| `-n N` | 总请求数 |
| `-c N` | 并发连接数 |
| `-z DURATION` | 持续时长模式（与 `-n` 二选一），如 `-z 30s` |
| `-t DURATION` | 单个请求超时，如 `-t 10s` |
| `-H "K: V"` | 请求头 |
| `--no-tui` | 关闭实时 TUI（高并发下减少客户端开销） |
| `--network=host` | 避免 Docker 网桥 NAT 性能损耗 |
| `--ulimit nofile=65536:65536` | **重要**：解除 fd 限制，Docker 默认 1024，高并发必加 |
| `-q N` | 每秒请求速率限制（QPS 控速） |

## 常用压测模板

### 快速摸底

```bash
docker run --rm -it --network=host ghcr.io/hatoo/oha:1.15 \
  -n 200 -c 10 -H "Authorization: Bearer <token>" <URL>
```

### 中等压力

```bash
docker run --rm -it --network=host ghcr.io/hatoo/oha:1.15 \
  -n 1000 -c 50 -H "Authorization: Bearer <token>" <URL>
```

### 高强度压力

```bash
docker run --rm -it --network=host ghcr.io/hatoo/oha:1.15 \
  -n 5000 -c 100 -H "Authorization: Bearer <token>" <URL>
```

### 持续时长模式

```bash
docker run --rm -it --network=host ghcr.io/hatoo/oha:1.15 \
  -z 30s -c 50 -H "Authorization: Bearer <token>" <URL>
```

### 梯度加压找拐点

```bash
for c in 200 500 800 1200; do
  echo "=== 并发: $c ==="
  docker run --rm --network=host --ulimit nofile=65536:65536 ghcr.io/hatoo/oha:1.15 \
    -n 10000 -c $c -t 15s --no-tui \
    -H "Authorization: Bearer <token>" <URL>
done
```

## 结果解读

### 关键指标

| 指标 | 含义 |
|---|---|
| Success rate | 成功率，低于 99% 需要关注 |
| Requests/sec | 吞吐，系统当前能稳定处理的上限 |
| Average / P50 / P90 / P99 | 延迟分布，P99 是长尾指标 |
| DNS+dialup | 建连耗时，>100ms 说明连接池/accept 队列饱和 |

### 常见错误

| 错误 | 原因 | 修复 |
|---|---|---|
| `Too many open files (os error 24)` | Docker ulimit nofile=1024 不够 | 加 `--ulimit nofile=65536:65536` |
| `timeout` 大量出现 | 服务端处理超时 / 队列堆积 | 排查 DB 连接池、慢 SQL、线程池 |

### 判断"拐点"

梯度加压时，找到**吞吐不再增长、超时率从 ~0% 抬头**的那一级并发数——这就是接口的最大可持续并发。

## 输出到文档

每轮压测结果记录到 `<workspace>/压测结果/<接口名>.md`，格式参考：

```markdown
## 接口: <名称>

### <场景描述> (<并发数>并发, <请求数>请求)

**结果：**

| 指标 | 数值 |
|---|---|
| 成功率 | xx% |
| 吞吐 | xx req/s |
| P50 / P90 / P99 | x / x / x |
| 超时/错误 | xxx |
```
