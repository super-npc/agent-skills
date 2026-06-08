---
name: "my-logs"
description: "Java 中文日志规范与模板。Invoke when 需要补齐关键日志（含空日志）、统一 @Slf4j、关键点[]、抽取 logPre、补齐 throw 异常 message（禁止空 message），并控制日志简洁避免刷屏。"
---

# my-logs（Java 中文日志规范）

## 强约束（必须遵守）

- 只允许新增日志：不允许改动原有业务逻辑（不改条件判断、不改返回值、不改异常处理、不调整调用顺序、不引入额外副作用）
- 不统计耗时：不新增 `System.currentTimeMillis()` / `StopWatch` 等耗时统计相关代码与日志
- 日志必须“少而关键”：默认每个方法 `info` 不超过 3-5 条；循环/批量处理内禁止 `info`（用 `debug` 且按需采样）
- 入口日志必须用 `info`：对外可调用方法第一条日志用 `info` 记录“入口+入参”，不要用 `debug` 作为入口日志
- 避免重复主键：同一链路/同一方法内，多条日志不要重复打印相同主键（如 deal/login/orderId）；主键在第一条日志输出即可，后续只打“结果/状态/原因”
- 异常 message 禁止为空：禁止 `throw new IllegalArgumentException("")` / `throw new RuntimeException("")`，必须补齐可定位的简短信息与关键主键

## 适用场景（什么时候用）

- 需要在生产环境可快速排查：一次请求从入口到落库、调用外部系统、发送 MQ 的全链路
- 需要统一日志风格：中文文案 + 关键点用[]圈起来 + SLF4J 占位符参数化
- 需要为方法补齐“入口参数日志”和“关键过程日志”，同时避免噪音与敏感信息泄露
- 同一类里日志前缀重复：将固定前缀抽成 `final` 变量复用，避免多处硬编码
- 发现空日志（例如 `log.info("")` / `log.debug("")`）：需要补成可检索、可串联的关键日志

## 统一约定

### 1) 类上统一使用 @Slf4j

