---
name: "smzl-enum"
description: "统一VO中枚举字段注解文案：去掉@Schema/@ExcelProperty/@NotNull等里的[...]枚举明细，并在@Schema描述末尾追加(枚举:枚举类名)。当用户要求批量规范枚举字段文案时调用。"
---

# smzl-enum

## 目标

对指定 VO 目录内所有“枚举字段”进行文案规范化：

- `@Schema(description = "...[A:a,B:b]...")` → 去掉 `[...]`，并在描述末尾追加 `(枚举:EnumType)`
- 校验注解 `@NotNull/@NotEmpty/@NotBlank/... (message="...")` 中如包含 `[...]`，仅保留 `[]` 前的主文案并保留原有“不能为空”等后缀
- 若同一字段存在 `@ExcelProperty("...")` 且也包含 `[...]`，同步按 `@Schema` 的新文案更新（含 `(枚举:EnumType)`）

## 适用范围

- 仅处理 VO（一般位于 `controller/**/vo/*.java`）
- 仅处理“枚举明细方括号”这种模式：`[...]` 内部包含 `:`（例如 `HIGH:高危`）
- 不处理数组/时间范围示例等非枚举含义的方括号（例如 `example="[2024-01-01,2024-01-02]"`、`LocalDateTime[]`）

## 输入

- 一个或多个待处理目录（优先由用户给出绝对路径）
- 若用户未给目录：默认从 `aifo-module-risk-server/src/main/java/**/controller/**/vo` 开始搜

## 执行步骤（建议流程）

1. 扫描与定位
   - 列出目标目录下所有 `*.java`
   - 全量检索以下特征以定位候选行（需要支持多行 `@Schema`）：
     - `@Schema(description = ".*\\[.*:.*\\].*")`
     - `message = ".*\\[.*:.*\\].*"`
     - `@ExcelProperty(".*\\[.*:.*\\].*")`

2. 判断枚举类型名
   - 优先从字段声明中取类型名：`private <EnumType> <field>;`
   - 若字段是 `List<EnumType>` / `Set<EnumType>` 等容器：取泛型内类型名
   - 若字段是 `Integer/String` 等非枚举：跳过（说明方括号可能不是枚举）

3. 文案改写规则
   - `@Schema.description`
     - 从描述中移除 `[...]`（含括号本身）
     - 将描述改为：`原描述去掉[...]后的文本 + (枚举:EnumType)`
     - 若原描述末尾已有右括号 `)`：仍直接追加 `(枚举:EnumType)`，不做额外空格处理（保持项目风格）
   - 校验注解 `message`
     - 删除 `[...]`（含括号本身）
     - 保留原有后缀，例如：`"风险等级[...]不能为空"` → `"风险等级不能为空"`
   - `@ExcelProperty`
     - 若原值包含 `[...]`，同步改为与 `@Schema.description` 相同的主文案（含 `(枚举:EnumType)`）

4. 复核与防误伤
   - 仅当 `[...]` 内部包含 `:` 才认定为“枚举明细”
   - 对跨行 `@Schema(...)` 需要确保整体 `description` 被正确替换

5. 校验
   - 对被修改模块执行一次编译（可跳过测试），确保无语法/导入问题

## 示例

输入：

```java
@Schema(description = "规则输出风险等级[HIGH:高危,MEDIUM:中危,LOW:低危]", requiredMode = Schema.RequiredMode.REQUIRED)
@NotNull(message = "规则输出风险等级[HIGH:高危,MEDIUM:中危,LOW:低危]不能为空")
private RiskLevel riskLevel;
```

输出：

```java
@Schema(description = "规则输出风险等级(枚举:RiskLevel)", requiredMode = Schema.RequiredMode.REQUIRED)
@NotNull(message = "规则输出风险等级不能为空")
private RiskLevel riskLevel;
```

## 交付物

- 完成所有命中 VO 的注解文案规范化改动
- 给出修改文件清单（路径即可）
- 编译通过证明（输出节选即可）
