---
name: amis-enum
description: 创建继承 AmisEnum 的枚举类型代码
allowed-tools: 
disable: false
---

# Enum Generator Skill

## 概述

此技能用于快速生成继承 `bronya.shared.module.common.type.AmisEnum` 的枚举类型代码。

## 使用场景

当用户请求创建新枚举时使用此技能，例如：
- "创建一个订单状态枚举"
- "添加一个商品类型枚举"

## 输入要求

用户提供：
1. 枚举名称（如 `OrderStatus`、`ProductType`）
2. 枚举值列表，每个枚举值包含：描述文字、颜色

## 代码模板

生成的枚举代码格式如下：

```java
@Getter
@AllArgsConstructor
public enum 枚举名称 implements AmisEnum {
    枚举值1("描述1", Color.颜色1),
    枚举值2("描述2", Color.颜色2),
    // 更多枚举值...

    ;

    private final String desc;
    private final Color color;
}
```

## 实现步骤

### 1. 确定枚举位置

**重要**：将生成的枚举直接放置在用户当前编辑的 class 类中，作为该类的内部枚举。例如，如果用户当前正在编辑 `DsGoodsSku.java`，则将枚举添加为 `DsGoodsSku` 类的内部枚举。

### 2. 生成枚举代码

按照以下格式生成代码：

```java
@Getter
@AllArgsConstructor
public enum 枚举名称 implements AmisEnum {
    值1("描述1", Color.颜色1),
    值2("描述2", Color.颜色2),
    值3("描述3", Color.颜色3),
    // 用户提供的枚举值
    ;

    private final String desc;
    private final Color color;
}
```

### 3. 确定可用颜色（每次必须执行）

**重要**：不能使用固定的颜色列表。每次生成枚举前，必须先搜索 `bronya.shared.module.common.type.Color` 枚举的可用值。

使用以下搜索方式获取 Color 枚举中实际定义的颜色值：
- 搜索项目中使用 `Color.` 的代码，例如：`Color.纯绿`、`Color.深绿色` 等
- 从搜索结果中提取所有不同的颜色值

示例搜索命令：
```bash
grep -r "Color\.\w+" --include="*.java" /path/to/project
```

提取结果中实际使用的颜色值，然后根据枚举值的语义选择合适的颜色。

### 颜色选择建议

根据枚举值的语义选择合适的颜色：
- **正常/成功** → `纯绿`、`深绿色`
- **进行中/活跃** → `深绿色`、`橙色`、`橄榄`
- **警告/提醒** → `橙色`、`橙红色`
- **错误/失败/关闭** → `深红色`、`纯红`、`灰色`
- **未激活/禁用** → `灰色`
- **维护中** → `靛青`
- **完成/已结算** → `纯绿`
- **创建/新增** → `军校蓝`、`橙色`

### 4. 验证

确保：
- 枚举实现 `AmisEnum` 接口
- 包含 `desc` 和 `color` 两个字段
- 使用 `@Getter` 和 `@AllArgsConstructor` 注解

## 输出示例

假设用户要创建 `OrderStatus` 枚举，包含：正常、完成、取消

生成的代码：
```java
@Getter
@AllArgsConstructor
public enum OrderStatus implements AmisEnum {
    normal("正常", Color.纯绿),
    completed("完成", Color.深绿色),
    cancelled("取消", Color.深红色),
    ;

    private final String desc;
    private final Color color;
}
```