在类上加注解并引入：

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class XxxService {
}
```

### 2) 日志全部使用中文

- 文案统一中文
- 关键节点用[]标识，建议只保留 1 个（最多 2 个）[]关键词；用 `-` 合并层级，避免 `[a][b][c]` 造成日志臃肿
- 推荐格式：`[模块-动作] 关键点 ...`
- 单条日志尽量短：只保留能定位问题的 2-6 个字段（主键 + 状态/结果）；不要为了“看起来完整”把所有字段都打出来
- 系统有链路追踪时：优先依赖 traceId 串联，同一方法内避免在每条日志重复打印同一组主键

示例：

```java
log.info("[风控规则-处理] 开始 订单号:{} 用户:{}", orderId, uid);
```

### 3) 方法第一行打印请求参数

每个对外可调用的方法（Controller/Service 的入口方法、MQ 消费入口、定时任务入口）第一行记录必要参数（尽量“少而关键”）。

- 入口日志必须使用 `info` 级别（关键链路）；不要用 `debug` 当入口，否则线上默认看不到
- 优先直接打印入参对象的 `toString`（前提：对象 `toString` 可控、无敏感信息、不会过大）
- 如果对象过大或包含敏感信息：只打摘要字段（id、数量、范围、关键开关），不要直接打印完整对象
- 需要可串联排查：带上 orderId / uid / bizId / traceId（如果有）等主键

示例（Service）：

```java
public void process(Mt5OrderDto dto) {
    log.info("[风控规则-处理] 入参:{}", dto);
}
```

示例（入口由 debug 改为 info，并尽量打印对象）：

```java
public SinglePositionTimeRes singlePositionTime(Mt5Deals mt5Deals) {
    log.info("{} 入口 入参:{}", logPre, mt5Deals);
    // ...
}
```

## 关键点日志（生产排查最有用的点）

下面这些点，优先使用 `info` 级别输出（关键链路），细节使用 `debug`（避免生产噪音）。

- 同一动作默认只打一条日志，避免“开始/结束”成对刷屏；只有在外部调用、异步/重试、需要区分阶段时才拆分多条

### 1) 入口 / 结束

```java
log.info("[订单-创建] 开始 商户订单号:{} 用户:{}", merchantOrderId, userId);
// ...
log.info("[订单-创建] 结束 商户订单号:{} 订单号:{}", merchantOrderId, orderId);
```

### 2) 分支与关键判断

```java
log.info("[订单-创建] 校验 商户订单号:{} 是否幂等:{}", merchantOrderId, idempotent);
```

### 3) 落库前后（带主键）

```java
log.info("[订单-创建] 落库前 商户订单号:{} 金额:{}", merchantOrderId, amount);
mapper.insert(order);
log.info("[订单-创建] 落库后 订单号:{} 商户订单号:{}", order.getId(), merchantOrderId);
```

### 4) 外部调用（请求摘要 / 返回摘要 / 异常）

```java
log.info("[支付-调用渠道] 开始 订单号:{} 渠道:{}", orderId, channel);
try {
    ChannelResp resp = channelClient.pay(req);
    log.info("[支付-调用渠道] 成功 订单号:{} 渠道流水号:{}", orderId, resp.getTradeNo());
} catch (Exception e) {
    log.error("[支付-调用渠道] 失败 订单号:{} 渠道:{}", orderId, channel, e);
    throw e;
}
```

### 5) 发送 MQ（建议只打一条）

```java
producer.sendMqBusiness(ruleId);
log.info("[风控-发送MQ] 订单号:{} 规则ID:{}", orderId, ruleId);
```

## 常用技巧（实战）

### 1) 用占位符，不做字符串拼接

推荐：

```java
log.info("[用户-查询] 用户ID:{} 状态:{}", userId, status);
```

避免：

```java
log.info("用户ID=" + userId + ", 状态=" + status);
```

### 2) 日志分级建议（避免生产噪音）

- `info`：关键链路、关键节点、可定位问题的“主干日志”
- `debug`：循环内明细、规则命中明细、SQL 前后的细节
- `warn`：非预期但可继续（重试、降级、兜底命中）
- `error`：业务失败/异常，必须带异常堆栈 `, e`

### 3) 异常日志必须携带关键业务主键

- 同一异常避免多层重复 `log.error(..., e)` 导致堆栈刷屏：只在边界层（Controller/MQ 消费入口/任务入口/对外接口适配层）记录一次，内部层优先透传异常

```java
log.error("[风控-处理] 异常 订单号:{} 用户:{}", orderId, uid, e);
```

### 4) throw 异常必须带 message（禁止空 message）

- `IllegalArgumentException`：用于入参/状态校验失败，message 必须包含“哪个参数/哪个状态非法 + 关键主键（如 orderId/uid/bizId）”，避免只写“参数错误”
- `RuntimeException`：用于未知/兜底失败，message 必须包含“发生了什么 + 关键主键”；如有原始异常必须透传 `cause`
- message 只放摘要字段：禁止把大对象（请求体、列表明细）拼进异常信息

反例：

```java
throw new IllegalArgumentException("");
throw new RuntimeException("");
```

推荐（入参/状态校验）：

```java
if (orderId == null) {
    throw new IllegalArgumentException("参数非法:orderId为空");
}
if (!valid) {
    throw new IllegalArgumentException("参数非法:valid=false, 订单号:" + orderId + ", 用户:" + uid);
}
```

推荐（包装异常并保留 cause）：

```java
try {
    channelClient.pay(req);
} catch (Exception e) {
    throw new RuntimeException("调用渠道失败, 订单号:" + orderId + ", 渠道:" + channel, e);
}
```

### 5) 避免重复主键值打印（链路追踪场景）

- 同一方法内多条日志：主键（deal/login/orderId/bizId）只在第一条日志打印即可，后续日志只打印“结果/状态/原因”
- 入口日志负责“可检索”，结果日志负责“可判断”，避免每条日志都堆主键导致刷屏

示例（反例：两条日志重复 deal/login）：

```java
if (log.isDebugEnabled()) {
    log.debug("{} 计算单笔持仓时间 deal:{} login:{} positionId:{}",
            logPre, mt5Deals.getDeal(), mt5Deals.getLogin(), mt5Deals.getPositionId());
}
SinglePositionTimeRes singlePositionTime = ruleValOrderFeatureService.singlePositionTime(mt5Deals);
if (log.isDebugEnabled()) {
    log.debug("{} 单笔持仓时间计算结果 deal:{} login:{} exec:{} holdTime:{} reason:{}",
            logPre, mt5Deals.getDeal(), mt5Deals.getLogin(),
            singlePositionTime.isExec(), singlePositionTime.getHoldTime(), singlePositionTime.getRejectReason());
}
```

推荐（主键只打一遍，后续只打结果）：

```java
if (log.isDebugEnabled()) {
    log.debug("{} 计算单笔持仓时间 入参 deal:{} login:{} positionId:{}",
            logPre, mt5Deals.getDeal(), mt5Deals.getLogin(), mt5Deals.getPositionId());
}
SinglePositionTimeRes singlePositionTime = ruleValOrderFeatureService.singlePositionTime(mt5Deals);
if (log.isDebugEnabled()) {
    log.debug("{} 单笔持仓时间 结果 exec:{} holdTime:{} reason:{}",
            logPre, singlePositionTime.isExec(), singlePositionTime.getHoldTime(), singlePositionTime.getRejectReason());
}
```

执行步骤（存量日志去重，后续调用按此执行）：

- 先确认“本方法内哪一条日志”作为入口日志：把主键（deal/login/orderId/bizId/positionId 等）集中打印在入口日志里
- 再逐条检查该方法后续日志：凡是已经在入口日志出现过的主键，后续日志一律移除，仅保留结果字段（exec/status/holdTime/reason/count 等）
- 对“跳过/分支”日志：只打印跳过原因/分支条件结果（action/reason/entry 等），不要重复打印 deal/login
- 对异常日志：必须带主键（即使重复也允许），保证在只有 error 日志时仍可定位；同一异常避免多层重复 `log.error(..., e)`

示例（入口已打印 deal/login，后续跳过不重复打印）：

```java
log.info("{} 预校验开始 deal:{} login:{} action:{}",
        logPre, mt5Deals.getDeal(), mt5Deals.getLogin(), action);
if (skip) {
    log.info("{} 预校验跳过 非交易动作 action:{}", logPre, action);
}
```

### 6) 控制打印对象大小（避免超大对象/循环）

- 优先打印：id、数量、状态、类型、范围
- 大对象（请求体、规则树、响应明细）：
  - 仅在 `debug` 打
  - 或只打摘要字段（如 `size`、`hash`、`topN`）

### 7) 循环中的日志默认 debug，必要时采样

```java
if (log.isDebugEnabled()) {
    log.debug("[风控-规则明细] 订单号:{} 规则ID:{} 命中:{}", orderId, ruleId, hit);
}
```

### 8) 对“关键点”固定关键词，方便 grep/检索

- 每条关键日志都包含稳定关键词，固定放在 `[]` 之后：例如 `事务开始`、`落库后`、`发送MQ`
- 关键字段位置固定：`订单号:{} 用户:{} ...`

### 9) 不要打印敏感信息

- 密码、验证码、密钥、token、身份证、银行卡、手机号全量、邮箱全量等
- 必须脱敏：只打印前后几位

### 10) 统一日志前缀复用（减少硬编码字符串）

同一类里同一阶段/模块的日志前缀重复时，抽成类属性复用，避免每条日志都写一遍长前缀：

```java
private final String logPre = "[阶段2:执行规则]";

log.info("{} 事务开始 订单号:{}", logPre, orderId);
log.info("{} 规则落库完成 数量:{} 订单号:{}", logPre, size, orderId);
log.error("{} 执行异常回滚 订单号:{}", logPre, orderId, e);
```

### 11) 禁止空日志（必须补齐关键字段）

空日志（例如 `log.info("")`）在生产排查中没有价值，必须替换为有信息的日志，至少带上 1-2 个关键主键（如：`订单号 / 日志ID / 规则ID / accountId / uid`）。

推荐写法：

```java
log.info("{} 绑定证据完成 日志ID:{} 订单号:{} 规则ID:{}", logPre, ruleLogId, orderId, ruleId);
```

## 快速模板（粘贴即用）

### 入口模板

```java
log.info("[风控规则-处理] 入参:{}", dto);
```

### 关键过程模板

```java
log.info("[风控规则-处理] 事务开始 订单号:{}", orderId);
log.info("[风控规则-处理] 事务结束 订单号:{}", orderId);
riskExecuteBusinessProcessProducer.sendMqBusiness(1L);
log.info("[风控规则-处理] 事务提交后发送MQ 订单号:{} 用户:{}", orderId, uid);
```
